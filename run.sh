#!/bin/sh
set -e
nginx
bundle install
bundle exec jekyll serve --baseurl '' --port 8080 --force_polling