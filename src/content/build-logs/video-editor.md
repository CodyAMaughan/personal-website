---
title: "Say Play: Building an AI Director for Video"
pubDate: "January 20, 2026"
tags: ["AI", "LangGraph", "Remotion", "Generative UI", "Agents", "Say Play"]
description: "How I built an agentic video editor that writes React code instead of just generating pixels."
featured: true
---

I’ve always loved the creative potential of short-form video, but let’s be honest: I am not a video editor. I don't have the skills to make things look professional in Premiere or DaVinci, and frankly, I don't have the patience for the grind.

I wanted to make simple, reverent short videos—scriptures overlaid on nature backgrounds with peaceful music—but the thought of manually dragging clips, syncing audio, and animating text for every single verse felt paralyzed by friction.

I built **Say Play** to solve this. I didn't want a "Text-to-Video" model that hallucinates weird, morphing AI visuals. I wanted a tool that could take my intent, search for *real* assets (stock footage, music), and stitch them together with code.

The result is an AI Agent that acts as a **Director**, orchestrating the entire production process from a simple prompt like "Create a reverent video for Moroni 10:3-5 with a forest background."

## The "Director" Architecture

When I started designing the system, I knew I needed a separation of concerns. I wanted control, real assets, and custom effects. While generative video models exist, I didn't want to rely on them primarily.

I adopted a **Map vs. Terrain** architecture:

* **The Brain (Backend)**: Makes decisions, manages state, and writes instructions.
* **The Body (Frontend)**: Follows instructions, renders pixels, and plays audio.

### The Stack
* **Brain**: Python (FastAPI) + **LangGraph**
* **UI/Renderer**: React (Vite) + **Remotion** + Tailwind CSS
* **Storage**: SQLite (SQLModel) + AsyncStorage for state checkpoints

## Why LangGraph?

For the agent framework, I chose **LangGraph** over simple chains. Video production isn't linear; it requires loops. The agent needs to:

1.  **Plan**: "I need 3 scenes: Intro, Scripture Reading, Outro."
2.  **Research**: "I'll search Pexels for 'misty forest' video clips."
3.  **Execute**: "I'll create a `FadeInText` component for the verse."
4.  **Review**: "Wait, that text is hard to read against the trees. I need to add a background overlay."

LangGraph's stateful, cyclic graph architecture allows the agent to self-correct and maintain a "memory" of where it is in the production plan.

### Checkpointing & Persistence
We currently use a **SQLite Checkpointer** to save the conversation state. This is huge because it allows the agent to "pause" and pick up exactly where we left off later. If the server restarts, the "Director" doesn't forget the movie script.

*Note: While SQLite is perfect for this single-user MVP, the plan is to swap this out for a **Postgres Checkpointer** once we move to a multi-tenant architecture.*

## The Key: Video-as-Code

The core philosophy here is **Video-as-Code**, and this is exactly why we use **Remotion**.

Instead of an AI trying to guess pixel values, the agent uses a custom tool `create_component` to write React components on the fly. If I ask for a "cinematic text reveal," the agent doesn't look for a pre-made effect; it *writes the CSS and Typescript* to make it happen programmatically.

This gives Say Play infinite extensibility. The "Video" is just a composition of these dynamic code blocks, rendered instantly by the browser.

## What's Next?

The project is currently evolving into **"MVP 2.0" (The Vision Upgrade)**. The goal is to give the agent "eyes" (Vision LLMs) so it can watch gameplay footage, identify high-energy moments (like a kill or a win), and automatically edit a highlight reel.

We're moving from "Software that helps you do work" to "Software that does the work for you," and I'm excited to see where this Director goes next.