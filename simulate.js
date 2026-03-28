#!/usr/bin/env node
/**
 * Headless simulation harness for Grid Tactics.
 * Extracts pure game logic from index.html, strips all rendering/DOM/Three.js.
 * Runs thousands of games per second for balance testing and strategy evaluation.
 */

// ============================================================
// CONSTANTS
// ============================================================
const COLS = 8;
const ROWS = 6;

function manhattan(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// ============================================================
// DATA — mirrors index.html exactly
// ============================================================
const FACTION_TEMPLATES = {
  iron: {
    name: 'Iron Vanguard',
    units: [
      { type: 'warcaster', name: 'Warcaster', hp: 10, atk: 3, armor: 1, move: 2, range: 1 },
      { type: 'warjack',   name: 'Warjack',   hp: 12, atk: 5, armor: 2, move: 2, range: 1 },
      { type: 'infantry',  name: 'Infantry',   hp: 6,  atk: 2, armor: 1, move: 3, range: 1 },
      { type: 'infantry',  name: 'Infantry',   hp: 6,  atk: 2, armor: 1, move: 3, range: 1 },
    ],
    startPositions: [{x:0,y:1},{x:1,y:2},{x:0,y:3},{x:1,y:4}],
  },
  storm: {
    name: 'Storm Reavers',
    units: [
      { type: 'stormcaller', name: 'Stormcaller', hp: 7, atk: 3, armor: 0, move: 2, range: 3 },
      { type: 'voltjack',    name: 'Voltjack',    hp: 9, atk: 4, armor: 1, move: 3, range: 2 },
      { type: 'gunner',      name: 'Gunner',      hp: 5, atk: 3, armor: 0, move: 2, range: 3 },
      { type: 'gunner',      name: 'Gunner',      hp: 5, atk: 3, armor: 0, move: 2, range: 3 },
    ],
    startPositions: [{x:0,y:0},{x:1,y:2},{x:0,y:3},{x:1,y:5}],
  }
};

const WAVE_TEMPLATES = [
  {
    label: 'Wave 1',
    enemies: [
      { type: 'grunt', name: 'Grunt', hp: 5, atk: 2, armor: 0, move: 2, range: 1 },
      { type: 'grunt', name: 'Grunt', hp: 5, atk: 2, armor: 0, move: 2, range: 1 },
      { type: 'grunt', name: 'Grunt', hp: 5, atk: 2, armor: 0, move: 2, range: 1 },
    ],
    positions: [{x:6,y:0},{x:7,y:2},{x:6,y:4}]
  },
  {
    label: 'Wave 2',
    enemies: [
      { type: 'grunt',  name: 'Grunt',  hp: 6,  atk: 3, armor: 0, move: 2, range: 1 },
      { type: 'grunt',  name: 'Grunt',  hp: 6,  atk: 3, armor: 0, move: 2, range: 1 },
      { type: 'archer', name: 'Archer', hp: 4,  atk: 3, armor: 0, move: 1, range: 3 },
      { type: 'grunt',  name: 'Grunt',  hp: 6,  atk: 3, armor: 1, move: 2, range: 1 },
    ],
    positions: [{x:6,y:0},{x:7,y:2},{x:7,y:4},{x:6,y:5}]
  },
  {
    label: 'Wave 3',
    enemies: [
      { type: 'grunt',  name: 'Grunt',  hp: 6,  atk: 3, armor: 0, move: 2, range: 1 },
      { type: 'archer', name: 'Archer', hp: 5,  atk: 3, armor: 0, move: 1, range: 3 },
      { type: 'brute',  name: 'Brute',  hp: 14, atk: 5, armor: 2, move: 1, range: 1 },
      { type: 'archer', name: 'Archer', hp: 5,  atk: 3, armor: 0, move: 1, range: 3 },
      { type: 'grunt',  name: 'Grunt',  hp: 6,  atk: 3, armor: 0, move: 2, range: 1 },
    ],
    positions: [{x:6,y:0},{x:7,y:1},{x:7,y:3},{x:7,y:4},{x:6,y:5}]
  }
];

const DRAFT_POOL = [
  { name: '+3 HP to All', apply(s) { for (const u of s.playerUnits) { if (u.hp > 0) { u.maxHp += 3; u.hp = Math.min(u.hp + 3, u.maxHp); } } }},
  { name: '+1 Attack',    apply(s) { for (const u of s.playerUnits) { if (u.hp > 0) u.atk += 1; } }},
  { name: '+1 Armor',     apply(s) { for (const u of s.playerUnits) { if (u.hp > 0) u.armor += 1; } }},
  { name: '+1 Move',      apply(s) { for (const u of s.playerUnits) { if (u.hp > 0) u.move += 1; } }},
  { name: 'Heal All',     apply(s) { for (const u of s.playerUnits) { if (u.hp > 0) u.hp = u.maxHp; } }},
  { name: 'Elite Training', apply(s) {
    const best = aliveUnits(s.playerUnits).sort((a,b) => b.atk - a.atk)[0];
    if (best) { best.atk += 2; best.maxHp += 2; best.hp = Math.min(best.hp + 2, best.maxHp); }
  }},
  { name: 'Fortify', apply(s) {
    const best = aliveUnits(s.playerUnits).sort((a,b) => b.hp - a.hp)[0];
    if (best) best.armor += 2;
  }},
  { name: 'Flanking Drills', apply(s) {
    const best = aliveUnits(s.playerUnits).sort((a,b) => b.move - a.move)[0];
    if (best) { best.range += 1; best.move += 1; }
  }},
];

// ============================================================
// SYNERGY DEFINITIONS — pure functions, no global state
// ============================================================
const SYNERGIES = {
  iron: [
    {
      id: 'shield_wall',
      name: 'Shield Wall',
      check(units) {
        const alive = units.filter(u => u.hp > 0 && u.faction === 'iron');
        for (const u of alive) {
          for (const v of alive) {
            if (u !== v && manhattan(u.pos, v.pos) === 1) return true;
          }
        }
        return false;
      },
      apply(units) {
        const alive = units.filter(u => u.hp > 0 && u.faction === 'iron');
        for (const u of alive) {
          if (alive.some(v => v !== u && manhattan(u.pos, v.pos) === 1)) {
            u.bonusArmor += 2;
          }
        }
      }
    },
    {
      id: 'commanders_aura',
      name: "Commander's Aura",
      check(units) {
        const wc = units.find(u => u.type === 'warcaster' && u.hp > 0);
        if (!wc) return false;
        return units.some(u => u !== wc && u.hp > 0 && u.faction === 'iron' && manhattan(u.pos, wc.pos) <= 2);
      },
      apply(units) {
        const wc = units.find(u => u.type === 'warcaster' && u.hp > 0);
        if (!wc) return;
        for (const u of units) {
          if (u !== wc && u.hp > 0 && u.faction === 'iron' && manhattan(u.pos, wc.pos) <= 2) {
            u.bonusAtk += 1;
          }
        }
      }
    }
  ],
  storm: [
    {
      id: 'firing_line',
      name: 'Firing Line',
      check(units) {
        const rows = {};
        for (const u of units.filter(u => u.hp > 0 && u.faction === 'storm')) {
          rows[u.pos.y] = (rows[u.pos.y] || 0) + 1;
        }
        return Object.values(rows).some(c => c >= 2);
      },
      apply(units) {
        const alive = units.filter(u => u.hp > 0 && u.faction === 'storm');
        const rows = {};
        for (const u of alive) {
          if (!rows[u.pos.y]) rows[u.pos.y] = [];
          rows[u.pos.y].push(u);
        }
        for (const row of Object.values(rows)) {
          if (row.length >= 2) row.forEach(u => u.bonusAtk += 2);
        }
      }
    },
    {
      id: 'static_field',
      name: 'Static Field',
      check(units, enemies) {
        const sc = units.find(u => u.type === 'stormcaller' && u.hp > 0);
        if (!sc) return false;
        return enemies.some(e => e.hp > 0 && manhattan(sc.pos, e.pos) <= 3);
      },
      apply(units, enemies) {
        const sc = units.find(u => u.type === 'stormcaller' && u.hp > 0);
        if (!sc) return;
        if (!enemies.some(e => e.hp > 0 && manhattan(sc.pos, e.pos) <= 3)) return;
        for (const u of units) {
          if (u.hp > 0 && u.faction === 'storm' && u.range >= 2) {
            u.bonusAtk += 1;
          }
        }
      }
    }
  ]
};

// ============================================================
// GAME ENGINE — pure, no DOM, no rendering
// ============================================================

function aliveUnits(units) {
  return units.filter(u => u.hp > 0);
}

function getUnitAt(playerUnits, enemies, x, y, exclude) {
  const all = [...playerUnits, ...enemies];
  return all.find(u => u.hp > 0 && u !== exclude && u.pos.x === x && u.pos.y === y);
}

function createGameState(factionId) {
  const f = FACTION_TEMPLATES[factionId];
  const playerUnits = f.units.map((u, i) => ({
    ...u,
    id: 'p' + i,
    faction: factionId,
    maxHp: u.hp,
    bonusAtk: 0,
    bonusArmor: 0,
    acted: false,
    pos: { ...f.startPositions[i] }
  }));
  return {
    faction: factionId,
    wave: 0,
    turn: 0,
    totalTurns: 0,
    score: 0,
    synergiesActivated: 0,
    cleanKills: 0,
    damageDealt: 0,
    damageTaken: 0,
    playerUnits,
    enemies: [],
    activeSynergies: [],
    enemyIntents: [],
    enemyStrategy: pickEnemyStrategy(),
    gameOver: false,
    won: false,
  };
}

function spawnWave(state, waveIdx) {
  state.wave = waveIdx;
  state.turn = 0;
  const wave = WAVE_TEMPLATES[waveIdx];
  state.enemies = wave.enemies.map((e, i) => ({
    ...e,
    id: 'e' + waveIdx + '_' + i,
    maxHp: e.hp,
    bonusAtk: 0,
    bonusArmor: 0,
    pos: { ...wave.positions[i] }
  }));
}

function calculateSynergies(state) {
  const synergies = SYNERGIES[state.faction];
  state.activeSynergies = [];
  for (const u of state.playerUnits) { u.bonusAtk = 0; u.bonusArmor = 0; }
  for (const syn of synergies) {
    const active = syn.check(state.playerUnits, state.enemies);
    if (active) {
      state.activeSynergies.push(syn.id);
      syn.apply(state.playerUnits, state.enemies);
      state.synergiesActivated++;
    }
  }
}

function getMoveTiles(state, unit) {
  const tiles = [];
  const enemies = aliveUnits(state.enemies);
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      if (x === unit.pos.x && y === unit.pos.y) continue;
      if (manhattan(unit.pos, {x, y}) > unit.move) continue;
      if (getUnitAt(state.playerUnits, state.enemies, x, y)) continue;
      const canAttack = enemies.some(e => manhattan({x, y}, e.pos) <= unit.range);
      tiles.push({x, y, canAttack});
    }
  }
  return tiles;
}

function getAttackTargets(state, unit) {
  return aliveUnits(state.enemies).filter(e => manhattan(unit.pos, e.pos) <= unit.range);
}

function resolveDamage(attacker, defender) {
  const totalAtk = attacker.atk + attacker.bonusAtk;
  const totalArmor = defender.armor + (defender.bonusArmor || 0);
  return Math.max(1, totalAtk - totalArmor);
}

function applyAttack(state, attacker, defender) {
  const dmg = resolveDamage(attacker, defender);
  defender.hp = Math.max(0, defender.hp - dmg);
  state.damageDealt += dmg;
  if (defender.hp <= 0) {
    const hadIntent = state.enemyIntents.find(i => i.unitId === defender.id && i.targetId);
    if (hadIntent) state.cleanKills++;
    state.score += 10;
  }
  return { dmg, killed: defender.hp <= 0 };
}

function applyEnemyAttack(state, attacker, defender) {
  const totalArmor = defender.armor + defender.bonusArmor;
  const dmg = Math.max(1, attacker.atk - totalArmor);
  defender.hp = Math.max(0, defender.hp - dmg);
  state.damageTaken += dmg;
  return { dmg, killed: defender.hp <= 0 };
}

// ============================================================
// ENEMY AI — mirrors index.html exactly
// ============================================================
function stepToward(from, to, steps, self, playerUnits, enemies) {
  let cur = {...from};
  for (let i = 0; i < steps; i++) {
    const dx = Math.sign(to.x - cur.x);
    const dy = Math.sign(to.y - cur.y);
    const candidates = [];
    if (dx !== 0) candidates.push({x: cur.x + dx, y: cur.y});
    if (dy !== 0) candidates.push({x: cur.x, y: cur.y + dy});
    let moved = false;
    for (const c of candidates) {
      if (c.x >= 0 && c.x < COLS && c.y >= 0 && c.y < ROWS &&
          !getUnitAt(playerUnits, enemies, c.x, c.y, self)) {
        cur = c;
        moved = true;
        break;
      }
    }
    if (!moved) break;
  }
  return cur;
}

const ENEMY_STRATEGIES = ['aggressive', 'focusFire', 'preemptive', 'synergyHunter'];

function pickEnemyStrategy() {
  return ENEMY_STRATEGIES[Math.floor(Math.random() * ENEMY_STRATEGIES.length)];
}

function selectEnemyTarget(state, enemy) {
  const targets = aliveUnits(state.playerUnits);
  if (targets.length === 0) return null;

  switch (state.enemyStrategy) {
    case 'focusFire':
      return targets.reduce((best, t) => t.hp < best.hp ? t : best);

    case 'preemptive':
      return targets.reduce((best, t) => {
        const tDmg = t.atk + t.bonusAtk;
        const bDmg = best.atk + best.bonusAtk;
        return tDmg > bDmg ? t : best;
      });

    case 'synergyHunter':
      return targets.reduce((best, t) => {
        const tSyn = (t.bonusAtk > 0 || t.bonusArmor > 0) ? 1 : 0;
        const bSyn = (best.bonusAtk > 0 || best.bonusArmor > 0) ? 1 : 0;
        if (tSyn !== bSyn) return tSyn > bSyn ? t : best;
        return t.hp < best.hp ? t : best;
      });

    case 'aggressive':
    default:
      return targets.reduce((best, t) => {
        const d = manhattan(enemy.pos, t.pos);
        const bestD = manhattan(enemy.pos, best.pos);
        return d < bestD ? t : best;
      });
  }
}

function planEnemyAction(state, enemy) {
  const target = selectEnemyTarget(state, enemy);
  if (!target) return null;

  const dist = manhattan(enemy.pos, target.pos);
  const effectiveRange = enemy.range >= 2 ? enemy.range : 1;

  if (dist <= effectiveRange) {
    const dmg = Math.max(1, enemy.atk - (target.armor + target.bonusArmor));
    return { unitId: enemy.id, type: 'attack', targetId: target.id, targetPos: {...target.pos}, movePos: null, damage: dmg };
  }

  const movePos = stepToward(enemy.pos, target.pos, enemy.move, enemy, state.playerUnits, state.enemies);
  const newDist = manhattan(movePos, target.pos);
  if (newDist <= effectiveRange) {
    const dmg = Math.max(1, enemy.atk - (target.armor + target.bonusArmor));
    return { unitId: enemy.id, type: 'move_attack', movePos, targetId: target.id, targetPos: {...target.pos}, damage: dmg };
  }
  return { unitId: enemy.id, type: 'move', movePos, targetId: null, targetPos: null, damage: 0 };
}

function calculateEnemyIntents(state) {
  state.enemyIntents = [];
  for (const enemy of aliveUnits(state.enemies)) {
    const intent = planEnemyAction(state, enemy);
    if (intent) state.enemyIntents.push(intent);
  }
}

function executeEnemyIntents(state) {
  for (const intent of state.enemyIntents) {
    const enemy = state.enemies.find(e => e.id === intent.unitId);
    if (!enemy || enemy.hp <= 0) continue;

    if (intent.movePos) {
      const blocker = getUnitAt(state.playerUnits, state.enemies, intent.movePos.x, intent.movePos.y);
      if (blocker && blocker !== enemy) {
        const alt = stepToward(enemy.pos, intent.movePos, enemy.move, enemy, state.playerUnits, state.enemies);
        enemy.pos = alt;
      } else {
        enemy.pos = intent.movePos;
      }
    }

    if (intent.targetId) {
      const target = state.playerUnits.find(u => u.id === intent.targetId);
      if (target && target.hp > 0 && manhattan(enemy.pos, target.pos) <= enemy.range) {
        applyEnemyAttack(state, enemy, target);
      }
    }
  }
  state.enemies = aliveUnits(state.enemies);
}

// ============================================================
// PLAYER STRATEGIES
// ============================================================

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Each strategy is a function(state) that plays one full player turn.
 * It must move/attack each unit and mark them as acted.
 */

const STRATEGIES = {
  /** Pick random valid moves, attack if possible. */
  random(state) {
    const units = shuffle([...aliveUnits(state.playerUnits)]);
    for (const unit of units) {
      if (unit.acted || unit.hp <= 0) continue;
      const moves = getMoveTiles(state, unit);
      if (moves.length > 0) {
        const dest = moves[Math.floor(Math.random() * moves.length)];
        unit.pos = { x: dest.x, y: dest.y };
      }
      calculateSynergies(state);
      const targets = getAttackTargets(state, unit);
      if (targets.length > 0) {
        const target = targets[Math.floor(Math.random() * targets.length)];
        applyAttack(state, unit, target);
      }
      unit.acted = true;
    }
  },

  /** Move toward nearest enemy, attack weakest in range. */
  aggressive(state) {
    const units = aliveUnits(state.playerUnits)
      .sort((a, b) => b.atk - a.atk);
    for (const unit of units) {
      if (unit.acted || unit.hp <= 0) continue;
      const enemies = aliveUnits(state.enemies);
      if (enemies.length === 0) { unit.acted = true; continue; }

      const moves = getMoveTiles(state, unit);
      // Prefer tiles that let us attack, then closest to nearest enemy
      let nearest = enemies.reduce((best, e) => {
        const d = manhattan(unit.pos, e.pos);
        return d < best.dist ? { enemy: e, dist: d } : best;
      }, { enemy: null, dist: Infinity }).enemy;

      const attackMoves = moves.filter(m => m.canAttack);
      if (attackMoves.length > 0) {
        // Among attack moves, pick closest to nearest enemy
        attackMoves.sort((a, b) => manhattan(a, nearest.pos) - manhattan(b, nearest.pos));
        unit.pos = { x: attackMoves[0].x, y: attackMoves[0].y };
      } else if (moves.length > 0) {
        // Move toward nearest enemy
        moves.sort((a, b) => manhattan(a, nearest.pos) - manhattan(b, nearest.pos));
        unit.pos = { x: moves[0].x, y: moves[0].y };
      }

      calculateSynergies(state);
      const targets = getAttackTargets(state, unit);
      if (targets.length > 0) {
        // Attack lowest HP enemy
        targets.sort((a, b) => a.hp - b.hp);
        applyAttack(state, unit, targets[0]);
      }
      unit.acted = true;
    }
  },

  /** Focus fire: all units converge on the lowest-HP enemy. */
  focusFire(state) {
    const units = aliveUnits(state.playerUnits)
      .sort((a, b) => b.atk - a.atk);
    for (const unit of units) {
      if (unit.acted || unit.hp <= 0) continue;
      const enemies = aliveUnits(state.enemies);
      if (enemies.length === 0) { unit.acted = true; continue; }

      // Target: lowest HP enemy
      const target = enemies.reduce((best, e) => e.hp < best.hp ? e : best);

      const moves = getMoveTiles(state, unit);
      const attackMoves = moves.filter(m => {
        return manhattan({x: m.x, y: m.y}, target.pos) <= unit.range;
      });

      if (attackMoves.length > 0) {
        unit.pos = { x: attackMoves[0].x, y: attackMoves[0].y };
      } else if (moves.length > 0) {
        moves.sort((a, b) => manhattan(a, target.pos) - manhattan(b, target.pos));
        unit.pos = { x: moves[0].x, y: moves[0].y };
      }

      calculateSynergies(state);
      const targets = getAttackTargets(state, unit);
      if (targets.length > 0) {
        // Prefer the focus target if in range
        const focusable = targets.find(t => t.id === target.id);
        applyAttack(state, unit, focusable || targets[0]);
      }
      unit.acted = true;
    }
  },

  /** Prioritize killing enemies that are about to attack (preemptive). */
  preemptive(state) {
    const units = aliveUnits(state.playerUnits)
      .sort((a, b) => b.atk - a.atk);

    // Enemies that intend to attack, sorted by damage they'd deal
    const threatEnemyIds = new Set(
      state.enemyIntents
        .filter(i => i.targetId)
        .sort((a, b) => b.damage - a.damage)
        .map(i => i.unitId)
    );

    for (const unit of units) {
      if (unit.acted || unit.hp <= 0) continue;
      const enemies = aliveUnits(state.enemies);
      if (enemies.length === 0) { unit.acted = true; continue; }

      // Prioritize threats, then lowest HP
      const prioritized = [...enemies].sort((a, b) => {
        const aT = threatEnemyIds.has(a.id) ? 0 : 1;
        const bT = threatEnemyIds.has(b.id) ? 0 : 1;
        if (aT !== bT) return aT - bT;
        return a.hp - b.hp;
      });
      const primaryTarget = prioritized[0];

      const moves = getMoveTiles(state, unit);
      const attackMoves = moves.filter(m =>
        manhattan({x: m.x, y: m.y}, primaryTarget.pos) <= unit.range
      );

      if (attackMoves.length > 0) {
        unit.pos = { x: attackMoves[0].x, y: attackMoves[0].y };
      } else {
        // Try any move that lets us attack something
        const anyAttack = moves.filter(m => m.canAttack);
        if (anyAttack.length > 0) {
          unit.pos = { x: anyAttack[0].x, y: anyAttack[0].y };
        } else if (moves.length > 0) {
          moves.sort((a, b) => manhattan(a, primaryTarget.pos) - manhattan(b, primaryTarget.pos));
          unit.pos = { x: moves[0].x, y: moves[0].y };
        }
      }

      calculateSynergies(state);
      const targets = getAttackTargets(state, unit);
      if (targets.length > 0) {
        // Prefer threats, then killable, then lowest HP
        const sorted = [...targets].sort((a, b) => {
          const aT = threatEnemyIds.has(a.id) ? 0 : 1;
          const bT = threatEnemyIds.has(b.id) ? 0 : 1;
          if (aT !== bT) return aT - bT;
          const aKill = resolveDamage(unit, a) >= a.hp ? 0 : 1;
          const bKill = resolveDamage(unit, b) >= b.hp ? 0 : 1;
          if (aKill !== bKill) return aKill - bKill;
          return a.hp - b.hp;
        });
        applyAttack(state, unit, sorted[0]);
      }
      unit.acted = true;
    }
  },

  /** Synergy-aware: Iron stays adjacent, Storm stays in rows. */
  synergyFirst(state) {
    const units = aliveUnits(state.playerUnits);
    const enemies = aliveUnits(state.enemies);
    if (enemies.length === 0) {
      units.forEach(u => u.acted = true);
      return;
    }

    // Sort: lower range units first (melee advance, ranged stay back)
    units.sort((a, b) => a.range - b.range);

    for (const unit of units) {
      if (unit.acted || unit.hp <= 0) continue;
      const moves = getMoveTiles(state, unit);
      const liveAllies = aliveUnits(state.playerUnits).filter(u => u !== unit);

      // Score each move
      let bestMove = null;
      let bestScore = -Infinity;

      const candidates = [{x: unit.pos.x, y: unit.pos.y, canAttack: false}, ...moves];
      for (const m of candidates) {
        let score = 0;
        const pos = {x: m.x, y: m.y};
        const canHitEnemy = enemies.some(e => e.hp > 0 && manhattan(pos, e.pos) <= unit.range);
        if (canHitEnemy) score += 100;

        // Synergy bonus
        if (state.faction === 'iron') {
          // Want adjacency
          const adjAllies = liveAllies.filter(a => manhattan(pos, a.pos) === 1).length;
          score += adjAllies * 20;
        } else {
          // Want same row
          const sameRow = liveAllies.filter(a => a.pos.y === pos.y).length;
          score += sameRow * 20;
        }

        // Proximity to nearest enemy (slight preference)
        const nearEnemyDist = enemies.reduce((min, e) => Math.min(min, manhattan(pos, e.pos)), Infinity);
        score -= nearEnemyDist * 2;

        if (score > bestScore) {
          bestScore = score;
          bestMove = pos;
        }
      }

      if (bestMove && (bestMove.x !== unit.pos.x || bestMove.y !== unit.pos.y)) {
        unit.pos = bestMove;
      }

      calculateSynergies(state);
      const targets = getAttackTargets(state, unit);
      if (targets.length > 0) {
        targets.sort((a, b) => a.hp - b.hp);
        applyAttack(state, unit, targets[0]);
      }
      unit.acted = true;
    }
  },
};

// ============================================================
// DRAFT STRATEGY
// ============================================================
function pickDraft(state, options) {
  // Heuristic: prefer attack > HP > armor > heal > move
  const priority = {
    '+1 Attack': 10,
    'Elite Training': 9,
    '+3 HP to All': 7,
    '+1 Armor': 6,
    'Fortify': 5,
    'Heal All': 4,
    'Flanking Drills': 3,
    '+1 Move': 2,
  };
  options.sort((a, b) => (priority[b.name] || 0) - (priority[a.name] || 0));
  return options[0];
}

// ============================================================
// GAME RUNNER
// ============================================================
const MAX_TURNS_PER_WAVE = 30;

function runGame(factionId, strategyName) {
  const strategy = STRATEGIES[strategyName];
  const state = createGameState(factionId);

  for (let waveIdx = 0; waveIdx < WAVE_TEMPLATES.length; waveIdx++) {
    spawnWave(state, waveIdx);

    for (let turn = 0; turn < MAX_TURNS_PER_WAVE; turn++) {
      state.turn++;
      state.totalTurns++;
      state.playerUnits.forEach(u => { u.acted = false; u.bonusAtk = 0; u.bonusArmor = 0; });
      calculateSynergies(state);
      calculateEnemyIntents(state);

      // Player turn
      strategy(state);

      // Remove dead enemies
      state.enemies = aliveUnits(state.enemies);

      // Check player wipe
      if (aliveUnits(state.playerUnits).length === 0) {
        state.gameOver = true;
        state.won = false;
        return computeResult(state);
      }

      // Check wave clear
      if (aliveUnits(state.enemies).length === 0) break;

      // Enemy turn
      executeEnemyIntents(state);
      state.enemies = aliveUnits(state.enemies);

      // Check player wipe after enemy turn
      if (aliveUnits(state.playerUnits).length === 0) {
        state.gameOver = true;
        state.won = false;
        return computeResult(state);
      }

      // Check wave clear after enemy turn (enemies may have died from... well, shouldn't happen, but safety)
      if (aliveUnits(state.enemies).length === 0) break;
    }

    // Wave cleared
    state.score += 50;

    // Draft upgrade between waves (except after final wave)
    if (waveIdx < WAVE_TEMPLATES.length - 1) {
      const options = shuffle([...DRAFT_POOL]).slice(0, 3);
      const pick = pickDraft(state, options);
      pick.apply(state);
      state.score += 5;
    }
  }

  state.gameOver = true;
  state.won = true;
  return computeResult(state);
}

function computeResult(state) {
  const hpBonus = state.playerUnits.reduce((s, u) => s + Math.max(0, u.hp), 0) * 5;
  const efficiencyBonus = Math.max(0, 20 - state.totalTurns) * 10;
  const synergyBonus = state.synergiesActivated * 8;
  const killBonus = state.cleanKills * 15;
  const totalScore = state.score + hpBonus + efficiencyBonus + synergyBonus + killBonus;

  return {
    won: state.won,
    score: totalScore,
    enemyStrategy: state.enemyStrategy,
    wavesCleared: state.won ? WAVE_TEMPLATES.length : state.wave,
    totalTurns: state.totalTurns,
    damageDealt: state.damageDealt,
    damageTaken: state.damageTaken,
    cleanKills: state.cleanKills,
    synergiesActivated: state.synergiesActivated,
    survivingUnits: aliveUnits(state.playerUnits).length,
    survivingHp: state.playerUnits.reduce((s, u) => s + Math.max(0, u.hp), 0),
    breakdown: {
      base: state.score,
      hp: hpBonus,
      efficiency: efficiencyBonus,
      synergy: synergyBonus,
      kills: killBonus,
    }
  };
}

// ============================================================
// BATCH SIMULATION
// ============================================================
function runBatch(numGames, factionId, strategyName) {
  const results = [];
  for (let i = 0; i < numGames; i++) {
    results.push(runGame(factionId, strategyName));
  }
  return results;
}

function summarize(results, label) {
  const n = results.length;
  const wins = results.filter(r => r.won).length;
  const scores = results.map(r => r.score);
  const avgScore = scores.reduce((a, b) => a + b, 0) / n;
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const avgTurns = results.reduce((s, r) => s + r.totalTurns, 0) / n;
  const avgDmgDealt = results.reduce((s, r) => s + r.damageDealt, 0) / n;
  const avgDmgTaken = results.reduce((s, r) => s + r.damageTaken, 0) / n;
  const avgSurvivors = results.reduce((s, r) => s + r.survivingUnits, 0) / n;
  const avgSurvHp = results.reduce((s, r) => s + r.survivingHp, 0) / n;
  const avgSynergies = results.reduce((s, r) => s + r.synergiesActivated, 0) / n;
  const avgCleanKills = results.reduce((s, r) => s + r.cleanKills, 0) / n;

  // Wave reached distribution
  const waveDist = {};
  for (const r of results) {
    const key = r.won ? 'Won' : `Died W${r.wavesCleared + 1}`;
    waveDist[key] = (waveDist[key] || 0) + 1;
  }

  // Win rate by enemy strategy
  const byEnemyStrat = {};
  for (const r of results) {
    if (!byEnemyStrat[r.enemyStrategy]) byEnemyStrat[r.enemyStrategy] = { wins: 0, total: 0 };
    byEnemyStrat[r.enemyStrategy].total++;
    if (r.won) byEnemyStrat[r.enemyStrategy].wins++;
  }

  return {
    label,
    games: n,
    winRate: (wins / n * 100).toFixed(1) + '%',
    avgScore: avgScore.toFixed(1),
    minScore,
    maxScore,
    avgTurns: avgTurns.toFixed(1),
    avgDmgDealt: avgDmgDealt.toFixed(1),
    avgDmgTaken: avgDmgTaken.toFixed(1),
    avgSurvivors: avgSurvivors.toFixed(2),
    avgSurvHp: avgSurvHp.toFixed(1),
    avgSynergies: avgSynergies.toFixed(1),
    avgCleanKills: avgCleanKills.toFixed(1),
    waveDist,
    byEnemyStrat,
  };
}

function printSummary(s) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  ${s.label}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`  Games:          ${s.games}`);
  console.log(`  Win Rate:       ${s.winRate}`);
  console.log(`  Avg Score:      ${s.avgScore}  (min: ${s.minScore}, max: ${s.maxScore})`);
  console.log(`  Avg Turns:      ${s.avgTurns}`);
  console.log(`  Avg Dmg Dealt:  ${s.avgDmgDealt}`);
  console.log(`  Avg Dmg Taken:  ${s.avgDmgTaken}`);
  console.log(`  Avg Survivors:  ${s.avgSurvivors} units, ${s.avgSurvHp} HP`);
  console.log(`  Avg Synergies:  ${s.avgSynergies}`);
  console.log(`  Avg Clean Kills:${s.avgCleanKills}`);
  console.log(`  Wave Outcomes:  ${Object.entries(s.waveDist).map(([k,v]) => `${k}: ${v}`).join(', ')}`);
  console.log(`  vs Enemy AI:    ${Object.entries(s.byEnemyStrat).map(([k,v]) => `${k}: ${((v.wins/v.total)*100).toFixed(0)}% of ${v.total}`).join(', ')}`);
}

// ============================================================
// MAIN
// ============================================================
function main() {
  const args = process.argv.slice(2);
  const numGames = parseInt(args[0]) || 1000;
  const faction = args[1] || 'all';
  const strategy = args[2] || 'all';

  const factions = faction === 'all' ? ['iron', 'storm'] : [faction];
  const DEFAULT_STRATEGIES = ['aggressive', 'focusFire', 'preemptive', 'synergyFirst'];
  const strategies = strategy === 'all' ? DEFAULT_STRATEGIES : [strategy];

  console.log(`\nGrid Tactics Simulator`);
  console.log(`Running ${numGames} games per configuration...`);

  const allSummaries = [];
  const startTime = performance.now();

  for (const f of factions) {
    for (const s of strategies) {
      const t0 = performance.now();
      const results = runBatch(numGames, f, s);
      const elapsed = performance.now() - t0;
      const label = `${FACTION_TEMPLATES[f].name} / ${s}  (${elapsed.toFixed(0)}ms)`;
      const summary = summarize(results, label);
      allSummaries.push(summary);
      printSummary(summary);
    }
  }

  const totalElapsed = performance.now() - startTime;
  const totalGames = factions.length * strategies.length * numGames;
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`  Total: ${totalGames} games in ${totalElapsed.toFixed(0)}ms (${(totalGames / totalElapsed * 1000).toFixed(0)} games/sec)`);
  console.log(`${'─'.repeat(60)}`);

  // Comparison table
  if (allSummaries.length > 1) {
    console.log('\n  COMPARISON TABLE');
    console.log('  ' + '-'.repeat(78));
    console.log('  ' + 'Configuration'.padEnd(38) + 'Win%'.padStart(8) + 'Score'.padStart(8) + 'Turns'.padStart(8) + 'Surv'.padStart(8) + 'Syn'.padStart(8));
    console.log('  ' + '-'.repeat(78));
    for (const s of allSummaries) {
      const name = s.label.split('  (')[0];
      console.log('  ' + name.padEnd(38) + s.winRate.padStart(8) + s.avgScore.padStart(8) + s.avgTurns.padStart(8) + s.avgSurvivors.padStart(8) + s.avgSynergies.padStart(8));
    }
    console.log('  ' + '-'.repeat(78));
  }
}

main();
