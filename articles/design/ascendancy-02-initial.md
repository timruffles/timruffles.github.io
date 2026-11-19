---
title: Homage to Ascendancy - devblog 1
date: 2026-11-13
draft: true
---

For this project to succeed, I knew I needed to take approaches that let agents work undirected for long periods of time without supervision. I'm working full time, so any other approach would leave me either with an unpaid mortgage or an unfinished game.

From experience, the meant pre-work to ensure the agent had guardrails to keep itself on target. Further, that all the tooling it needed actually worked. It's never fun to wake up and find your agent had spent hours in a `/goal` loop sadly observing it still lacked some critical permission or dependency.

Since this is based on an existing game, luckily I had exactly the material I needed to let the agent do the basic build-out against a spec: the game manuals and strategy guides. Taking these, I had an agent write up a programmer level spec. For ambiguous cases I also found a decompilation of the original game to look up specific tables and parameters. Having a spec built once would save a huge amount of time for agents vs repeatedly digging around in the source material. Also, later on I could edit it to indicate deliberately changes from the original rules, e.g. replacing AI, adding automation etc.

I also realised that running the original in DOSBox would let agents do high-fidelity checks themselves. So before running I also proved out that the model could run Ascendancy in DoxBox to check UI and behaviours that weren't clearly specified in the manual.

I also made sure the agent could get a hello-world Unity project running, and was able to control Unity to check its own UI work.

For assets, Codex has image generation (unlimited on pro!), so one easy batch job was to take the original assets en-masse and regenerate upscaled versions of species, tech and planets. Unity also had a free trial of their AI mesh generation, which cranked out the basic planet models.

## Architecture

The only architectural decision I went into the project with was that the game logic must run headlessly, including all player commands, without coupling to Unity or the UI. The UI must dispatch commands to the game engine, but the coupling must run only from UI to game, never the reverse.

This was to ensure the core game logic and AI could be developed in parallel by agents without requiring huge resources from many instances of Unity. It also made it easy to build new development tools and test harnesses.

I'm not a .NET person, so I did some background gathering of suggested architectures for how that could be done, as well as suggested Unity UI and 3D libraries. UIToolkit plus URP sounded fine. Turns out Unity have a lot of agent skills too.

## The first overnight run

With that, I was ready to write a `/goal complete the work in goal.md` and snooze. I woke up to... a game! Over twelve hours and seventy-six commits, the spec became a reality. Not a very exciting reality, but the approach was proven out:

<TODO images>

Then the iteration began.
