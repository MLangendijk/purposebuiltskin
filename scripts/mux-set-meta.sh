#!/usr/bin/env bash
# Names the Mux asset: its title and an external id for the collection. Mux serves the title in the asset's public
# metadata document (stream.mux.com/{PLAYBACK_ID}/metadata.json), which the Mux player and Mux Data read, so views
# show up in Mux Data under the film's name.
#
# Usage: scripts/mux-set-meta.sh
# Needs: curl, jq, and MUX_TOKEN_ID / MUX_TOKEN_SECRET in mux-access-token-m.env (gitignored), or the file in MUX_ENV_FILE.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ASSET_ID="51mycH1AIo3qh31RFOr002t3XOVvfpbDNKc02snvF6gz4"
PLAYBACK_ID="iYNPL02029CpHpmg2Hc21G9hWsj3LEYq9bTqf02ipLkW02k"
TITLE="Maison Marelle · The Spring Edit"
EXTERNAL_ID="maison-marelle-ss27-spring-edit"

ENV_FILE="${MUX_ENV_FILE:-$ROOT/mux-access-token-m.env}"
# shellcheck disable=SC1090
source "$ENV_FILE"
: "${MUX_TOKEN_ID:?Set MUX_TOKEN_ID in $ENV_FILE}" "${MUX_TOKEN_SECRET:?Set MUX_TOKEN_SECRET in $ENV_FILE}"

body="$(jq -n --arg title "$TITLE" --arg id "$EXTERNAL_ID" '{meta: {title: $title, external_id: $id}}')"

curl -sf -u "$MUX_TOKEN_ID:$MUX_TOKEN_SECRET" -H 'Content-Type: application/json' \
  -X PATCH "https://api.mux.com/video/v1/assets/$ASSET_ID" -d "$body" | jq '.data.meta'

echo "Public metadata: https://stream.mux.com/$PLAYBACK_ID/metadata.json"
