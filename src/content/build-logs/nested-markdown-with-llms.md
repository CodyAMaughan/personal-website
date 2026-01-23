---
title: "Workflow: Generating Nested Markdown Specs with LLMs"
pubDate: "2026-01-22"
tags: ["Workflow", "Prompt Engineering", "Gemini", "Specs"]
description: "A simple prompt injection to prevent LLMs from breaking markdown rendering when generating documentation."
---

My development workflow has evolved into a specific pipeline: **Spec-First AI Development.**

I brainstorm architecture and design docs in **Gemini** (where the reasoning model feels superior for high-level planning), save that as a markdown file, and then feed that spec into my Agentic IDE to handle the implementation.

### The Breakdown
The friction point in this workflow is **Nested Markdown**.

When I ask Gemini to write a PRD (Product Requirement Doc) that includes JSON schemas or code snippets, it typically wraps those snippets in triple backticks (```). If I also ask it to "give me the markdown file," it wraps the *entire* response in triple backticks.

**Result:** The rendering breaks. The closing tick of the internal code block prematurely closes the file block, leaving the rest of the document as raw, unformatted text.

### The Fix: Tilde Escaping
The solution is a specific prompt instruction to force a different delimiter for the container.

> **Prompt:** "Generate the full design document. Wrap the final output in triple tildes (~~~) so I can copy-paste it easily."

By shifting the container syntax to `~~~`, the internal ` ``` ` blocks are preserved as content rather than syntax terminators. It’s a small change that removed a repetitive headache from my "Gemini → IDE" pipeline.