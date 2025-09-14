---
layout: post
title: Automating GitHub Profile Updates
description: Automating GitHub Profile Updates with Latest Blogs
category: project
tags: [python,web,github actions,jekyll]
pin: true
buttons:
  - title: Source Code
    url: https://github.com/AutumnEvans418/autumnevans418.github.io
  - title: Profile Repository
    url: https://github.com/AutumnEvans418/autumnevans418
---

{% raw %}
## Automating GitHub Profile Updates with Latest Blogs
![alt text](/assets/images/projects/update-profile/image-1.png)

Keeping your GitHub profile up-to-date with your latest blog posts is a great way to showcase your work and maintain an active online presence. In this post, I’ll walk through how I automated the process of updating my GitHub profile README whenever a new blog is published on my Jekyll-powered website. This approach leverages GitHub Actions, custom scripting, and repository integration for a seamless workflow.

### 1. Setting Up the Profile Repository

First, I created a dedicated GitHub profile repository. Make sure the repository name matches your github username. [See here for more information on profile repositories](https://docs.github.com/en/account-and-profile/how-tos/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme). The README file in this repo includes a section for my latest blogs:

`readme.md`
```markdown
### My Latest Blogs
<!--blog-start-->
<!--blog-ends-->
```

This section acts as a placeholder, allowing automated scripts to update the content between the comment tags.

### 2. Generating Blog Markdown with Jekyll

On my Jekyll website, I added a custom HTML file that outputs the latest blog posts in Markdown format. This file uses Liquid templating to generate a list of recent posts, wrapped in the same comment tags for easy parsing:

`/blog/machine/index.html`
```html
---
layout: none
permalink: /blog/machine/
---
<!--blog-start-->
{% assign posts = site.posts | sort: "date" | reverse %}
{% for post in posts limit:6 %}
- [{{ post.title }} - {{ post.date | date: "%Y-%m-%d" }}]({{ site.url }}{{ post.url }})
{% endfor %}
<!--blog-ends-->
```

This ensures the output is machine-parseable. The content on this page will be what is placed into our readme file in the profile repository.

### 3. Custom GitHub Actions Workflow

To automate the update process, I created a custom GitHub Actions workflow in my Pages repository. This workflow is triggered whenever the site is published and performs the following steps:

- Fetches the latest blog markdown from the Jekyll site
- Clones the profile repository
- Copies the markdown and update script into the profile repo
- Runs the update script to modify the README
- Commits and pushes the changes

> NOTE: If you are not using custom github actions for your github pages project, you'll need to change that in Settings -> Pages -> then change the Source from "Deploy from a branch" to "GitHub Actions" and use the jekyll template. [Mine looks like this](https://github.com/AutumnEvans418/autumnevans418.github.io/blob/master/.github/workflows/jekyll.yml)

### 4. Creating a Personal Access Token

Since the workflow needs to push changes to a separate repository (the profile repo), I generated a GitHub Personal Access Token (PAT) with `repo` scope. This token is stored as a secret in the Pages repository and used for authentication during the push step.


### 5. Workflow Implementation

The workflow YAML includes steps for cloning the profile repo, downloading the latest blog markdown, running the update script, and committing the changes. Here’s a simplified version of the relevant steps:

```yaml
- name: Clone Profile Repo
  env:
    PROFILE_REPO_TOKEN: ${{ secrets.PROFILE_REPO_TOKEN }}
  run: |
    git clone https://x-access-token:${PROFILE_REPO_TOKEN}@github.com/YourUsername/your-profile-repo.git
    cp latest_blogs.md your-profile-repo/latest_blogs.md
    cp update_readme.py your-profile-repo/update_readme.py

- name: Update README in Profile Repo
  run: |
    cd your-profile-repo
    python3 update_readme.py
    cat README.md

- name: Commit and Push Changes
  env:
    PROFILE_REPO_TOKEN: ${{ secrets.PROFILE_REPO_TOKEN }}
  run: |
    cd your-profile-repo
    git config user.name "README-bot"
    git config user.email "readme-bot@example.com"
    git add README.md
    git commit -m "Update latest blogs" || true
    git remote set-url origin https://x-access-token:${PROFILE_REPO_TOKEN}@github.com/YourUsername/your-profile-repo.git
    git push
```

### 6. Update Script for the README

The update script (`update_readme.py`) is a simple Python script that replaces the blog section in the README with the latest markdown:

```python
import re

with open('latest_blogs.md', 'r') as f:
    latest = f.read()

with open('README.md', 'r') as f:
    readme = f.read()

new_readme = re.sub(
    r'(<!--blog-start-->)(.*?)(<!--blog-ends-->)',
    r'\\1\\n' + latest.split('<!--blog-start-->')[1].split('<!--blog-ends-->')[0].strip() + r'\\n\\3',
    readme,
    flags=re.DOTALL
)

with open('README.md', 'w') as f:
    f.write(new_readme)
```

# 7. Results
Now when we update our Jekyll website, our github profile will be updated!
![alt text](/assets/images/projects/update-profile/image.png)
![alt text](/assets/images/projects/update-profile/image-1.png)
### Conclusion

By combining Jekyll’s templating, GitHub Actions, and a simple Python script, I’ve created a robust and automated workflow for keeping my GitHub profile up-to-date with my latest blog posts. This approach can be adapted for other types of content and is a great way to integrate your personal site with your developer profile.

If you have questions or want to implement something similar, feel free to reach out or check out the source files in my repositories!
{% endraw %}
