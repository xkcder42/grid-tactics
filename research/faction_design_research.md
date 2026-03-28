# Faction Design Research — Compiled Findings

Research from tactical/strategy game design across Into the Breach, XCOM, Fire Emblem, Advance Wars, StarCraft, Slay the Spire, FTL, Monster Train, Root, Darkest Dungeon, MTG, and others.

---

## 1. Asymmetric Balance — What Breaks

### Snowball Mechanics
- **Economy advantages are the most dangerous asymmetry.** Advance Wars' Colin/Hachi bypass the fundamental resource constraint every other CO operates under. "Having more funds available simply isn't something that normal COs can contend with." More money is just more everything — it can't be countered by clever play.
- **Unit veterancy without upkeep** widens gaps — surviving units get stronger, making the winning side win harder. Company of Heroes pairs veterancy with army-size upkeep to counteract this.
- **Movement/terrain advantages compound early leads.** Advance Wars' Sturm ignores terrain costs, contesting captures everywhere — "likely gaining an early lead that will snowball despite his -20% firepower."

### Anti-Snowball Techniques That Work
- Diminishing returns on army size (positioning requirements naturally limit blob effectiveness)
- Population caps that benefit the loser (rapid rebuild without needing additional infrastructure)
- Subtle upkeep systems (Company of Heroes scales income penalties with army size quietly)
- Retreat mechanics that prevent total annihilation
- Defender's advantage that diminishes over time

**Key principle:** Keep anti-snowball features subtle. Explicit rubber-banding feels like developer manipulation. The best systems create natural friction against runaway leads without the player noticing.

### Feel-Bad Mechanics
- **Action denial (stun-lock)** — "Any game mechanic to the effect of 'stop playing the game for a while' is a bad game mechanic." Even at 50% win rate.
- **Resource denial** — MTG community has effectively deemed random discard and land destruction "unfun." Opponent "plays solitaire while the opposing player languishes."
- **Random negative outcomes** — XCOM Sectoid Mindspin is a "roulette-wheel" attack. Even if statistically fair, the variance creates enormous feel-bad moments.

**Design principle:** The line between challenge and frustration is whether the player can **plan around it**. Visible, predictable disadvantages create puzzles. Hidden, random disadvantages create anger.

### The "One Correct Build" Trap
- Happens when one unit/strategy optimally counters multiple threats
- Prevention: ensure at least **3 viable strategic paths** per faction
- Sub-factions or loadout variation helps (Company of Heroes 2's Commander system)
- **"No weakness" is itself a weakness** — Advance Wars' Andy (balanced, no tradeoff) is uncompetitive. Committed tradeoffs are always better than bland balance.

---

## 2. Spawning / Summoning Mechanics

### What Makes Spawning Fun vs Frustrating

**Fun when:**
- Player can **plan around spawns** (Into the Breach shows spawn positions one turn in advance)
- Spawns are **individually weak** (Total War zombies — terrible units whose value is positional)
- Spawning has **meaningful opportunity cost** (XCOM Sectoids that reanimate are NOT shooting at you)
- **Counter is clear** — kill the summoner, stop the spawns

**Frustrating when:**
- Spawns **replace losses without cost** — removes the purpose of strategic attrition
- Spawns **compound from kills** — XCOM Chryssalid cocoons (killing them spawns 3 more) inverts combat logic
- **Spawn timing is unpredictable** — burrowed ambushes violate the planning principle

### How Games Cap Spawning

| Game | Mechanism | Why It Works |
|------|-----------|-------------|
| Monster Train | Hard cap of 7 per floor + capacity currency | Forces strategic placement |
| Total War | Raise Dead limited to 2 uses per battle | Preserves necromancy fantasy without spam |
| Diablo 2 | New summons replace oldest | Army stays at max, no runaway growth |
| XCOM | Reanimated zombies are slow, fragile, temporary | More obstacle than real threat |

### Monster Train — Spawning as Faction Identity
- **Melting Remnant**: units have Burnout timers and die after N turns. Spawning is constant because your army is constantly expiring. The summoning loop IS the core gameplay.
- **Umbra**: generates Morsels (tiny units meant to be consumed by larger units) — spawning as feeding, not army-building.
- **Key insight:** The same mechanical limit (7 units per floor) feels completely different depending on the faction's relationship to spawning.

**Design principle:** Cap spawning with **opportunity cost, not just hard limits.** Hard caps feel arbitrary; opportunity costs feel strategic.

---

## 3. Decay / Degradation Mechanics

### Making "Getting Weaker" Feel Fun

**Darkest Dungeon's stress system (gold standard):**
- **Behavioral degradation over stat degradation.** Afflictions make heroes act autonomously in counterproductive but narratively logical ways (paranoid hero suspects allies, selfish hero hoards loot). Creates drama, not just penalty.
- **Visible and gameable.** Developers initially hid the stress meter but realized "the meter provides a tangible thing for players to try and 'game.'" Visible degradation = resource management challenge.
- **Heroic reversals create catharsis.** At 100 stress, 25% chance of becoming Virtuous instead of Afflicted. Makes the threshold exciting, not purely dreaded.

**Monster Train's Melting Remnant:**
- Decay IS the gameplay, not a penalty on top of gameplay. Players build around impermanence. Dying triggers powerful effects, so the "weakness" becomes the faction's greatest strength.

### Resource-Burning (Spend Health for Power)

**MTG Phyrexian Mana — cautionary tale:**
- Pay 2 life instead of mana. Broke the game because life is a starting resource, mana builds over time. Trading the former for the latter "cheats" the curve.
- Cards became effectively colorless AND undercosted, warping every format.
- **Fixed in later sets** by moving the life-pay option to activated abilities (not casting costs). Pay the real cost to play it; life-pay only discounts once it's on the battlefield.

**Design lesson:** Health-as-resource works when it's an **additional cost on top** of the normal cost, not a **replacement** for it.

### The Slippery Slope Problem
- Decay in competitive contexts creates runaway disadvantage: losing one unit ripples forward
- Solutions: periodic resets (round transitions), decay that benefits the decaying player (death triggers), shared decay (both sides degrade)

---

## 4. Sacrifice-for-Power Mechanics

### MTG Aristocrats — The Refined Model
Three interlocking pieces: sacrifice outlets, death triggers/payoffs, fodder/recursion.

**Why it works:** Creates a *reversal of the normal value equation*. Opponent destroying your creatures *helps you*. Both players face genuine tension.

**When it degenerates:** Fodder is too cheap, payoffs are too strong, no meaningful choice about which unit or when.

### When Sacrifice Stays Interesting
1. **Opportunity cost is real** — the unit you sacrifice had genuine utility staying alive
2. **Timing matters** — sacrificing now gets X, waiting might get more
3. **Resources are finite** — can't endlessly produce fodder
4. **Payoff scales with context** — great in some board states, terrible in others

**Mark Rosewater's insight:** Tension between intellectual ("sacrifice is correct") and emotional ("it feels wrong to destroy your own things"). Good sacrifice design lives in that gap. Remove either side and the mechanic dies.

### Self-Destruct / Martyrdom in Tactics
- **StarCraft Banelings** — require positioning skill, not just activation
- **Into the Breach** — entire game reframes sacrifice: mechs are expendable, civilians matter
- **Gloomhaven** — card loss system as ticking clock: powerful cards are one-time-use, but playing them shortens your lifespan

---

## 5. Protect-the-VIP / Leader-Dependent Design

### The Spectrum
- **Hard loss:** Chess (king = game over), Fire Emblem (lord death = restart)
- **Graceful degradation:** W40K Tyranids (synapse loss = units revert to animal behavior), Halo Covenant (Elite death = Grunts panic), Total War Vampire Counts (general death = army crumbles over turns)

**Graceful degradation > binary loss.** "Your army crumbles over 3 turns" is more interesting than instant disappearance. The player experiences the failure mode.

### Making the VIP Worth Protecting
- VIP must be **powerful enough to use**, not just a liability
- Fire Emblem lords have the best stats + unique weapons — central tension is your strongest piece is the one you can't lose
- Chess king becomes powerful in endgame, rewarding survival

### Preventing Frustration
1. Give the VIP **escape tools** (teleport, pair-up, bodyguard mechanics)
2. Give **multiple critical units** rather than single point of failure
3. Make VIP death a **cascade, not a switch** (crumbling > instant death)
4. Ensure threats to VIP are **readable** — Chess works because you see checkmate coming. Supreme Commander frustrates because stealth units one-shot the ACU.

---

## 6. Expendable Unit Economies

### What Makes Chaff Interesting
- **Different micro skills** — managing a swarm is qualitatively different from managing elites (StarCraft Zerglings: positioning, concaves, flanking angles)
- **Roles that elite units can't fill** — scouting, screening, occupying multiple positions simultaneously. Not just "worse versions of good units."
- **Emotional weight in numbers** — Pikmin are cute, have death animations that evoke guilt. Even expendable units need personality.
- **Positional sacrifice decisions** — Blood Bowl goblins: "deciding to sacrifice linemen by basing key opponents to gain a positional advantage"

### Swarm vs Elite — The Real Differentiators

| Dimension | Swarm | Elite |
|-----------|-------|-------|
| Player attention | Macro (group positioning) | Micro (individual abilities) |
| Loss psychology | Statistical ("lost 12, acceptable") | Personal ("my veteran died") |
| Tactical verb | Surround, flood, screen, absorb | Flank, snipe, duel, hold |
| Counter | AoE damage | Focus fire |

---

## 7. Faction Identity Through Loss Conditions

**How an army falls apart communicates what that army IS more powerfully than how it fights at full strength.**

- **Vampire Counts:** army held together by necromantic will. General dies = crumbling accelerates to disintegrating. Loss condition IS identity.
- **Halo Covenant:** rigid hierarchy. Elite dies = Grunts panic/scatter/suicide-rush. Communicates faction nature through gameplay.
- **Root:** every faction loses differently. Eyrie collapses under its own escalating commitments. Marquise loses by overextending. Woodland Alliance loses by getting bases destroyed before momentum.

### The Dominion vs Covenant Opposition
- Dominion: leader dies = army crumbles. Concentrated defense, bodyguard tactics, "protect the crown."
- Covenant: units die = army gets stronger. Attrition warfare, martyrdom, "the more you kill us the stronger we get."
- **Natural tension:** Dominion wants to assassinate. Covenant benefits from units dying. Each faction's strategy threatens the other's weakness. Each side tries to force a game pace that favors them.

---

## 8. PvE-Specific Balance

### Same Waves For All Factions
- Slay the Spire, FTL, Into the Breach all use shared encounter pools with different character/ship difficulty levels
- **Faction difficulty parity is NOT required for PvE.** Different difficulty per faction is a feature (replayability, mastery), not a bug.
- Only tune per-faction if something is **unfun**, not just hard.

### Transparency = Fairness
- Into the Breach's perfect information is what makes varied squads feel fair against shared enemies
- Enemy transparency lets the player reason about how their faction's tools apply
- **Unfairness comes from hidden information the player cannot react to**

### Soft Counters Over Hard Counters
- In PvE the player can't scout, so hard counters create frustration
- Aim for 55-45 advantage, not 90-10

---

## 9. Building Factions Iteratively — The First Two

### The Anchor-Contrast Model
Multiple sources converge: **start with a "vanilla" baseline faction and a "weird" contrast faction.**

**The anchor should:**
1. Teach the core systems — plays the game "straight"
2. Be the balance baseline — tune enemies against this faction first
3. Use straightforward mechanics — no gimmicks
4. Be viable at all skill levels

**The contrast should:**
1. Violate exactly one assumption of the anchor faction
2. Stress-test whether core systems support diverse strategies
3. Be maximally different from the anchor
4. Reveal interaction seams with enemy AI

**Validate both against the same enemy set before designing faction 3.** If both feel viable (not equally strong) against identical waves, the system is robust enough to expand.

### What the First Two Teach You
- Whether enemy design is faction-agnostic enough
- Whether core systems support diverse strategies
- What your balance levers are
- Where cross-mechanic interactions create problems

**Cole Wehrle (Root):** "I don't worry about balance too much until the end. The key is making sure that, in the process of balancing, you don't remove all of the interesting design elements in the service of fairness."

---

## Sources

Full citations available in individual research transcripts. Key references:
- Into the Breach GDC Postmortem
- Wayward Strategy: Anti-Snowball Design, Hard Counters in RTS, Unit Design
- Game Developer: Darkest Dungeon Affliction System, Reimagining Failure, Asymmetrical Design
- Keith Burgun: Asymmetry in Games, Rushdown/Economy/Defense
- StarCraft II: David Kim balance talks
- Advance Wars AWBW tier lists and CO analysis
- Monster Train clan design analysis
- Root — Cole Wehrle on asymmetric design
- MTG: Mark Rosewater's Twenty Lessons, Phyrexian Mana retrospectives
- XCOM alien design analysis (Chamomile Has A Blog)
