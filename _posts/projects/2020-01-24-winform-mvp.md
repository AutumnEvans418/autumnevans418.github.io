---
title: Winform MVP
layout: post
category: project
tags: [winforms]
description: Unit Test winforms with mvp pattern
buttons:
  - title: "Source Code"
    url: https://github.com/chrisevans9629/PresenterPatternGenerator
---

Winforms is a mature framework, with the unfortunate design of being tightly coupled to the view.  This makes winforms really hard to unit test and seperate business logic from the view.  My first attempt in seperating the view was by using bindings and mvvm.  Unforuntately, I was not satisfied with the binding capabilities of winforms.  I ended up going with the model-view-presenter pattern and successfully converted forms to use mvp.  This took a long time, so I eventually wrote a program to generate the starting code for me!

You can see how it works on my [github](https://github.com/chrisevans9629/PresenterPatternGenerator)
