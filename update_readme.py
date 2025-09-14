# update_readme.py
import re

with open('latest_blogs.md', 'r') as f:
    latest = f.read()

with open('README.md', 'r') as f:
    readme = f.read()

new_readme = re.sub(
    r'(<!--blog-start-->)(.*?)(<!--blog-ends-->)',
    r'\1\n' + latest.split('<!--blog-start-->')[1].split('<!--blog-ends-->')[0].strip() + r'\n\3',
    readme,
    flags=re.DOTALL
)

with open('README.md', 'w') as f:
    f.write(new_readme)