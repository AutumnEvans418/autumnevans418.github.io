---
layout: post
title: Chicken Tinder
description: Code-a-thon event submission that helps friends decide on where to eat.
category: project
tags: [web,blazor,code-a-thon,realtime,signalr]
image: https://raw.githubusercontent.com/AutumnEvans418/chicken-tinder/41b43647acb4f6f6a99e0ed7095a4b895b9d4570/ChickenTinder/ChickenTinder/Client/wwwroot/icon-192.png
buttons:
  - title: Source Code
    url: https://github.com/AutumnEvans418/chicken-tinder
  - title: Website
    url: https://chickentinder.azurewebsites.net/
---

# Building *Chicken Tinder*: A Real-Time Group Decision App

Earlier this year, my coworkers and I participated in a code-a-thon event. While we didn’t walk away with the trophy, we walked away with something arguably more valuable: a working application that solves a real problem and gave us firsthand experience building real-time applications.

We called it **Chicken Tinder**.

---

## The Problem

Anyone who has ever tried to make dinner plans with a group of friends knows the struggle:

* One person wants sushi
* Another insists on pizza
* Someone else doesn’t care, but *definitely not tacos again*

The back-and-forth can drag on longer than the meal itself. We wanted to solve this decision-making deadlock with an app that makes the process fast, collaborative, and even a little fun.

---

## The Solution: Chicken Tinder

Chicken Tinder is a web application that lets friends quickly create or join a shared “room” where they can suggest, vote on, and agree on a restaurant in real time.

### Key Features

* **Create or join rooms** for group decision-making
* **Suggest restaurants** and add them to the group pool
* **Vote on options** to see where the consensus lands
* **Real-time updates** so everyone sees changes instantly
* **Directions** provided once the group makes a final choice

We built it with **.NET 8**, **Blazor WebAssembly**, and **Razor Pages**. These tools allowed us to move quickly, focus on functionality, and still deliver a clean user experience.

---

## A Look at the App

Users can start by creating a room or joining one with a shared link or code.

<img class="contain"  width="356" height="610" alt="Room creation screen" src="https://github.com/user-attachments/assets/3cfe618a-6c55-4eb2-b8b0-42ec861f007e" />  

Once a room is created, the host can share the room code or direct link with friends:

<img  class="contain" width="496" height="587" alt="Host screen" src="https://github.com/user-attachments/assets/f620ee62-73bb-4ab4-bee4-f8aee0973961" />  

Joining is as simple as clicking the link:

<img class="contain"  width="562" height="554" alt="Join screen" src="https://github.com/user-attachments/assets/a2ae9b1d-5702-4be4-9b9f-e497043484b8" />  

When everyone is in, the fun begins. Participants can browse through restaurants, add suggestions, and vote.

<img class="contain" width="462" height="606" alt="Selection screen" src="https://github.com/user-attachments/assets/dd596ef4-00f0-4d8b-804d-a9994c284186" />  

And when consensus is reached, the winning option is displayed along with directions:

<img  class="contain" width="452" height="780" alt="Restaurant voting" src="https://github.com/user-attachments/assets/19659739-28ee-48d7-af0e-fc4e4204d3dc" />  



---

## What We Learned

While Chicken Tinder started as a fun idea, building it pushed us to explore several important concepts:

* **Real-time communication**: ensuring every participant’s view stayed in sync as votes rolled in
* **Scalable architecture**: balancing quick prototyping with a structure that could be extended for future use
* **User experience**: keeping the flow simple enough for friends to join and vote within seconds

These lessons are already influencing how we think about other projects at work.

---

## Final Thoughts

We may not have won the code-a-thon, but we walked away with something even better: an app we can actually use with friends and family and a stronger understanding of building real-time web applications.
