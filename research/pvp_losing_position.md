# PvP Losing Position Design

How to make losing a PvP match feel less bad — without rubber-banding, without charity, without undermining the winner's earned advantage.

---

## The Problem

In a 1v1 tactical match, there's a moment where one player knows they've lost. Maybe it's a list mismatch, maybe the opponent outplayed them in the opening, maybe they made one bad trade. Whatever the cause, the game is effectively over — but it isn't *actually* over. The remaining turns are a slow grind where the losing player watches their force get dismantled piece by piece.

This is the **dead zone**: the gap between "I've effectively lost" and "the game ends." In a 20-minute match, if the outcome is decided at minute 8, the remaining 12 minutes are misery. This is the single biggest threat to PvP retention. A player who sits through three dead zones in a row will stop queuing.

The dead zone is worse in tactics games than in real-time games because every turn requires active decisions. You can't zone out — you have to move your doomed units, watch them get killed, move the survivors, watch them get killed. Each turn asks you to engage with a situation you've already checked out of emotionally.

---

## Design Goals

1. **Compress the dead zone.** Lost games should end quickly — through tuning, through concession, through the natural physics of the game.
2. **Make losing positions interesting to play.** The turns you do play while behind should involve real decisions, not just delaying the inevitable.
3. **Keep games competitive longer.** Structural dynamics that prevent early runaways — without punishing the leader or giving the trailer unearned advantages.
4. **Give every match a story.** Post-match scoring and stats should make every game — win or loss — feel like it produced something worth looking at.
5. **No rubber-banding.** No blue shells. The leader earned their lead. Comeback potential comes from the trailing player having *options*, not from the game handicapping the leader.

---

## Layer 1: Faction Losing-Position Mechanics

Each faction should have a mechanic that activates or improves when the faction is at a unit disadvantage. These aren't comeback mechanics — they're mechanics that make the losing state *play differently* than the winning state. The losing player's decisions shift rather than degrade.

The principle: losing units should change your playstyle, not just weaken it.

### Ember Covenant — Already Solved

Zeal is the model. Units that take damage become more dangerous. A losing Ember force is at peak ATK output. The player's decisions in a losing position are genuinely interesting: sacrifice the Martyr now for a Zeal spike? Hold the Inferno as a damage sponge to build more stacks? Push the Pyromancer forward to trigger Immolation before they die?

Ember's losing state is arguably their most tactically rich state. Every other faction should aspire to this.

### Iron Vanguard — Unbroken Line

**Current problem:** Shield Wall requires adjacency, so losing units directly degrades the faction's primary synergy. Fewer units → fewer adjacency pairs → less armor → units die faster. This is a death spiral.

**Proposed mechanic — Unbroken Line:** For each Iron Vanguard unit that has died this match, all surviving Iron Vanguard units gain +1 ATK.

- At full strength (5 units), Iron plays their formation game — Shield Wall armor, Commander's Aura, careful positioning.
- Down to 3 units: Shield Wall is harder to maintain but each survivor hits +2 harder. The player is transitioning from "hold the line" to "make every hit count."
- Down to 1-2 units: Formation play is gone entirely. What remains are individual heavy hitters with +3 or +4 ATK. A lone Warjack with base 5 ATK + 3-4 from Unbroken Line is a genuine threat that demands respect.

**Why this works:** The playstyle shifts organically. Early game is formation tactics. Late game (when losing) is berserker tactics. Both require real positioning decisions, but they're *different* decisions. The losing Iron player isn't playing a worse version of their opening — they're playing a different game within the same faction identity.

**Why this isn't rubber-banding:** The total faction damage output still decreases as units die. Three units at +2 ATK each is less total damage than five units at base. The per-unit increase makes each remaining piece *matter more* without actually compensating for the lost units. The winning player still has the advantage — they just can't ignore the survivors.

### Storm Reavers — Desperation Protocol

**Current problem:** Firing Line requires 2+ units in the same row. As units die, maintaining row alignment becomes harder or impossible. Static Field requires the Stormcaller to be alive and near enemies — if the Stormcaller dies, the entire synergy package collapses.

**Proposed mechanic — Desperation Protocol:** When Storm Reavers have fewer living units than the opponent, all surviving ranged units (range ≥ 2) gain +1 Range.

- At full strength, Storm plays their standard game: Firing Line formations, Stormcaller positioning for Static Field, concentrated fire.
- When outnumbered: the remaining ranged units can shoot from one tile further. A Gunner at range 4 or a Stormcaller at range 4 can threaten from positions the opponent can't easily reach.
- The tactical shift: from "line up the firing line" to "kite and snipe." The losing Storm player is playing a spacing game — staying at maximum range, forcing the opponent to spend turns closing distance, picking off targets from safety.

**Why this works:** Extended range creates a fundamentally different tactical problem. The losing Storm player has fewer shots per turn but each shot comes from a safer position. The winning player has to actively hunt them down rather than just marching forward. The final turns of a Storm loss involve cat-and-mouse positioning, not passive death.

**Why this isn't rubber-banding:** +1 Range doesn't increase damage output — it increases survivability of the remaining units. The losing player still deals less total damage. They just get to *play longer* and make more interesting decisions during that time. The winning player isn't handicapped; they just have to close the distance.

### Veil Syndicate — From the Shadows

**Current problem:** Veil units are individually fragile (0 armor across the roster). When they start losing units, the faction's board presence collapses fast. Marked for Death requires 2+ units in range of a shadowmarked enemy, which gets harder as units die. Shadow Network (no adjacent Veil units → +1 Move) gets trivially easy to maintain but benefits fewer units.

**Proposed mechanic — From the Shadows:** When only 1-2 Veil Syndicate units remain, they gain:
- +2 Move
- All attacks apply Shadowmark automatically (no Hexer needed)
- +2 ATK against shadowmarked targets

At 1 unit remaining, add: that unit cannot be targeted by ranged attacks from more than 2 tiles away (represents going fully covert — enemies have to get close to engage).

- At full strength, Veil plays their assassination/debuff game: Hexer marks targets, Shadowblade and Phantasm flank, the squad converges on isolated enemies.
- At 1-2 units: the survivors become elite assassins. Massive mobility, auto-marking, and bonus damage against marked targets. A lone Shadowblade with effective 5 Move, auto-mark, and +5 ATK against marked targets (base 3 + 2 bonus) is a lethal piece that can threaten almost anywhere on the board.

**Why this works:** Veil's fantasy is the assassin who strikes from the shadows. A full Veil squad is a coordinated hit team. A lone Veil survivor is the assassin archetype at its purest — fast, deadly, hard to pin down. The losing state amplifies the faction identity rather than degrading it.

**Why this isn't rubber-banding:** A single unit, no matter how enhanced, can only kill one target per turn. The winning player with 4+ units still has overwhelming action economy. The Veil survivor is dangerous but fragile (still 0 armor) — one clean hit and they're dead. The dynamic is a knife fight, not a reversal. The losing Veil player gets to feel like an assassin for a few turns before going down, and might take a high-value target with them.

---

## Layer 2: Structural Dynamics (No Rubber-Banding)

These are properties of the game's tactical system that naturally keep games competitive, without any mechanic explicitly checking who's ahead.

### The Concentration Effect

On an 8x6 grid, a player with 2 remaining units can concentrate force more easily than a player with 5 units spread across the board. Fewer pieces means simpler optimization — you can position perfectly because you have fewer constraints. The winning player has to coordinate more pieces, which means more opportunities for positioning mistakes.

This is a natural property of tactical games on small grids. No mechanic needed — just don't design it away. Avoid mechanics that let the winning player mindlessly swarm.

### Closing Is a Skill

Converting a material advantage into a win should require good play. The winning player should feel "I need to finish this cleanly" — not "I just wait." Design levers:

- **Don't let ranged units safely chip from max range with no risk.** If the winning player can park ranged units at maximum range and slowly whittle, the closing phase is trivial and boring for both players. Ranged units should have to expose themselves somewhat to deal damage.
- **Positioning still matters when ahead.** A 5v2 advantage on a small grid can still go wrong if the 5 units are poorly positioned. Synergies should require active maintenance (Iron needs adjacency, Storm needs row alignment, Veil needs separation) so the winning player can't just attack-move.
- **Don't let armor + healing stall indefinitely.** If any unit combination can turtle without taking meaningful damage, the dead zone stretches. Ensure that any defensive setup can eventually be cracked by concentrated force.

### Action Economy Advantage, Not Stat Advantage

The winning player's advantage should primarily be *more actions per turn*, not *stronger individual actions*. Five units taking five actions vs two units taking two actions is a clear advantage, but the two-unit player's individual actions are equally impactful. This means each remaining unit feels meaningful. Compare this to a stat-advantage model where the winning player's units are individually stronger — that makes each losing-side action feel futile.

### Synergy Breakpoints Create Natural Tension

The faction synergies create discrete power levels that can shift during a match. If the Iron player loses one unit and breaks Shield Wall, their power drops noticeably. If the Storm player's Stormcaller dies and Static Field deactivates, same thing. These breakpoints mean a single kill can meaningfully shift the balance — which keeps both players engaged because the next kill *matters*. The game doesn't gradually slide toward a foregone conclusion; it steps down in discrete, dramatic moments.

### The First Kill Matters Most

In a 5v5 on a small grid, the first kill creates the biggest relative advantage (5v4 is a 25% action economy swing). Each subsequent kill matters less in relative terms. This means the early game — where both players are at full strength — is where the match is most competitive and tense. If the game is decided by the first 2-3 kills and closes quickly after, the "competitive" portion is the majority of the match.

Design implication: don't add too many units per side. The current roster sizes (3-7 unit types per faction, with a deployment budget) should produce armies of ~4-6 units. That's tight enough that one kill is decisive but not game-ending.

---

## Layer 3: Concession as First-Class Action

When the game *is* effectively over, the losing player should be able to end it cleanly. This isn't giving up — it's a strategic decision that respects both players' time.

### UI Design

- The action is called **Resign**, not "Surrender" or "Quit." Resign carries chess connotations — it's a mark of understanding, not weakness.
- Resign is accessible at all times but requires a confirmation ("Resign this match?" with a single confirm tap — not a buried menu, not a three-step flow).
- Resigning triggers a brief match summary for both players — the match didn't just vanish, it concluded.

### Cultural Framing

- Tooltip or first-time explanation: "Good players resign when the position is lost. It's a sign of respect — you understand the game well enough to know the outcome."
- Post-match screen after resignation should show the same full stats as a played-out match. No penalty for resigning. The stats still tell the match's story.
- Consider showing "Resigned at turn X" as a neutral fact in match history, not a stigma mark.

### When Not to Resign

The faction losing-position mechanics exist specifically so that resignation isn't the *default* response to falling behind. A player who's down 2 units should think "my faction plays differently now, let me see what I can do" before thinking "I should resign." Resignation is for positions that are truly lost — 1v4 with no realistic path — not for any disadvantage.

The test: if players are resigning the moment they lose their first unit, the losing-position mechanics aren't doing their job.

---

## Layer 4: Post-Match Scoring and Stats

Every match — win or loss — should produce data the player cares about. The goal: a losing player looks at their stats and sees something specific to improve, not just "you lost."

### Match Stats (Shown to Both Players)

**Combat Stats:**
- Total damage dealt / damage taken
- Units killed / units lost
- Kill/death ratio
- Damage per unit (average and per-unit breakdown)
- Overkill damage (wasted damage on already-dead units — a sign of inefficient targeting)

**Tactical Stats:**
- Synergy uptime — what percentage of turns was each synergy active?
- Average unit movement per turn (mobility utilization)
- Positioning quality — how often were units in optimal range? (ranged units at max range, melee units adjacent to targets)
- First blood — who got the first kill and on which turn?
- Turning point — the turn where the HP differential shifted most dramatically

**Faction-Specific Stats:**
- Iron: Peak Shield Wall coverage (most units in formation at once), total Unbroken Line bonus accumulated
- Storm: Firing Line activation rate, longest range kill
- Veil: Shadowmarks applied, kills on marked targets, From the Shadows activations
- Ember: Peak Zeal stacks, total Zeal damage bonus, Immolation uptime

### The Momentum Graph

A turn-by-turn line chart showing the total HP differential between the two players. This instantly tells the story of the match:
- Was it close throughout? (Lines near each other)
- Was there an early blowout? (Lines diverge fast)
- Was there a comeback attempt? (Lines converge then diverge again)
- Where was the turning point? (Biggest slope change)

The graph should highlight the single most impactful turn — the turn where the differential shifted the most. This is the "here's what decided it" moment. Both players can look at that turn and understand what happened.

### Match Replay

Full turn-by-turn replay of the match. The player can scrub through turns, see the board state at any point, and review their decisions. This is the most powerful learning tool — you can literally watch what happened and identify the moment things went wrong.

Implementation notes:
- Store the full game state at each turn (board positions, HP values, synergy states). On an 8x6 grid with ~10 units, this is tiny — maybe 1-2 KB per turn, so a 20-turn match is ~40 KB.
- Replay controls: play/pause, step forward/back, speed slider, jump to turn N.
- Overlay options: show attack ranges, show synergy zones, show damage numbers.
- Highlight the "turning point" turn in the replay timeline.

### Achievements and Milestones

Achievements that reward interesting play regardless of match outcome. The key: achievements should be things a losing player can earn, not just consolation prizes.

**Combat achievements (earnable win or loss):**
- *Last Stand* — Deal 10+ damage with your final surviving unit
- *Glass Cannon* — Deal the most total damage in the match but lose
- *Efficient* — Win (or lose) with zero overkill damage
- *Scrapper* — Lose by 1 unit (went down to the wire)
- *Punching Up* — Kill a unit that costs 10+ more than the attacker

**Faction achievements:**
- Iron: *Unbreakable* — Maintain Shield Wall for 5+ consecutive turns. *Berserker* — Kill 2+ enemies with Unbroken Line bonus active.
- Storm: *Sniper* — Kill a unit from maximum range (4+ tiles). *Fire Superiority* — Activate Firing Line on 3+ consecutive turns.
- Veil: *Assassin* — Kill a full-HP unit in one hit with Shadowmark bonus. *Ghost* — Win with the From the Shadows bonus active (solo survivor).
- Ember: *Inferno* — Reach 5+ Zeal on a single unit. *Phoenix* — Win a match where you were behind in units for 3+ turns (earned comeback through Zeal).

**Milestone stats (tracked across matches):**
- Total damage dealt (lifetime)
- Total matches played per faction
- Win rate per faction
- Average synergy uptime per faction
- Longest win streak / current streak
- Best "losing stat line" — your highest-damage loss, your closest loss, your best single-unit performance in a loss

The "best losing stat line" category is deliberate. It tells the player: your losses have shape and quality. A 14-damage loss where you went down 2-5 is a better loss than a 4-damage loss where you got swept 0-5. Tracking this makes losses feel like data points in a progression, not just failures.

---

## Layer 5: Tuning Guidelines

Specific tuning targets to compress the dead zone.

### Match Length Targets

- **Full match (no resignation):** 12-20 turns, roughly 15-25 minutes.
- **Decided match (one player clearly ahead):** Should resolve within 4-6 turns of the decisive moment. If a 5v2 takes more than 4 turns to close out, HP/armor values are too high.
- **Dead zone tolerance:** No more than 3-4 turns where the outcome is effectively decided but the match continues. This is the maximum — ideally it's 1-2 turns.

### HP and Damage Calibration

- Units should die in 2-3 hits from a same-cost attacker (before armor). This keeps kills flowing and prevents stalemates.
- Armor should reduce damage meaningfully but not create unkillable units. A unit with 2 armor should still die in 3-4 hits from a standard attacker.
- Total army HP should be roughly 3-4x the total army damage output per turn. This means a full-strength army can theoretically wipe the opposing army in 3-4 turns of perfect focus fire — which sets a natural upper bound on match length.

### AI Aggression (PvE Context)

When the AI has a significant unit advantage (3+ units more than the player), it should play aggressively — pushing forward, taking efficient trades, closing the match. A winning AI that plays passively or defensively stretches the dead zone unnecessarily.

### The Resignation Signal

If the game can detect that a position is functionally lost (e.g., the remaining player units cannot deal enough total damage to kill even one opposing unit given current HP/armor values), surface a subtle prompt: "Position looks difficult — resign or fight on?" This isn't forced and should never trigger in ambiguous positions. It's a gentle acknowledgment that speeds up the decision to concede without pressuring the player.

---

## Summary

Five layers working together:

| Layer | Purpose | Blue-shell risk? |
|-------|---------|-----------------|
| Faction mechanics | Make losing positions interesting to *play* | No — changes playstyle, doesn't compensate for lost units |
| Structural dynamics | Keep games competitive through natural tactical properties | No — inherent to the grid/action-economy model |
| Concession | Let lost games end on the losing player's terms | No — player agency |
| Post-match scoring | Give every match a story and actionable data | No — pure information |
| Tuning | Compress the dead zone through numbers | No — faster resolution |

None of these layers punish the winning player. None give the losing player unearned advantages. Together they ensure that: (1) the competitive phase of the match is the majority of the match, (2) the losing phase is short and interesting, (3) every match produces something the player can learn from and track, and (4) the player always has the option to end it cleanly.
