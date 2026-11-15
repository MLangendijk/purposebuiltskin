#!/usr/bin/env bash
# Names a film's Mux asset: its title and an external id. Mux serves the title in the asset's public metadata document
# (stream.mux.com/{PLAYBACK_ID}/metadata.json), which the Mux player and Mux Data read, so views show up in Mux Data
# under the film's name.
#
# Usage: scripts/mux-set-meta.sh <film>     e.g. scripts/mux-set-meta.sh spring-edit

set -euo pipefail
source "$(dirname "$0")/mux-common.sh" "$@"

body="$(jq -n --arg title "$TITLE" --arg id "$EXTERNAL_ID" '{meta: {title: $title, external_id: $id}}')"
mux -X PATCH "$(asset_api)" -d "$body" | jq '.data.meta'
echo "Public metadata: https://stream.mux.com/$PLAYBACK_ID/metadata.json"
