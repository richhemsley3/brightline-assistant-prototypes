#!/usr/bin/env bash
# push-network-assist.sh "commit message"
# Commits the Network Assist agent experience and its Figma instructions to github.com/richhemsley3/network-assist (main)
# through the GitHub API, without local git (local git can fail on an unaccepted Xcode licence). Needs `gh` signed in.
# Optional: README=path/to/README.md to update the repo README in the same commit.
# Never add the Proxima Nova font files: the repo is public and the typeface is licensed.
set -euo pipefail
MSG="${1:?commit message}"
R=repos/richhemsley3/network-assist
NA="$HOME/Desktop/Claude/payments-assistant-direction"
HEAD=$(gh api $R/git/ref/heads/main --jq .object.sha)
TREE=$(gh api $R/git/commits/$HEAD --jq .tree.sha)
blob(){ node -e 'process.stdout.write(JSON.stringify({content:require("fs").readFileSync(process.argv[1]).toString("base64"),encoding:"base64"}))' "$1" | gh api $R/git/blobs --input - --jq .sha; }
ENTRIES="[{\"path\":\"experience/index.html\",\"mode\":\"100644\",\"type\":\"blob\",\"sha\":\"$(blob "$NA/experience/index.html")\"},{\"path\":\"figma/network-assist-figma-instructions.md\",\"mode\":\"100644\",\"type\":\"blob\",\"sha\":\"$(blob "$NA/figma/network-assist-figma-instructions.md")\"}"
if [ -n "${README:-}" ]; then ENTRIES="$ENTRIES,{\"path\":\"README.md\",\"mode\":\"100644\",\"type\":\"blob\",\"sha\":\"$(blob "$README")\"}"; fi
ENTRIES="$ENTRIES]"
NT=$(node -e 'process.stdout.write(JSON.stringify({base_tree:process.argv[1],tree:JSON.parse(process.argv[2])}))' "$TREE" "$ENTRIES" | gh api $R/git/trees --input - --jq .sha)
FULL="$MSG

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
NC=$(node -e 'process.stdout.write(JSON.stringify({message:process.argv[1],tree:process.argv[2],parents:[process.argv[3]]}))' "$FULL" "$NT" "$HEAD" | gh api $R/git/commits --input - --jq .sha)
gh api -X PATCH $R/git/refs/heads/main -f sha="$NC" --jq '.object.sha[0:7]'
echo "Pushed. GitHub Pages rebuilds https://richhemsley3.github.io/network-assist/experience/ in about a minute."
