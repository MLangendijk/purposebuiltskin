#!/usr/bin/env bash
# Uploads a film's video to Mux as a new public asset, straight from this machine (a direct upload, so the file needn't
# be public first), waits until it's ready, and writes its asset and playback ids into the film's config.
#
# Usage: scripts/mux-upload.sh <film>     e.g. scripts/mux-upload.sh vertical
# Then:  scripts/mux-set-meta.sh <film> and scripts/mux-add-tracks.sh <film> (after pushing the text files).

set -euo pipefail
source "$(dirname "$0")/mux-common.sh" "$@"

[[ -z "$ASSET_ID" ]] || { echo "$FILM already has asset $ASSET_ID; clear ASSET_ID in $FILM_CONF to upload again." >&2; exit 1; }
FILE="$ROOT/$MEDIA_DIR/$VIDEO_FILE"
[[ -f "$FILE" ]] || { echo "No video at $FILE" >&2; exit 1; }

log "Creating a direct upload"
upload="$(mux -X POST https://api.mux.com/video/v1/uploads -d '{
  "cors_origin": "*",
  "new_asset_settings": { "playback_policies": ["public"], "video_quality": "basic" }
}')"
upload_id="$(jq -r '.data.id' <<<"$upload")"
upload_url="$(jq -r '.data.url' <<<"$upload")"

log "Uploading $VIDEO_FILE"
curl -sf -X PUT -H 'Content-Type: video/mp4' --upload-file "$FILE" "$upload_url" >/dev/null

log "Waiting for the asset"
for _ in $(seq 1 90); do
  ASSET_ID="$(mux "https://api.mux.com/video/v1/uploads/$upload_id" | jq -r '.data.asset_id // empty')"
  [[ -n "$ASSET_ID" ]] && break
  sleep 2
done
[[ -n "$ASSET_ID" ]] || { echo "Mux made no asset from upload $upload_id" >&2; exit 1; }

for _ in $(seq 1 120); do
  asset="$(mux "https://api.mux.com/video/v1/assets/$ASSET_ID")"
  status="$(jq -r '.data.status' <<<"$asset")"
  [[ "$status" == "preparing" ]] || break
  sleep 3
done
[[ "$status" == "ready" ]] || { echo "Asset $ASSET_ID ended up $status" >&2; exit 1; }
PLAYBACK_ID="$(jq -r '.data.playback_ids[0].id' <<<"$asset")"

sed -i '' "s/^ASSET_ID=.*/ASSET_ID=\"$ASSET_ID\"/; s/^PLAYBACK_ID=.*/PLAYBACK_ID=\"$PLAYBACK_ID\"/" "$FILM_CONF"
echo "asset: $ASSET_ID"
echo "playback: $PLAYBACK_ID (written to $FILM_CONF)"
