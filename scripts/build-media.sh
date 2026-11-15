#!/usr/bin/env bash
# Builds the demo media for the showcase: a 40-second garment lookbook cut from Mixkit clips, plus its poster,
# product shots, thumbnail storyboard, and chapter track.
#
# Usage: scripts/build-media.sh [work-dir]
#        scripts/build-media.sh chapters    (only rewrite chapters.vtt and chapters.json)
# Needs: curl, ffmpeg, ffprobe. Downloads go to the work dir (default: a temp dir), output to apps/preview/public/media.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/apps/preview/public/media"
WORK="${1:-$(mktemp -d)}"

CLIP_SECONDS=8
MUSIC_ID=132 # "Hazy After Hours"

# One row per look, numbered 01, 02, … in order:
# Mixkit clip id | start offset (s) | speed factor | product-shot crop (w:h:x:y, 3:4) | chapter title | garment key
LOOKS=(
  "33167|1|1.00|540:720:370:0|Knitwear · Cable-Knit Cashmere Jumper|knit"
  "24581|4|1.00|540:720:370:0|Shirting · Oxford Cotton Shirt|shirt"
  "52194|2|1.00|420:560:560:160|Tailoring · Single-Breasted Wool Blazer|tailoring"
  "14842|3|1.00|540:720:250:0|Skirts · Pleated Midi Skirt|skirt"
  "33527|0|1.00|540:720:210:0|Dresses · Linen Maxi Dress|dress"
)

log() { printf '\033[1m›\033[0m %s\n' "$*"; }

field() { cut -d'|' -f"$2" <<<"$1"; }

timestamp() { printf '00:%02d:%02d.000' $(($1 / 60)) $(($1 % 60)); }

download() {
  local id="$1" file="$WORK/$1.mp4"
  [[ -f "$file" ]] && return
  log "Downloading clip $id"
  curl -sfL -o "$file" "https://assets.mixkit.co/videos/$id/$id-720.mp4"
}

download_music() {
  local file="$WORK/music.mp3"
  [[ -f "$file" ]] && return
  log "Downloading music $MUSIC_ID"
  curl -sfL -o "$file" "https://assets.mixkit.co/music/$MUSIC_ID/$MUSIC_ID.mp3"
}

# Cuts every clip to the same length and frame format, then joins them over the music bed.
build_video() {
  local inputs=() filters="" joins="" total=$((CLIP_SECONDS * ${#LOOKS[@]}))

  for i in "${!LOOKS[@]}"; do
    local look="${LOOKS[$i]}"
    inputs+=(-ss "$(field "$look" 2)" -i "$WORK/$(field "$look" 1).mp4")
    filters+="[$i:v]setpts=$(field "$look" 3)*PTS,scale=1280:720,setsar=1,fps=30,trim=0:$CLIP_SECONDS,setpts=PTS-STARTPTS[v$i];"
    joins+="[v$i]"
  done

  local music=${#LOOKS[@]}
  filters+="${joins}concat=n=${#LOOKS[@]}:v=1:a=0[v];"
  filters+="[$music:a]atrim=0:$total,afade=t=in:d=0.4,afade=t=out:st=$((total - 3)):d=2.5[a]"

  log "Encoding lookbook ($total s)"
  ffmpeg -v error -y "${inputs[@]}" -i "$WORK/music.mp3" -filter_complex "$filters" -map "[v]" -map "[a]" \
    -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k "$OUT/lookbook.mp4"
}

# A 3:4 product shot from the middle of each look, and the poster from the closing dress.
build_stills() {
  log "Cutting poster and product shots"
  ffmpeg -v error -y -ss 34 -i "$OUT/lookbook.mp4" -frames:v 1 -q:v 3 "$OUT/poster.jpg"

  for i in "${!LOOKS[@]}"; do
    local at=$((i * CLIP_SECONDS + CLIP_SECONDS / 2)) crop
    crop="$(field "${LOOKS[$i]}" 4)"
    ffmpeg -v error -y -ss "$at" -i "$OUT/lookbook.mp4" -frames:v 1 \
      -vf "crop=$crop,scale=360:480" -q:v 4 "$OUT/look-0$((i + 1)).jpg"
  done
}

# One 192x108 frame per second on a 7-column sprite, with a WebVTT index the time slider reads.
build_storyboard() {
  local seconds=$((CLIP_SECONDS * ${#LOOKS[@]})) cols=7
  local rows=$(((seconds + cols - 1) / cols))

  log "Building storyboard"
  ffmpeg -v error -y -i "$OUT/lookbook.mp4" -vf "fps=1,scale=192:108,tile=${cols}x${rows}" -frames:v 1 -q:v 5 \
    "$OUT/storyboard.jpg"

  {
    printf 'WEBVTT\n'
    for ((s = 0; s < seconds; s++)); do
      printf '\n%s --> %s\nstoryboard.jpg#xywh=%d,%d,192,108\n' \
        "$(timestamp $s)" "$(timestamp $((s + 1)))" $((s % cols * 192)) $((s / cols * 108))
    done
  } >"$OUT/storyboard.vtt"
}

build_chapters() {
  log "Writing chapters"
  # WebVTT, for the player's local fallback. Each cue's identifier is its look's id, which links it to the product.
  {
    printf 'WEBVTT\n'
    for i in "${!LOOKS[@]}"; do
      local start=$((i * CLIP_SECONDS))
      printf '\n%02d\n%s --> %s\n%s\n' $((i + 1)) "$(timestamp $start)" "$(timestamp $((start + CLIP_SECONDS)))" \
        "$(field "${LOOKS[$i]}" 5)"
    done
  } >"$OUT/chapters.vtt"

  # The same chapters in Apple's JSON chapters format, which is what Mux takes for a chapters track. The metadata
  # names each chapter's garment and look, so the seek bar needn't read them from the title.
  {
    printf '['
    for i in "${!LOOKS[@]}"; do
      ((i > 0)) && printf ','
      printf '\n  {"chapter": %d, "start-time": %d, "titles": [{"language": "en", "title": "%s"}], ' \
        $((i + 1)) $((i * CLIP_SECONDS)) "$(field "${LOOKS[$i]}" 5)"
      printf '"metadata": [{"key": "garment", "value": "%s"}, {"key": "look", "value": "%02d"}]}' \
        "$(field "${LOOKS[$i]}" 6)" $((i + 1))
    done
    printf '\n]\n'
  } >"$OUT/chapters.json"
}

main() {
  mkdir -p "$OUT" "$WORK"
  for look in "${LOOKS[@]}"; do download "$(field "$look" 1)"; done
  download_music
  build_video
  build_stills
  build_storyboard
  build_chapters
  log "Done: $OUT"
}

if [[ "${1:-}" == "chapters" ]]; then
  build_chapters
else
  main
fi
