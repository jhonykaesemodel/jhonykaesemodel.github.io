#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
MIN_DIR="$ROOT_DIR/minimal"
PUB_DIR="$ROOT_DIR/public"

if [ ! -d "$MIN_DIR" ]; then
  echo "Minimal site directory not found: $MIN_DIR" >&2
  exit 1
fi

echo "Clearing $PUB_DIR ..."
rm -rf "$PUB_DIR"
mkdir -p "$PUB_DIR"

echo "Copying minimal site..."
cp -R "$MIN_DIR"/* "$PUB_DIR"/

echo "Stamping last updated date..."
STAMP_DATE="$(date +%Y-%m)"
# Update the "Last updated: YYYY-MM" in public/index.html (BSD sed compatible)
if [ -f "$PUB_DIR/index.html" ]; then
  sed -E -i '' "s/Last updated: [0-9]{4}-[0-9]{2}/Last updated: ${STAMP_DATE}/" "$PUB_DIR/index.html" || true
fi

echo "Generating publications.json ..."
# Parse publications from index.html list items into a minimal JSON array
if [ -f "$PUB_DIR/index.html" ]; then
  awk '
  BEGIN{insec=0; print "["}
  /<section id="publications">/{insec=1}
  insec && /<li>/{
    line=$0
    html=line
    # strip tags for text extraction
    gsub(/<[^>]+>/,"", line)
    # collapse multiple spaces
    gsub(/^[ \t]+|[ \t]+$/,"", line)
    n=split(line, parts, " — ")
    year=(n>=1?parts[1]:"")
    title=(n>=2?parts[2]:"")
    venue=(n>=3?parts[3]:"")
    # escape quotes in strings
    gsub(/"/, "\\\"", title)
    gsub(/"/, "\\\"", venue)
    gsub(/"/, "\\\"", html)
    if (printed) { printf(",\n") } printed=1
    printf("  {\"year\": \"%s\", \"title\": \"%s\", \"venue\": \"%s\", \"html\": \"%s\"}", year, title, venue, html)
  }
  /<\/section>/{if(insec){insec=0}}
  END{print "\n]"}
  ' "$PUB_DIR/index.html" > "$PUB_DIR/publications.json" || true
fi

echo "Done. Minimal site is now in: $PUB_DIR"


