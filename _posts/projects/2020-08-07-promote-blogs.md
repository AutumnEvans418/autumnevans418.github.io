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

### Prerequisites

- Create a github pages website using Jekyll
- Install Jekyll feed to generate an RSS feed

### Creating the Github Action
To create the github action, we'll create a yml file at `.github\workflows\promote.yml` in our website repository.  To get this to run after the Github pages website is deployed, we can use deployment status.  If we used `on: push` instead, the job would run before or during the deployment, meaning that our RSS feed wouldn't be up to date.
```yml
on: deployment_status
jobs:
  publish:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      ...
```

The steps should be pretty simple.  In this case, I checkout my website and run my powershell script, which installs dependencies and fetches the RSS feed:
```yml
steps:
- uses: actions/checkout@v1
- name: Run Pwsh Script
    shell: pwsh
    run: |
    .\scripts\build.ps1
```

Lastly, we need to add `.\scripts\build.ps1` and our Github action should work.
We can just print "hello world" for now in `build.ps1`:
```powershell
"hello world!"
```
Go ahead and push your changes using git and see if it works.


*Note*
If you are using VSCode and get the error: 
```
! [remote rejected] master -> master (refusing to allow an OAuth App to create or update workflow .github/workflows/file.yml without workflow scope)
```
You can fix this by following [this comment](https://github.com/gitextensions/gitextensions/issues/4916#issuecomment-557509451):

### Reading our RSS Feed

Our RSS feed is simply an XML file that represents our posts on our website:
```xml
<feed xmlns="http://www.w3.org/2005/Atom">
    <id>https://chrisevans9629.github.io/feed.xml</id>
    <title type="html">Chris Evans’ Dev Blog</title>
    <subtitle>Welcome to my dev blog!</subtitle>
    <author>
        <name>Chris Evans</name>
    </author>
    <entry>
        <title type="html">Building Conway’s Game of Life in 3D</title>
        <link href="https://chrisevans9629.github.io/blog/2020/07/27/game-of-life" rel="alternate" type="text/html" title="Building Conway's Game of Life in 3D"/>
    </entry>
</feed>
```

We can parse this in powershell like this:

```powershell
$file = ".\scripts\atom.xml"

Invoke-WebRequest "https://chrisevans9629.github.io/feed.xml" -OutFile $file
# This is done to ensure we use the correct encoding
[xml]$result = Get-Content $file -Encoding UTF8 -Raw

$entries = $result.GetElementsByTagName("entry")

function GetEntry($entry) {
    $title = $entry.GetElementsByTagName("title")[0].InnerText
    $link = $entry.GetElementsByTagName("link")
    $ref = $link[0].GetAttribute("href")
    $summary = $entry.GetElementsByTagName("summary")[0].InnerText
    # get the first two sentences
    $sum = $summary.Split(".")[0] + "." + $summary.Split(".")[1] + "..."
    return @{title=$title;ref=$ref;summary=$sum}
}

$blog = GetEntry $entries[0]
```

This code gets the xml file from my website, saves it so that the encoding is correct, then parses the first `entry` tag using the `GetEntry` function.  In this case, we get the title, link, and the first two sentences.

