#!/usr/bin/env bash

JSON=$(cat liara.json)

# MODIFIED_JSON=$(echo "$ORIGINAL_JSON" | jq 'del(.app, .port)')

echo "$JSON" > dist/liara.json
