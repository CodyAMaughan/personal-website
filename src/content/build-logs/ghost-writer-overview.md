---
title: "GhostWriter: Engineering the Turing Test for Party Games"
pubDate: "2026-01-15"
tags: ["Game Dev", "WebSockets", "Prompt Engineering", "Social AI"]
description: "How I built a multiplayer social deduction game where AI agents try to blend in with humans."
---

"Is that a typo because they're typing fast, or because they're an LLM trying to *look* like they're typing fast?"

That's the core loop of **GhostWriter**, a Jackbox-style party game I built where players answer prompts and try to fool their friends into thinking they are AI—or getting their friends to mistake the AI for a human. It's the "Dead Internet Theory" gamified.

Here's how I engineered the "Turing Test" mechanics and the serverless P2P architecture that powers it.

## The Architecture: "Host as Server"

Speed is everything in party games. I needed a low-latency architecture, but I didn't want the overhead (or cost) of maintaining a dedicated WebSocket backend 24/7 for a project played sporadically.

My solution: **Peer-to-Peer (P2P)**.

* **Networking**: **PeerJS** (WebRTC). Instead of a central server, the **Host's browser acts as the game server**.
* **Frontend**: **Vue 3** (Composition API) for the reactive UI.
* **State Management**: The Host maintains the "Single Source of Truth" `gameState` object and broadcasts patches to connected peers.

### Why PeerJS?
By using WebRTC via PeerJS, I eliminated backend costs entirely. The game scales infinitely because every new game brings its own "server" (the Host's laptop).

## Engineering the "Turing Test"

The biggest challenge wasn't networking; it was making the AI agents feel "human enough" to be plausible, but "bot enough" to be suspicious.

### 1. Persona-Based Prompt Engineering
I didn't just ask the AI to "answer the question." I built distinct **Ghost Agents** defined in `src/config/themes.js`. Each has a rigorous System Prompt designed to mimic specific human internet archetypes:

* **The Gen-Z**: *"You are a bored Gen-Z teenager. Answer the prompt using all lowercase, slang (like 'no cap', 'bet', 'mid'), and minimal punctuation. Act like you don't care."*
* **The Boomer**: *"You are an elderly person typing on Facebook. Use RANDOM ALL CAPS for emphasis, lots of ellipses..., and maybe sign your name at the end."*
* **The Glitch**: *"You are a corrupted file. Insert random characters and glitches like ZALGO within reason."*

I discovered that **prompting for typos** ("maybe a typo") was more effective than programmatically inserting them. The LLMs are surprisingly good at "fat-finger" simulation when explicitly told to be careless.

### 2. The Human-in-the-Loop
To make the deduction harder, I implemented a "Choice Matrix." When a player chooses to "Ghost Write," the Host requests 3 variations from the LLM (Gemini or OpenAI). The player then *curates* the best one. This layer of human selection removes the obvious "AI-isms" that often give bots away.

## Security & State Synchronization

Since the Host is the server, I had to handle state synchronization carefully to prevent race conditions and—more importantly—cheating.

If I simply broadcasted the full `gameState` to everyone, a tech-savvy player could open the Chrome Network Inspector, look at the JSON payload, and see exactly which answer was flagged as `is_ai: true`.

### The "Masking" Solution
To prevent this, I implemented a middleware function on the Host that sanitizes the state before broadcast:

```javascript
// The Host acts as the authority
const broadcastState = () => {
    const maskedState = JSON.parse(JSON.stringify(globalState));
    
    if (maskedState.phase === 'VOTING') {
        // STRIP THE TRUTH
        maskedState.submissions.forEach(sub => {
            delete sub.authorId;
            delete sub.isAi;
        });
    }
    
    // Send sanitized state to peers
    connections.forEach(conn => conn.send({ type: 'SYNC', state: maskedState }));
}
```

This ensures that the "Truth" never leaves the Host's machine until the reveal phase, preserving the integrity of the deduction.

## Future Glitches

GhostWriter started as a test of "can AI be funny?", but it turned into a lesson in distributed state management. By treating the browser as the server and using LLMs as role-playing actors rather than just text generators, I created a social deduction game where the line between "human error" and "machine learning" is delightfully blurry.