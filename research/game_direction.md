# Game Direction

A digital tabletop miniatures game. Small-grid, turn-based tactical combat with faction asymmetry, list-building, and multiple play modes. Think "advanced chess with factions" — simple action vocabulary, deep positioning, infinite skill ceiling.

---

## Core Identity

**What it is:** A tactical miniatures game where you build a list from a faction's roster and fight on a small grid. The interesting decisions are list construction (before the match) and positional play (during the match). Both layers need to be deep.

**What it isn't:** A roguelike that happens to have tactics. A campaign game. A puzzle game. The roguelike wave mode exists as one way to play, not as the defining structure.

**Design pillars** (from game_analysis.md):
- Small action vocabulary, deep implications — complexity from positioning and timing, not from verb count
- Perfect information — you lose because you didn't think far enough, never because you didn't know something existed
- Think time, not time pressure — turn-based, no countdown clocks
- Theorycrafting is free engagement — list-building and matchup analysis extend the game outside of sessions
- 20-40 minute sessions — long enough for depth, short enough to finish in one sitting
- Skill depth, not content volume — the ceiling comes from getting better at reading positions, not from memorizing content

---

## Play Modes

All modes share the same factions, units, stats, and tactical combat rules. The core system is the constant; the modes are different contexts for it.

### PvP — The Core

Two players, each brings a list from their faction, fight on a grid. This is where the infinite skill ceiling lives. Human opponents can't be memorized, the metagame evolves naturally, and every loss is traceable to your decisions. This is the mode that sustains game 500+.

### PvE Skirmish — The Lab

Play against an AI-controlled faction. Three sub-modes:
- **Choose their list:** Pick the opposing faction and composition. Use this to test your list against specific matchups, practice positioning against known threats, experiment with new builds.
- **Random:** AI picks a random faction and legal list. Quick, low-stakes play.
- **Challenge:** AI picks a strong list and plays well. Prove your build works against resistance.

This mode is for experimentation and practice. It answers: "how does my list handle X?"

### PvE Roguelike — The Gauntlet

Wave-based, with drafting upgrades between waves. Scaling difficulty. This is the current prototype's structure. Functions as:
- Solo entertainment when no opponent is available
- Onramp for new players learning factions and positioning
- A different challenge axis — adaptation and resource management across waves rather than single-match optimization

The in-session growth arc (start constrained, draft upgrades, face escalating threats) is unique to this mode and gives it its own identity.

### Co-op (future)

Multiple players sharing a side against PvE content. Scales difficulty with player count (V Rising model — more players doesn't trivialize it). Could work with either Skirmish or Roguelike structures.

---

## The List-Building Layer

This is half the game. Before you play a match, you construct your force from your faction's roster within some point/slot budget. The metagame question — "what do I bring?" — should be as engaging as the tactical question "what do I do with what I brought?"

For this to work:
- Factions need distinct identities and asymmetric strengths
- Unit diversity within a faction needs to support meaningfully different list archetypes (aggressive, defensive, mobile, etc.)
- The budget system needs to force real tradeoffs — you can't bring everything

---

## What Exists Now

The current prototype (index.html) implements:
- 8x6 grid, turn-based combat
- Two factions (Iron Vanguard, Storm Reavers) with distinct unit rosters
- Wave-based PvE with three escalating waves
- Draft pool between waves (stat upgrades, specializations)
- Faction synergies
- AI enemy behavior

This is roughly the **PvE Roguelike** mode. The path forward is:
1. Get this mode feeling good as a standalone experience
2. Build PvP on the same tactical core
3. Add PvE Skirmish as a natural extension of having AI opponents + player list-building

---

## Open Questions

- **Grid size and unit count:** Is 8x6 with ~4 units the right scale? Smaller grids with fewer units make each decision more consequential (Into the Breach) but limit list-building variety. Larger grids with more units support deeper army construction but dilute individual unit significance.
- **Information model:** Full perfect information (Into the Breach style) or fog of war? Perfect info is fairer and more learnable. Fog of war adds scouting as a skill and makes the early game more dynamic. Both are viable — which serves the miniatures identity better?
- **Faction count for launch:** How many factions before the game has enough matchup variety to sustain PvP theorycrafting?
- **Async PvP:** Does the turn-based structure support async play (take your turn whenever, like correspondence chess)? This would dramatically expand the potential player base.
