#!/bin/bash

set -e

aws s3 sync tiles/ s3://tzwolak.com/tiles --cache-control "max-age=86400"
aws s3 sync dist/assets/ s3://tzwolak.com/assets --exclude "*.html,*.ico" --cache-control "max-age=86400"
aws s3 cp dist/index.html s3://tzwolak.com/map.html --cache-control "max-age=0"
aws s3 sync map_styles/ s3://tzwolak.com/map_styles --exclude "*" --include "*.png"  --cache-control "max-age=0"
aws s3 sync map_styles/ s3://tzwolak.com/map_styles --exclude "*" --include "*.json"  --cache-control "max-age=0"
aws s3 sync fonts s3://tzwolak.com/fonts
