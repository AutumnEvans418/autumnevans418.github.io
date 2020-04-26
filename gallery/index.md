---
layout: default
title: Gallery
---
{% for image in site.images %}
<img src="{{image.image}}" alt="logo" width="200"/>  
{{image.caption}}  
{% endfor %}