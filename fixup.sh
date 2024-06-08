#!/bin/bash
grep -rl '__dirname' src/esm | xargs sed -i.bak 's/__dirname/import.meta.url/g'

ls src/esm | grep -P ".bak$" | xargs -d"\n" rm

cp -r ./wordlists ./src/
