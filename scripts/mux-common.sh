# Shared by the scripts/mux-*.sh scripts: loads a film's config and the Mux API token, and wraps the API.
# Usage, from a script: source "$(dirname "$0")/mux-common.sh" "<film>"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FILM="${1:?Name a film: one of $(cd "$ROOT/scripts/films" && ls ./*.conf | sed 's|./||; s|\.conf||' | tr '\n' ' ')}"
FILM_CONF="$ROOT/scripts/films/$FILM.conf"
[[ -f "$FILM_CONF" ]] || { echo "No film config at $FILM_CONF" >&2; exit 1; }
# shellcheck disable=SC1090
source "$FILM_CONF"

ENV_FILE="${MUX_ENV_FILE:-$ROOT/mux-access-token-m.env}"
# shellcheck disable=SC1090
source "$ENV_FILE"
: "${MUX_TOKEN_ID:?Set MUX_TOKEN_ID in $ENV_FILE}" "${MUX_TOKEN_SECRET:?Set MUX_TOKEN_SECRET in $ENV_FILE}"

log() { printf '\033[1m›\033[0m %s\n' "$*" >&2; }

mux() { curl -sf -u "$MUX_TOKEN_ID:$MUX_TOKEN_SECRET" -H 'Content-Type: application/json' "$@"; }

asset_api() {
  [[ -n "$ASSET_ID" ]] || { echo "$FILM has no ASSET_ID yet: run scripts/mux-upload.sh $FILM" >&2; exit 1; }
  echo "https://api.mux.com/video/v1/assets/$ASSET_ID"
}
