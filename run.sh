#!/bin/sh
set -e
nginx
bundle update
bundle install
bundle exec jekyll serve --host 0.0.0.0 --port 4000 --watch --force_polling --livereload