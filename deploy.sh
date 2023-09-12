#!/bin/bash

set -e

aws s3 sync tiles/ s3://tzwolak.com/tiles --cache-control "max-age=86400"
aws s3 sync dist/assets/ s3://tzwolak.com/assets --exclude "*.html,*.ico" --cache-control "max-age=86400"
aws s3 cp dist/index.html s3://tzwolak.com/map.html --cache-control "max-age=0"
