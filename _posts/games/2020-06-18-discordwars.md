---
title: DiscordWars
layout: post
image: /assets/images/discordwars.png
category: game
baseUrl: /assets/phaser/discordwars/
tags: [playable,phaser,web]
description: An RTS game played by the discord chat watching the stream
buttons:
  - title: Source Code
    url: https://github.com/chrisevans9629/DiscordWars
  - title: Play
    url: /assets/phaser/discordwars/index.html
---
![](/assets/images/discordwars.gif)
My brother and I came up with an idea of a game that could be live streamed, but played by the people watching.  We planned it out and came up with a real time strategy game where the goal is to dominate the other team by gaining control of the other bases.

### Features
The game includes a variety of features, including:
- Local single player.
- Multiplayer using discord bots.
- 8 unique levels.
- Randomly generated levels.
- AI teams when there are no players.
- In game chat linked to discord.

### Tooling
Building this game was a new experience for me, as almost all the technologies used were new to me.  I needed to find a way to link my game with discord, which I couldn't find a good solution to do this with Unity3D.  I ended up finding a library called discordjs that met my needs, but that meant that I'd have to build my game in javascript.

Phaser became the obvious choice as the game engine for discordwars, as it had great 2d support and a built in physics engine.  I originally started writing the game in javascript, but quickly scrapped that and rewrote it in typescript, a decision that greatly increased my productivity.

The tools I used to build the game was:
- **discordjs** to connect to discord.
- **phaserjs** as the game engine.
- **typescript** as the programming language.
- **webpack** to package the dependencies for use on the web.

### Server or Client?
One major decision I had to make is do I want to make a server or not.  In order to authenticate with Discord, OAuth must be used with a server so that the client secret can be stored securely.  The advantage is a better user experience at the cost of paying for and maintaining a server.

An alternative is to use a discord bot token, which can be entered on a client, but cannot be stored on my website securely.  This means that a user would have to enter the discord bot token to play the game (making it difficult to use in public discord channels).

I ended up going with the alternative, but if someone knows any other alternative **please let me know!**  This is probably one of my largest limitations with the game in being available to a larger audience.

Fortunately, the streamer is the only one that has to enter the token.  People watching the stream can play the game in the discord chat without going to my website.

### Conclusion
Overall, discordwars was challenging and is a project that I am greatly proud of.  Definitely try it out and let me know what you think!

![](/assets/images/discordwars2.gif)

## [Play here](/assets/phaser/discordwars/index.html)