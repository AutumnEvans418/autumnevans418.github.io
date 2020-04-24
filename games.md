---
layout: default
title: Games
permalink: /games
---
{% for game in site.games %}
{% if game.logo %}
<img src="{{game.logo}}" alt="logo" width="200"/>
{% endif %}
# {{game.name}}
{{game.description}}  
{% if game.projectUrl %}
[View Project]({{game.projectUrl}})  
{% endif %}
{% if game.downloadUrl %}
[Download]({{game.downloadUrl}})  
{% endif %}
{% endfor %}