#!/usr/bin/env bash
set -euo pipefail

DOCKERFILE="${1:-Dockerfile}"

if [[ ! -f "$DOCKERFILE" ]]; then
  echo "Dockerfile not found: $DOCKERFILE"
  exit 1
fi

fail=0

declare -A stages=()

while IFS= read -r raw_line; do
  line="${raw_line%%#*}"
  line="$(echo "$line" | xargs)"
  [[ -z "$line" ]] && continue

  if [[ "$line" =~ ^FROM[[:space:]]+([^[:space:]]+)([[:space:]]+AS[[:space:]]+([[:alnum:]_.-]+))?$ ]]; then
    image_ref="${BASH_REMATCH[1]}"
    stage_name="${BASH_REMATCH[3]:-}"

    # Skip locally-referenced stages (e.g. FROM base AS build)
    if [[ -n "${stages[$image_ref]+x}" ]]; then
      [[ -n "$stage_name" ]] && stages["$stage_name"]=1
      continue
    fi

    if [[ ! "$image_ref" =~ @sha256:[a-f0-9]{64}$ ]]; then
      echo "Unpinned FROM image (missing digest): $image_ref"
      fail=1
    fi

    [[ -n "$stage_name" ]] && stages["$stage_name"]=1
  fi

done < "$DOCKERFILE"

# Disallow known secret-like build-time ARG/ENV variables.
known_secret_pattern='(^|_)(SECRET|TOKEN|PASSWORD|PASSWD|MASTER_KEY|PRIVATE_KEY|API_KEY|ACCESS_KEY)(_|$)'

while IFS= read -r line; do
  instruction=$(echo "$line" | awk '{print toupper($1)}')
  rest="${line#* }"
  [[ -z "$rest" || "$rest" == "$line" ]] && continue

  if [[ "$instruction" == "ARG" ]]; then
    var_name="${rest%%=*}"
    if [[ "$var_name" =~ $known_secret_pattern ]]; then
      echo "Disallowed ARG secret pattern: $var_name"
      fail=1
    fi
  elif [[ "$instruction" == "ENV" ]]; then
    while IFS= read -r token; do
      [[ "$token" != *=* ]] && continue
      var_name="${token%%=*}"
      if [[ "$var_name" =~ $known_secret_pattern ]]; then
        echo "Disallowed ENV secret pattern: $var_name"
        fail=1
      fi
    done < <(echo "$rest" | tr ' ' '\n')
  fi
done < <(awk '{sub(/#.*/,""); gsub(/^[ \t]+|[ \t]+$/,"",$0); if (length) print $0}' "$DOCKERFILE")

if [[ "$fail" -ne 0 ]]; then
  echo "Dockerfile policy checks failed."
  exit 1
fi

echo "Dockerfile policy checks passed."
