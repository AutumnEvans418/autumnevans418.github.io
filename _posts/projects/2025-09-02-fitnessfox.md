---
layout: post
title: Fitness Fox
description: A simple & secure cross-platform fitness app
category: project
tags: [web,blazor]
image: /assets/images/fox-logo.svg
pin: true
buttons:
  - title: Source Code
    url: https://github.com/autumnevans418/FitnessFoxNet
  - title: Website
    url: https://fitnessfox.azurewebsites.net/
---

After going through some important life events, I've started to focus more on my health and I wanted to start tracking my health data. After looking at various fitness apps out there, I decided that I would just start with storing my data in google sheets. At the time I didn't need anything complicated and didn't want to pay for a service. Additionally, I needed to track less common data than what most health apps typically allowed for. 

Eventually, I started to build an app to make inputting that data easier as well as creating a way to automatically syncronize the data in the app to my google spreadsheet, hence that's why this project exists.

> Note that this project is still a work in progress, but is something I'm personally using everyday and thought was worth sharing.

<img src="/assets/images/projects/fitnessfox/fitnessfox-home.png" alt="fitness fox home page" height="300" style="object-fit: contain;">


## High Level Features
- Manage Foods, Recipes, Meals, Vitals, Measurements, and Excercises (WIP). Data is stored via Sqlite and then syncronized to the cloud.
- Set various goals to track your progress via MudBlazor charts.
- Automatically syncronize to google sheets.
- Light/Dark Mode :)
- Supports running on the web AND on mobile!
- Supports various device sizes.
- OCR for reading labels (WIP).

## Technology Being Used
- .NET 8
- Blazor
- MudBlazor
- Google Cloud API
- Google Sheets
- Entity Framework Core (Sqlite)
- OpenCV
- Tesseract