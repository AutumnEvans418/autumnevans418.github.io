# chrisevans9629.github.io

## How to run the site

1. Install Jekyll
2. Run ```bundle install```
3. Run ```start.cmd```

## Resources

https://mikaberglund.com/2019/12/29/hosting-blazor-applications-on-github-pages/

https://github.com/sujaykundu777/devlopr-jekyll

https://github.com/jekyll/jekyll/issues/1352

https://highlightjs.org/

https://codemirror.net/

https://docs.microsoft.com/en-us/aspnet/core/blazor/call-javascript-from-dotnet?view=aspnetcore-3.1

# Embedding Blazor into Jekyll

- Add include in the _config.yml include: ["_framework","_bin"]
- **Remove the unicode X from the index.html file.  Jekyll doesn't like that**

Here is an example index.html file:
All that is needed is the _framework folder.  Bootstrap is already used on the site and is inherited.  The baseurl is not needed in my case because there is no navigation
```html
---
layout: default
title: Xaml Templates
---

<link rel="stylesheet" href="highlight/styles/default.css">
<script src="highlight/highlight.pack.js"></script>
<script src="js/index.js"></script>
<app>Loading...</app>

<script src="_framework/blazor.webassembly.js"></script>
```

https://docs.microsoft.com/en-us/aspnet/core/host-and-deploy/blazor/?view=aspnetcore-3.1&tabs=visual-studio#app-base-paths

The index file has to exist with the files needed.  However, you can create a blog post with a permalink that will publish it to the desired location:

```
---
title: Xaml Templates
date: 2020-05-01
layout: post
permalink: /blazor/xt/
---
<script src="js/index.js"></script>
<app>Loading...</app>
Built with <3 using Blazor
<script src="_framework/blazor.webassembly.js"></script>
```

This will show as a blog, but due to the `permalink` tag, it will navigate to our blazor app location