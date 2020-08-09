---
layout: post
title: Promoting your blogs using Github Actions
description: How you can use Github Actions to promote your blogs anytime you add a blog
category: project
tags: [web]
published: false
# logo: /assets/images/life.jpg
# buttons:
#   - title: Source Code
#     url: https://github.com/chrisevans9629/GameOfLife
#   - title: Play
#     url: /assets/babylon/life/index.html
---
After taking the time of finishing a blog, I sometimes forget to share it so that others can see.  Thus, I created a bot that shares my blogs anytime I add one.
To accomplish this, we'll need to create a script that shares a new blog anytime I update the website.  Fortunately, using Github actions we can do just that.
Anytime that the website is changed, we'll grab and parse the RSS feed and get the latest blog entry.  We'll compare it to the last blog we shared and if it's different then we'll post it to Facebook, Twitter, and LinkedIn, set it as the last blog we shared and push the changes to our repository.

