#!/bin/sh
set -e
nginx
bundle update
bundle install
bundle exec jekyll serve --baseurl '' --port 8080 --watch --force_polling --livereload --incremental