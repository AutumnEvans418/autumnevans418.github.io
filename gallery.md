---
layout: default
title: Gallery
permalink: /gallery
---
{% for image in site.images %}
<img src="{{image.image}}" alt="logo" width="200"/>  
{{image.caption}}  
{% endfor %}