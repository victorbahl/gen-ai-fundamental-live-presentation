#!/usr/bin/env bash
#
# fetch-backgrounds.sh — download royalty-free hero backgrounds for the deck.
#
# Source : Pexels API (free, no attribution required, real photos).
# Output : scripts/_candidates/<slot>-<n>.jpg  (several candidates per slot)
#          You then pick the best one and run this script with `install <slot> <n>`
#          to optimize + copy it to public/img/<slot>.jpg.
#
# WHY a script and not hard-coded URLs: image CDNs rotate URLs and links rot.
# Querying the search API by theme is reproducible and always fresh.
#
# ── SETUP (one time) ────────────────────────────────────────────────────────
#   1. Get a free instant API key: https://www.pexels.com/api/  (sign in → "Your API key")
#   2. export PEXELS_API_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
#
# ── USAGE ───────────────────────────────────────────────────────────────────
#   ./scripts/fetch-backgrounds.sh fetch            # download candidates for ALL slots
#   ./scripts/fetch-backgrounds.sh fetch part-1     # download candidates for ONE slot
#   open scripts/_candidates/                        # eyeball them, note the good <n>
#   ./scripts/fetch-backgrounds.sh install part-1 2 # optimize candidate #2 → public/img/part-1.jpg
#
# Requirements: curl + python3 + sips (all preinstalled on macOS). No npm, no jq.
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CAND_DIR="$ROOT/scripts/_candidates"
IMG_DIR="$ROOT/public/img"
PER_SLOT=3              # how many candidates to download per slot
TARGET_WIDTH=2560       # final width after optimization (cover, 16:9-ish)
JPEG_QUALITY=72         # sips compression (lower = smaller file)

# ── Slot → search themes ("mix par partie": each slot has its own mood) ──────
# Pipe-separated query is tried left→right until enough landscape photos found.
slot_query() {
  case "$1" in
    cover)     echo "dark abstract gradient|abstract light dark|moody texture dark" ;;
    part-1)    echo "vintage computer|retro mainframe|old technology machine" ;;       # I — history of computing
    part-2)    echo "neural network abstract|circuit board macro dark|data network glow" ;; # II — reasoning machine
    part-2b)   echo "fog empty dark|misty road minimal|blank fog void" ;;              # II — "remembers nothing"
    part-3)    echo "robot hand dark background|humanoid robot hand black|android hand reaching dark" ;; # III — giving it hands
    part-4)    echo "steering wheel night|car cockpit dark|highway motion blur night" ;; # IV — when the model drives
    humility)  echo "starry night sky|milky way stars|vast ocean horizon dark" ;;      # humility / vastness
    close)     echo "business team meeting dark office|colleagues working laptop night|diverse team office low light" ;; # human + machine
    *) echo "" ;;
  esac
}

ALL_SLOTS="cover part-1 part-2 part-2b part-3 part-4 humility close"

# ─────────────────────────────────────────────────────────────────────────────
need_key() {
  if [ -z "${PEXELS_API_KEY:-}" ]; then
    echo "✗ PEXELS_API_KEY not set. Get a free key at https://www.pexels.com/api/ then:" >&2
    echo '    export PEXELS_API_KEY="your-key-here"' >&2
    exit 1
  fi
}

# fetch_slot <slot> — download PER_SLOT candidates for one slot
fetch_slot() {
  local slot="$1" queries q url out i=0
  queries="$(slot_query "$slot")"
  [ -z "$queries" ] && { echo "✗ unknown slot: $slot" >&2; return 1; }
  mkdir -p "$CAND_DIR"
  echo "▸ $slot"

  # Collect candidate image URLs across the slot's themed queries until we have PER_SLOT.
  local urls=()
  local IFS='|'
  for q in $queries; do
    [ "${#urls[@]}" -ge "$PER_SLOT" ] && break
    # Pexels: large landscape photos, themed query.
    local resp
    resp="$(curl -sS -H "Authorization: $PEXELS_API_KEY" \
      --get "https://api.pexels.com/v1/search" \
      --data-urlencode "query=$q" \
      --data-urlencode "orientation=landscape" \
      --data-urlencode "size=large" \
      --data-urlencode "per_page=$PER_SLOT" )" || { echo "  curl failed for '$q'"; continue; }
    # Extract original src URLs (one per line) via python3.
    while IFS= read -r url; do
      [ -n "$url" ] && urls+=("$url")
    done < <(printf '%s' "$resp" | python3 -c '
import sys, json
try:
    d = json.load(sys.stdin)
except Exception as e:
    sys.exit(0)
for p in d.get("photos", []):
    print(p["src"]["original"])
')
  done
  unset IFS

  if [ "${#urls[@]}" -eq 0 ]; then
    echo "  ✗ no results (check API key / quota)"; return 1
  fi

  # Download up to PER_SLOT, as full-res JPG candidates.
  for url in "${urls[@]}"; do
    [ "$i" -ge "$PER_SLOT" ] && break
    i=$((i+1))
    out="$CAND_DIR/${slot}-${i}.jpg"
    # Pexels original URLs allow on-the-fly resize via query params.
    curl -sS -L "${url}?auto=compress&w=${TARGET_WIDTH}" -o "$out" \
      && echo "  ✓ candidate $i → ${out#$ROOT/}" \
      || echo "  ✗ download $i failed"
  done
}

# install <slot> <n> — optimize candidate n and place at public/img/<slot>.jpg
install_slot() {
  local slot="$1" n="$2"
  local src="$CAND_DIR/${slot}-${n}.jpg"
  local dst="$IMG_DIR/${slot}.jpg"
  [ -f "$src" ] || { echo "✗ no candidate: ${src#$ROOT/} (run 'fetch $slot' first)"; exit 1; }
  mkdir -p "$IMG_DIR"
  cp "$src" "$dst"
  # Optimize: clamp width, recompress JPEG. sips ships with macOS.
  sips --resampleWidth "$TARGET_WIDTH" \
       -s format jpeg -s formatOptions "$JPEG_QUALITY" \
       "$dst" --out "$dst" >/dev/null
  local size
  size="$(du -h "$dst" | cut -f1)"
  echo "✓ installed $slot → ${dst#$ROOT/}  ($size)"
}

usage() {
  cat <<EOF
Royalty-free hero backgrounds (Pexels).

  $0 fetch [slot]        download candidates → scripts/_candidates/
  $0 install <slot> <n>  optimize candidate n → public/img/<slot>.jpg

Slots: $ALL_SLOTS
Set PEXELS_API_KEY first (free: https://www.pexels.com/api/).
EOF
}

cmd="${1:-}"
case "$cmd" in
  fetch)
    need_key
    if [ -n "${2:-}" ]; then fetch_slot "$2"
    else for s in $ALL_SLOTS; do fetch_slot "$s"; done; fi
    echo
    echo "Done. Review:  open scripts/_candidates/"
    echo "Then install:  $0 install <slot> <n>"
    ;;
  install)
    [ -n "${2:-}" ] && [ -n "${3:-}" ] || { usage; exit 1; }
    install_slot "$2" "$3"
    ;;
  *) usage ;;
esac
