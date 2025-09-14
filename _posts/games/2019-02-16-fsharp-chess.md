---
layout: post
title: 'FSharp Chess'
category: game
description: "An implementation of chess written in F# and Avalonia"
tags: [fsharp,avalonia,mvu]
image: https://raw.githubusercontent.com/AutumnEvans418/FSharpChess/master/assets/image.png
pin: true
buttons:
  - title: "Source Code"
    url: https://github.com/AutumnEvans418/FSharpChess
---

# FSharpChess: A Functional Chess Engine with Avalonia UI

Most chess engines are written in object-oriented languages like C++ or Java. With **FSharpChess**, I wanted to explore a different approach—building a chess engine and interactive GUI in **F#**, a functional-first language, while keeping the design modular, testable, and cross-platform.

FSharpChess combines a **core chess logic library** with a **cross-platform Avalonia-based frontend**, resulting in a complete application where you can play against an AI opponent or another human player. Along the way, I implemented a functional UI architecture (MVU pattern) and a simplified AI using minimax with alpha-beta pruning.

![chess game](https://raw.githubusercontent.com/AutumnEvans418/FSharpChess/master/assets/image.png)

---

## Key Features

* **Move validation & rule enforcement**: All moves are validated according to chess rules, including special cases like checkmate and stalemate.
* **AI opponent**: A minimax-based AI opponent with alpha-beta pruning.
* **Cross-platform GUI**: Built with [Avalonia UI](https://avaloniaui.net/), running seamlessly on Windows, macOS, and Linux.
* **Functional architecture**: Clear separation of concerns using the **Model-View-Update (MVU)** pattern.
* **Test coverage**: Core chess logic is backed by unit tests to ensure reliability.

---

## The MVU Architecture in Action

Instead of traditional UI patterns like MVC, I chose the **MVU (Model-View-Update)** architecture, a natural fit for functional programming.

* **Model (State):** Holds all game-related data (board layout, move history, current turn, AI color).
* **View:** Renders the chessboard, move list, and controls. It is a pure function of the model.
* **Update:** Processes user interactions and AI responses by transforming the model into a new state.

This architecture keeps UI behavior **predictable** and **testable**, since rendering is always derived from a single source of truth—the current state.

---

## The Chess Engine & AI

The heart of the engine lives in two modules:

### **ChessActions.fs**

* Generates legal moves for each piece type.
* Enforces rules such as king safety, castling restrictions, and pawn promotion.
* Updates the game state after each move.
* Detects endgame conditions (checkmate, stalemate, or draws).

### **ChessAi.fs**

The AI opponent is built with a **minimax algorithm** enhanced by **alpha-beta pruning**, which cuts off unproductive search branches for efficiency.

* **Board evaluation**: Assigns material values to pieces and adds a mobility score.
* **Minimax**: Recursively explores moves to a fixed depth.
* **Alpha-beta pruning**: Skips branches that cannot affect the outcome, reducing computation.

This approach strikes a balance between playability and performance, producing competent AI moves without requiring deep search trees or external libraries.

---

## Why F# + Avalonia?

* **F#** provides a concise, expressive syntax for representing game state transformations. Functional immutability makes it easier to reason about correctness in move validation and state updates.
* **Avalonia UI** enables cross-platform desktop applications without platform-specific tweaks. Paired with **Avalonia.FuncUI**, the MVU pattern is a natural fit for building declarative UIs in F#.

---

## Example: Move Validation in Action

Here’s a simplified look at how moves are processed:

1. The user clicks a piece.
2. The engine generates all possible legal moves for that piece.
3. Invalid moves (e.g., exposing the king to check) are filtered out.
4. The chosen move updates the state via `moveById`.
5. The UI re-renders based on the new state.

This cycle illustrates how **functional state transitions** keep the application predictable and bug-resistant.

---

## Technologies Used

* **Language**: F#
* **Runtime**: .NET 8
* **UI Framework**: Avalonia UI + Avalonia.FuncUI
* **Testing**: NUnit

---

## Final Thoughts

FSharpChess has been an exploration into **functional programming applied to game development**, combining algorithmic logic with UI architecture in a clean, modular way. The combination of **F# immutability**, **MVU UI architecture**, and a **minimax-based AI** shows how functional design principles can yield a robust and maintainable chess application.

If you're interested in experimenting with F# and Avalonia, or just want to play around with a functional chess engine, check out the repository.
