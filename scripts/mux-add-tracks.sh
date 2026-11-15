#!/usr/bin/env bash
# Adds the chapters and captions tracks to the Mux asset, so both are served by Mux:
#   chapters → https://stream.mux.com/{PLAYBACK_ID}/chapters/{TRACK_ID}.json (read by the skin)
#   captions → in the HLS stream itself
#
# Mux downloads each WebVTT file from a public URL, so the files are read from this repo on GitHub, pinned to a commit.
# Usage: scripts/mux-add-tracks.sh [commit]   (default: the current HEAD, which must be pushed)
# Needs: curl, and MUX_TOKEN_ID / MUX_TOKEN_SECRET in .env.local (see that file).

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ASSET_ID="51mycH1AIo3qh31RFOr002t3XOVvfpbDNKc02snvF6gz4"
PLAYBACK_ID="iYNPL02029CpHpmg2Hc21G9hWsj3LEYq9bTqf02ipLkW02k"
REPO="MLangendijk/purposebuiltskin"
COMMIT="${1:-$(git -C "$ROOT" rev-parse HEAD)}"
RAW="https://raw.githubusercontent.com/$REPO/$COMMIT/apps/preview/public/media"

# shellcheck disable=SC1091
source "$ROOT/.env.local"
: "${MUX_TOKEN_ID:?Set MUX_TOKEN_ID in .env.local}" "${MUX_TOKEN_SECRET:?Set MUX_TOKEN_SECRET in .env.local}"

log() { printf '\033[1m›\033[0m %s\n' "$*"; }

mux() { curl -sf -u "$MUX_TOKEN_ID:$MUX_TOKEN_SECRET" -H 'Content-Type: application/json' "$@"; }

# Prints the new track's id.
add_track() {
  local body="$1"
  mux -X POST "https://api.mux.com/video/v1/assets/$ASSET_ID/tracks" -d "$body" | sed -E 's/.*"id":"([^"]+)".*/\1/'
}

log "Checking the files are public at $RAW"
for file in chapters.vtt captions.vtt; do
  curl -sfo /dev/null "$RAW/$file" || { echo "Not reachable: $RAW/$file (push first?)" >&2; exit 1; }
done

log "Adding chapters track"
chapters_id="$(add_track "{\"url\":\"$RAW/chapters.vtt\",\"type\":\"text\",\"text_type\":\"chapters\",\"language_code\":\"en\",\"name\":\"Looks\"}")"

log "Adding captions track"
captions_id="$(add_track "{\"url\":\"$RAW/captions.vtt\",\"type\":\"text\",\"text_type\":\"subtitles\",\"language_code\":\"en\",\"name\":\"English (sound)\",\"closed_captions\":true}")"

log "Waiting for Mux to ingest the chapters"
for _ in $(seq 1 30); do
  if curl -sfo /dev/null "https://stream.mux.com/$PLAYBACK_ID/chapters/$chapters_id.json"; then break; fi
  sleep 2
done

log "Done"
echo "chapters track: $chapters_id"
echo "captions track: $captions_id"
echo "Put the chapters track id in apps/preview/src/frame/player.tsx (MUX_CHAPTERS_TRACK)."
