# Faction Ideas — Draft v1

Status: **Ideas / exploration** — not committed designs.

Stargate-inspired but legally distinct sci-fi tactical factions for Grid Tactics.

---

## 1. VANGUARD COALITION (Humans)

**Identity:** Elite military squads. Underdogs who get stronger by scavenging from what they kill.

**Core Mechanic: Field Salvage**
When a Vanguard unit kills an enemy, the killer gains a permanent Salvage token. Each token gives +1 to a stat (cycles: first kill → +1 ATK, second → +1 Armor, third → +1 Range, etc.). Tokens persist across the wave but reset between waves (draft upgrades represent the "real" tech adoption).

**Roster (6 units):**

| Unit | Role | HP | ATK | Armor | Move | Range | Cost | Notes |
|------|------|-----|-----|-------|------|-------|------|-------|
| Commander | Leader | 9 | 3 | 1 | 2 | 1 | 30 | Adjacent allies gain +1 ATK |
| Rifleman | Core infantry | 6 | 3 | 0 | 2 | 2 | 20 | Balanced ranged workhorse |
| Medic | Support | 5 | 1 | 0 | 3 | 1 | 20 | Instead of attacking, heals adjacent ally for 3 HP |
| Engineer | Utility | 6 | 2 | 1 | 2 | 1 | 25 | Salvage tokens give +2 instead of +1 |
| Sniper | Glass cannon | 4 | 4 | 0 | 1 | 4 | 30 | Highest range in game, fragile |
| Shock Trooper | Heavy | 8 | 4 | 2 | 1 | 1 | 35 | Slow melee bruiser |

**Synergies:**
- **Coordinated Fire:** 2+ Vanguard units in range of the same enemy → +1 damage vs that enemy
- **Tactical Flexibility:** No two Vanguard units in same row AND same column → all gain +1 Move

---

## 2. THE CONVERGENCE (Replicators)

**Identity:** Nanite swarm that builds momentum through board control.

**Core Mechanic: Proliferate**
At the end of each enemy turn, every Convergence unit that has no adjacent enemies spawns a Drone (1 HP, 1 ATK, 0 Armor, 2 Move, 1 Range) in a random adjacent empty tile. Time-based, not kill-based — rewards safe positioning.

**Balance levers:**
- Drones are disposable (1 HP)
- Units only spawn if NO adjacent enemies — aggression shuts down growth
- Cap at ~8 total units on board
- Drones don't proliferate themselves

**Roster (5 units):**

| Unit | Role | HP | ATK | Armor | Move | Range | Cost | Notes |
|------|------|-----|-----|-------|------|-------|------|-------|
| Nexus Core | Leader | 8 | 2 | 1 | 1 | 2 | 30 | Spawns 2 drones instead of 1; drones within 2 get +1 ATK |
| Assembler | Spawner | 7 | 2 | 1 | 2 | 1 | 25 | Standard proliferator |
| Reaver | Assault | 6 | 4 | 0 | 3 | 1 | 25 | Fast melee, does NOT proliferate |
| Sentinel | Tank | 10 | 1 | 2 | 1 | 1 | 30 | Proliferates; area denial |
| Adapter | Hybrid | 5 | 3 | 0 | 2 | 2 | 25 | Ranged; gains +1 to stat of last enemy it damaged |

**Synergies:**
- **Swarm Density:** 3+ Convergence units (incl drones) adjacent → all gain +1 Armor
- **Networked Targeting:** Each drone adjacent to an enemy reduces that enemy's Armor by 1 (min 0)

---

## 3. THE REMNANT (Advanced Civilization)

**Identity:** Dying gods. Staggering power that erodes every turn.

**Core Mechanic: Decay**
Every Remnant unit has a Decay counter (starts 0, +1 each player turn). Per 2 Decay, unit loses 1 from highest stat (ATK → Armor → Move, never below 1).

**Overdrive:** Any unit can gain +3 ATK for one attack but immediately gains +2 Decay.

**Roster (4 units — small, expensive):**

| Unit | Role | HP | ATK | Armor | Move | Range | Cost | Notes |
|------|------|-----|-----|-------|------|-------|------|-------|
| Archon | Leader | 10 | 4 | 2 | 2 | 2 | 40 | Reduces Decay by 1 for adjacent allies at turn start |
| Sentinel Prime | Tank | 14 | 3 | 3 | 1 | 1 | 35 | Highest starting armor |
| Phase Walker | Assassin | 7 | 5 | 0 | 3 | 1 | 30 | Can move through enemy units |
| Artificer | Support | 6 | 3 | 1 | 2 | 3 | 30 | Overdrive heals allies within 2 for 4 HP instead of +3 ATK |

**Synergies:**
- **Temporal Stasis:** Archon alive + any unit Decay ≤ 2 → all gain +1 to all stats
- **Dying Light:** Any unit with Decay ≥ 4 → attacks deal splash (1 dmg to adjacent enemies)

---

## 4. THE DOMINION (Parasites)

**Identity:** God-tyrant with disposable thralls. Protect-the-VIP gameplay.

**Core Mechanic: Sovereign**
Sovereign grants Command Aura (units within 3 gain +1 ATK, +1 Armor). On Sovereign death, all units permanently lose -2 ATK.

**Absorb:** When Sovereign would take lethal damage, destroy an adjacent friendly unit instead, heal Sovereign for that unit's current HP. Once per turn.

**Roster (6 units):**

| Unit | Role | HP | ATK | Armor | Move | Range | Cost | Notes |
|------|------|-----|-----|-------|------|-------|------|-------|
| Sovereign | Leader | 12 | 4 | 2 | 2 | 2 | 40 | Command Aura + Absorb |
| Thrall | Expendable | 5 | 2 | 0 | 2 | 1 | 10 | Cheapest unit; Absorb fodder |
| Zealot Guard | Bodyguard | 8 | 2 | 2 | 2 | 1 | 20 | Adjacent to Sovereign: takes 50% of Sovereign's damage |
| Lash | Skirmisher | 5 | 3 | 0 | 3 | 2 | 20 | Fast ranged harasser |
| Taskmaster | Mid-range | 7 | 3 | 1 | 2 | 1 | 25 | Adjacent thralls gain +1 ATK |
| Vessel | Heavy | 9 | 4 | 1 | 1 | 1 | 25 | On death, spawns 1 Thrall |

**Synergies:**
- **Overwhelming Presence:** Sovereign alive + 3+ other units → Sovereign +1 ATK, +1 Armor
- **Blood Tithe:** When a Dominion unit dies (not Absorbed), Sovereign gains +1 ATK for wave

---

## 5. COVENANT OF FLAME (Zealots)

**Identity:** Fanatics who turn death into power.

**Core Mechanic: Martyrdom**
When any Covenant unit dies, all survivors gain +1 Fervor (permanent per wave). Each Fervor = +1 ATK.

**Immolate:** A unit can die immediately, deal its ATK as damage to all adjacent enemies, grant +2 Fervor instead of +1.

**Roster (6 units):**

| Unit | Role | HP | ATK | Armor | Move | Range | Cost | Notes |
|------|------|-----|-----|-------|------|-------|------|-------|
| Herald | Leader | 9 | 3 | 1 | 2 | 2 | 30 | Gains +2 Fervor per death instead of +1 |
| Martyr | Sacrifice | 6 | 2 | 0 | 2 | 1 | 10 | Immolate deals ATK+2 damage |
| Branded | Core melee | 7 | 3 | 1 | 2 | 1 | 20 | Solid fighter, scales with Fervor |
| Pyre Knight | Heavy | 10 | 3 | 2 | 1 | 1 | 30 | +1 Armor per 2 Fervor (max +2) |
| Ash Speaker | Ranged | 5 | 3 | 0 | 2 | 3 | 25 | Immolate hits range 2 instead of adjacent |
| Ember Wraith | Mobile | 5 | 2 | 0 | 3 | 1 | 20 | On death (not Immolate), deals 2 dmg to all adjacent |

**Synergies:**
- **Funeral Pyre:** 2+ Fervor → all Covenant units gain +1 Move
- **Unbroken Chain:** 3+ Covenant units alive → +1 Armor to all

---

## Cross-Faction Dynamics (Noted)

- Convergence drones dying feeds Covenant Fervor — natural swarm check
- Remnant wants short fights (decay), Convergence wants long fights (spawning) — natural tension
- Dominion Sovereign Absorb vs Covenant Immolate create interesting counter-play
- Vanguard Salvage rewards careful kill-targeting; Convergence floods with low-value kills
