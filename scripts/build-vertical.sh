#!/usr/bin/env bash
# Builds the vertical (9:16) cut for the showcase: 30 seconds from the same Mixkit clips as the lookbook, cropped
# around each garment. It's cut differently on purpose, to show the seek bar follows whatever chapters a film has:
# an opening with nothing to buy, the looks in a new order, and chapters of different lengths.
#
# Usage: scripts/build-vertical.sh [work-dir]
#        scripts/build-vertical.sh chapters    (only rewrite the chapters and captions)
# Needs: curl, ffmpeg. Downloads go to the work dir (default: a temp dir), output to apps/preview/public/media/vertical.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/apps/preview/public/media/vertical"
WORK="${1:-$(mktemp -d)}"

MUSIC_ID=132 # "Hazy After Hours", as in the lookbook
WIDTH=540
HEIGHT=960

# One row per chapter, in film order:
# Mixkit clip id | start offset (s) | length (s) | crop centre x in the 1280x720 frame | chapter title | garment | look
CHAPTERS=(
  "33167|7|3|640|Atelier · Opening|other|"
  "33527|0|6|480|Dresses · Linen Maxi Dress|dress|05"
  "52194|2|5|770|Tailoring · Single-Breasted Wool Blazer|tailoring|03"
  "14842|3|6|520|Skirts · Pleated Midi Skirt|skirt|04"
  "24581|4|4|640|Shirting · Oxford Cotton Shirt|shirt|02"
  "33167|1|6|640|Knitwear · Cable-Knit Cashmere Jumper|knit|01"
)

log() { printf '\033[1m›\033[0m %s\n' "$*"; }

field() { cut -d'|' -f"$2" <<<"$1"; }

timestamp() { printf '00:%02d:%02d.000' $(($1 / 60)) $(($1 % 60)); }

total_seconds() {
  local total=0 row
  for row in "${CHAPTERS[@]}"; do total=$((total + $(field "$row" 3))); done
  echo "$total"
}

download() {
  local file="$WORK/$1.mp4"
  [[ -f "$file" ]] && return
  log "Downloading clip $1"
  curl -sfL -o "$file" "https://assets.mixkit.co/videos/$1/$1-720.mp4"
}

download_music() {
  local file="$WORK/music.mp3"
  [[ -f "$file" ]] && return
  log "Downloading music $MUSIC_ID"
  curl -sfL -o "$file" "https://assets.mixkit.co/music/$MUSIC_ID/$MUSIC_ID.mp3"
}

# Crops a 9:16 window around each garment, cuts it to its chapter's length, and joins them over the music.
build_video() {
  local inputs=() filters="" joins="" total crop_w=405
  total="$(total_seconds)"

  for i in "${!CHAPTERS[@]}"; do
    local row="${CHAPTERS[$i]}" x
    x=$(($(field "$row" 4) - crop_w / 2))
    inputs+=(-ss "$(field "$row" 2)" -i "$WORK/$(field "$row" 1).mp4")
    filters+="[$i:v]scale=1280:720,crop=$crop_w:720:$x:0,scale=$WIDTH:$HEIGHT,setsar=1,fps=30,"
    filters+="trim=0:$(field "$row" 3),setpts=PTS-STARTPTS[v$i];"
    joins+="[v$i]"
  done

  local music=${#CHAPTERS[@]}
  filters+="${joins}concat=n=${#CHAPTERS[@]}:v=1:a=0[v];"
  filters+="[$music:a]atrim=0:$total,afade=t=in:d=0.4,afade=t=out:st=$((total - 3)):d=2.5[a]"

  log "Encoding vertical cut ($total s)"
  ffmpeg -v error -y "${inputs[@]}" -i "$WORK/music.mp3" -filter_complex "$filters" -map "[v]" -map "[a]" \
    -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k "$OUT/vertical.mp4"
}

# The chapters in Apple's JSON chapters format (for Mux) and as WebVTT, and captions for the music.
build_text() {
  log "Writing chapters and captions"
  local start=0 total
  total="$(total_seconds)"

  {
    printf '['
    for i in "${!CHAPTERS[@]}"; do
      local row="${CHAPTERS[$i]}" look meta
      look="$(field "$row" 7)"
      meta="{\"key\": \"garment\", \"value\": \"$(field "$row" 6)\"}"
      [[ -n "$look" ]] && meta+=", {\"key\": \"look\", \"value\": \"$look\"}"
      ((i > 0)) && printf ','
      printf '\n  {"chapter": %d, "start-time": %d, "titles": [{"language": "en", "title": "%s"}], "metadata": [%s]}' \
        $((i + 1)) "$start" "$(field "$row" 5)" "$meta"
      start=$((start + $(field "$row" 3)))
    done
    printf '\n]\n'
  } >"$OUT/chapters.json"

  start=0
  {
    printf 'WEBVTT\n'
    for row in "${CHAPTERS[@]}"; do
      local length look
      length="$(field "$row" 3)"
      look="$(field "$row" 7)"
      printf '\n%s\n%s --> %s\n%s\n' "${look:-opening}" "$(timestamp $start)" "$(timestamp $((start + length)))" \
        "$(field "$row" 5)"
      start=$((start + length))
    done
  } >"$OUT/chapters.vtt"

  cat >"$OUT/captions.vtt" <<EOF
WEBVTT

1
00:00:00.000 --> 00:00:03.000
[Soft, unhurried instrumental starts]

2
00:00:03.000 --> $(timestamp $((total - 3)))
♪ Hazy, mellow instrumental, no vocals ♪

3
$(timestamp $((total - 3))) --> $(timestamp "$total")
[Music fades out]
EOF
}

main() {
  mkdir -p "$OUT" "$WORK"
  local row
  for row in "${CHAPTERS[@]}"; do download "$(field "$row" 1)"; done
  download_music
  build_video
  build_text
  log "Done: $OUT"
}

if [[ "${1:-}" == "chapters" ]]; then
  mkdir -p "$OUT"
  build_text
else
  main
fi
