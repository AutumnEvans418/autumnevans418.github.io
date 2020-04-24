---
layout: default
title: Games
permalink: /games
---
{% for game in site.games %}
{% if game.logo %}
![logo]({{game.logo}})
{% endif %}
# {{game.name}}
{{game.description}}  
[View Project]({{game.projectUrl}})  
[Download]({{game.downloadUrl}})  
{% endfor %}