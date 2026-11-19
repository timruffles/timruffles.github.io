---
title: "Homage to Ascendancy: devblog 1"
date: 2026-11-19
---

For [this project](/building-a-homage-to-ascendancy-strange-suns) to succeed, I knew I needed to take approaches that let agents work for long periods without supervision. I'm working full time, so any other approach would leave me either with an unpaid mortgage or an unfinished game.

From experience, this would require pre-work to ensure the agent had guardrails, and that the tools it needed actually worked. It's never fun to find your agent has spent hours in a `/goal` loop sadly observing it still lacked some critical permission or dependency.

Since I'm reinterpreting an existing game, I had excellent source material for the guardrails: the game manuals and strategy guides. Feast your eyes on the manual's lovely 90s art:

![ascendancy's 1995 manual](img/asc/blog-01/manual.png)

From these references, I had an agent write up a programmer-level spec of the game. I also found a decompilation of the original to look up ambiguous rules. Compiling the spec once would save a huge amount of time for agents vs repeatedly digging around in the source material. Also, later on I could edit it to indicate deliberate changes from the original rules, e.g. replacing AI, adding automation etc.

## Automatic visual QA

I also realised that running the original in DOSBox would let agents do high-fidelity checks themselves. So before running I proved out that the model could run Ascendancy in DOSBox to check UI and behaviours that weren't clearly specified in the manual. Watching a computer-use play a DOS game from 1995 is wild:

![agent playing a game from 1995](img/asc/blog-01/agent-plays-ascendancy-1995.mp4)

I also made sure the agent could get a hello-world Unity project running, and was able to control Unity to check its own UI work. Hello galaxy:

![unity hello 4x](img/asc/blog-01/new-game-foundation.png#medium)

Finally, I noticed Unity's built-in AI 3D model generation! So I could start with some vaguely Ascendancy-like ships.

## Architecture

One major architectural decision I made before starting was that the game logic must run headlessly, including all player commands, without coupling to Unity or the UI. The UI must dispatch commands to the game engine, but the coupling must point only from UI to game, never the reverse.

This was to ensure the core game logic and AI could be developed in parallel by agents without requiring huge resources from many instances of Unity. It'd also make it easy to build new development tools and test harnesses.

## `goal.md` version one

I wanted my version of the game to be 3D throughout, with modern UI conventions. Combined with the above, this meant my first day's `goal.md` was:

```text
create a unity version of the classic game ascendancy. this should:
- pluggable sounds
- modern (3d) graphics
- modern UI implementation, but a similar look and feel 
  - the UI should be improved in terms of reducing toil and have modern scrolling etc, e.g. wasd for free flying camera around the space zones
  - planets should be a 3d and zoomable, but still fixed in rotation
- have a pluggable AI system for controlling the enemies, with the original AI as the first implementation
- use architecture.md for unity approach
	- start with pure code implementation of the game, build UI later
	- lean as hard as possible on headless implementation of systems for fast development
```

## The first overnight run

With all the prep work done, at 9.20pm I prompted `/goal complete the work in goal.md` and called it a night. I woke up to… a game! An _extremely_ ugly game, but a game:

![first night result - a game!](img/asc/blog-01/agent-self-capture-galaxy-final-all-known-T02-23.png)

Over twelve hours and seventy-six commits, the spec had became a reality (spot the lazy human commit messages):

```gitlog
2026-10-11T21:03:24+01:00 757e41097 initial
2026-10-11T21:18:59+01:00 19352ce7b pre big run
2026-10-11T21:24:03+01:00 c0361c881 Plan Ascendancy recreation and preserve original content tables
2026-10-11T21:57:32+01:00 773e7259f Implement shared simulation and Unity campaign foundation
2026-10-11T22:08:48+01:00 abb5d7e73 Add deterministic ship combat and pluggable original AI
...
2026-10-12T07:57:05+01:00 151770dd3 Add four surface structure model references
2026-10-12T09:17:56+01:00 80a047852 Add first species portrait art targets
```

What was cool was looking back over the agent session and finding all the images it had captured overnight:

![agent captures from the first night](img/asc/blog-01/first-night-agent-captures.mp4)

Then, of course, I wanted to fix everything about it.