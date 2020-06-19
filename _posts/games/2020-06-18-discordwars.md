---
title: DiscordWars
layout: post
logo: /assets/images/discordwars.png
category: game
baseUrl: /assets/phaser/discordwars/
tags: [playable,phaser,web]
description: An RTS game played by the discord chat watching the stream
buttons:
  - title: Source Code
    url: https://github.com/chrisevans9629/DiscordWars
---

My brother came up with an idea of a game that could be streamed and played with the people watching the live stream.  We planned it out and expected to get it done in about week, but like all other projects, it ended up taking far longer (more like a month).

This was mainly due to learning a whole new framework and set of technologies.  I built discord wars using PhaserJS, discord.js, typescript, and webpack.  I have never used these tools before and refactored many times and pulled many hairs out.

However, once I learned how to use PhaserJS and webpack, everything went pretty smoothly.  I was using Vue on top of the game at first handling every scene change, only to later learn that phaser had lots of those features built in.

The game is actually really fun and has a lot of features for such a short time.  Definitly give it a try!

## [Play the fullscreen version here](/assets/phaser/discordwars/index.html)
{% include discordwars.html %}