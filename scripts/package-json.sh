#!/usr/bin/env bash

# Read the original package.json
ORIGINAL_JSON=$(cat package.json)

# Remove devDependencies and scripts
MODIFIED_JSON=$(echo "$ORIGINAL_JSON" | jq 'del(.devDependencies, .scripts)')

# Add the new "start" script
MODIFIED_JSON=$(echo "$MODIFIED_JSON" | jq '.scripts += {"start": "node index.js"}')

# Write the modified package.json to a new file
echo "$MODIFIED_JSON" > dist/package.json
