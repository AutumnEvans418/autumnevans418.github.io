---
layout: post
title: Complexify
description: 
category: project
tags: [web,blazor,fsharp,bolero,elmish,fparsec]
buttons:
  - title: Source Code
    url: https://github.com/AutumnEvans418/Complexify
  - title: Website
    url: https://white-pebble-0dc9b2110.1.azurestaticapps.net/
---

Perfect, I’ll refine the blog post with your direction: reframe the introduction around the idea of intentionally making problems harder (like a playful analogy to hashing), remove the *Getting Started* section, and add a **demo example**.

Here’s the updated draft in markdown:

---

# Exploring Mathematical Complexity with *Complexify*

As developers, we usually aim to solve problems by finding the **simplest, most elegant solution**. But what if we flipped that on its head?

What if, instead of simplifying, we intentionally made problems **more complicated**?

That’s the idea behind **Complexify**, a web application that takes a simple mathematical equation and transforms it into a more complex but equivalent version before evaluating the result. Think of it like an overly simplified version of hashing: start with something easy to understand, apply transformations, and end up with something that looks far more difficult to interpret, but still resolves to the same value.

## Try it out:
<iframe src="https://white-pebble-0dc9b2110.1.azurestaticapps.net/" title="Complexify" width="100%" height="100%"></iframe>

## What is Complexify?

Complexify is an interactive tool for exploring mathematical complexity:

* Start with a simple equation, like `2+2=4`.
* Adjust a **complexity slider** to determine how much more intricate the result should become.
* See the transformed equation and its evaluated result.

It’s a playful way to turn straightforward math into something more challenging, while still maintaining correctness.

---

## Key Features

* **Equation Input**: Enter simple mathematical expressions.
* **Complexity Slider**: Control how intricate the resulting expression becomes.
* **Transformed Output**: View the “complexified” equation.
* **Evaluation Results**: Confirm that it still evaluates correctly.


## Technology Stack

Complexify was built entirely with the F# ecosystem on top of Blazor WebAssembly:

* **F#** – A functional-first language on .NET, perfect for modeling mathematical transformations.
* **Bolero** – An F# web framework for Blazor, bringing the power of .NET to the browser.
* **Elmish** – Implements the Model-View-Update architecture for clean, predictable state management.
* **FParsec** – A parser combinator library for F#, used to parse and manipulate mathematical expressions.

---

## Project Structure

The solution is organized into clear components, each handling a different responsibility:

* **`Parser.fs`**: Parses mathematical expressions with FParsec, supporting operators like `+`, `-`, `*`, `/`, `^`, `=`, `log`, and `exp`.
* **`Runner.fs`**: Evaluates parsed expressions and generates more complex equivalents.
* **`Main.fs`**: Implements Elmish’s model, update, and view logic.
* **`Startup.fs`**: Configures and starts the Blazor WebAssembly host.
* **`wwwroot/main.html`**: Provides the layout and UI bindings.

---

## Lessons Learned

Working on Complexify was one of the few times I’ve used F# alongside Bolero. The experience confirmed how powerful this combination is for building applications with **complex logic and interactive UIs**:

* **F#** made mathematical parsing and transformations expressive and natural.
* **Bolero + Elmish** offered a clean model for state management and user interactions.
* **FParsec** provided the flexibility to construct reliable mathematical parsers.

Overall, the project reinforced how much fun functional programming can be when paired with modern web frameworks.

## Conclusion

Complexify started as a thought experiment, *what happens if we try to make math more difficult instead of simpler?*, and became a full-fledged project. It’s part puzzle, part playground, and part demonstration of how functional programming can model complexity with elegance.