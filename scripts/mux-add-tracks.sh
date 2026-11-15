#!/usr/bin/env bash
# Puts a film's chapters and captions tracks on its Mux asset, so both are served by Mux:
#   chapters → https://stream.mux.com/{PLAYBACK_ID}/chapters/{TRACK_ID}.json (read by the skin)
#   captions → in the HLS stream itself
#
# Safe to re-run: errored tracks are removed, and a ready track is left alone, except a chapters track whose file
# differs from the local chapters.json, which is replaced (its id changes, so update the player).
# Mux downloads each file from a public URL, so the files are read from this repo on GitHub, pinned to a commit.
# Chapters go up in Apple's JSON chapters format (chapters.json): Mux fails validation on a WebVTT chapters file.
#
# Usage: scripts/mux-add-tracks.sh <film> [commit]   (default commit: the current HEAD, which must be pushed)
# Needs: curl, jq, and the Mux token (see scripts/mux-common.sh).

set -euo pipefail
source "$(dirname "$0")/mux-common.sh" "$1"

REPO="MLangendijk/purposebuiltskin"
COMMIT="${2:-$(git -C "$ROOT" rev-parse HEAD)}"
RAW="https://raw.githubusercontent.com/$REPO/$COMMIT/$MEDIA_DIR"
API="$(asset_api)"

# Text tracks of one kind ("chapters" or "subtitles"), as "id status" lines.
tracks() { mux "$API" | jq -r --arg kind "$1" '.data.tracks[] | select(.text_type == $kind) | "\(.id) \(.status)"'; }

# Waits until the track settles, then prints its status (and Mux's error, if any, on stderr).
settle() {
  local id="$1" status
  for _ in $(seq 1 60); do
    status="$(mux "$API" | jq -r --arg id "$id" '.data.tracks[] | select(.id == $id) | .status')"
    [[ "$status" == "preparing" ]] || break
    sleep 2
  done
  echo "$status"
  [[ "$status" == "ready" ]] || mux "$API" | jq -r --arg id "$id" '.data.tracks[] | select(.id == $id) | .error' >&2
}

# Whether Mux serves a chapters track that matches the local chapters.json.
chapters_current() {
  cmp -s <(curl -sf "https://stream.mux.com/$PLAYBACK_ID/chapters/$1.json") "$ROOT/$MEDIA_DIR/chapters.json"
}

# Makes sure one ready, current track of this kind exists; prints its id.
ensure_track() {
  local kind="$1" body="$2" id status
  while read -r id status; do
    [[ -z "$id" ]] && continue
    if [[ "$status" == "ready" && "$kind" == "chapters" ]] && ! chapters_current "$id"; then
      log "Replacing chapters track $id: chapters.json changed"
      mux -X DELETE "$API/tracks/$id" >/dev/null
      continue
    fi
    if [[ "$status" == "ready" ]]; then echo "$id"; return; fi
    if [[ "$status" == "errored" ]]; then
      log "Removing errored $kind track $id"
      mux -X DELETE "$API/tracks/$id" >/dev/null
    fi
  done < <(tracks "$kind")

  log "Adding $kind track"
  id="$(mux -X POST "$API/tracks" -d "$body" | jq -r '.data.id')"
  status="$(settle "$id")"
  [[ "$status" == "ready" ]] || { echo "The $kind track ended up $status" >&2; exit 1; }
  echo "$id"
}

log "Checking the files are public at $RAW"
for file in chapters.json captions.vtt; do
  curl -sfo /dev/null "$RAW/$file" || { echo "Not reachable: $RAW/$file (push first?)" >&2; exit 1; }
done

chapters_id="$(ensure_track chapters "{\"url\":\"$RAW/chapters.json\",\"type\":\"text\",\"text_type\":\"chapters\",\"language_code\":\"en\",\"name\":\"Looks\"}")"
captions_id="$(ensure_track subtitles "{\"url\":\"$RAW/captions.vtt\",\"type\":\"text\",\"text_type\":\"subtitles\",\"language_code\":\"en\",\"name\":\"English (sound)\",\"closed_captions\":false}")"

log "Chapters served at https://stream.mux.com/$PLAYBACK_ID/chapters/$chapters_id.json"
echo "chapters track: $chapters_id"
echo "captions track: $captions_id"
echo "Put the chapters track id in apps/preview/src/frame/player.tsx (MUX_CHAPTERS_TRACK)."
