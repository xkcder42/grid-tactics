/**
 * Faction definitions — roster, synergies, and starting positions.
 * Synergy check/apply functions receive (units, ctx) where ctx provides
 * game state accessors (enemies, playerUnits, manhattan) so factions stay
 * decoupled from the game engine.
 */

export const FACTIONS = {
  vanguard: {
    name: 'Vanguard Coalition',
    color: '#4a9eff',
    desc: 'Elite military squads who grow stronger by scavenging from what they kill. Coordinate fire, hold formation, and adapt to the battlefield.',
    playstyle: 'Salvage / Combined Arms / Adaptable',
    roster: [
      { type: 'commander',    name: 'Commander',    icon: '\u2694', hp: 9, atk: 3, armor: 1, move: 2, range: 1, cost: 28, isLeader: true,  desc: 'Adjacent allies gain +1 ATK. Field Salvage leader.' },
      { type: 'rifleman',     name: 'Rifleman',     icon: '\u2720', hp: 6, atk: 3, armor: 0, move: 2, range: 2, cost: 18, isLeader: false, desc: 'Balanced ranged workhorse' },
      { type: 'shock_trooper',name: 'Shock Trooper',icon: '\u2699', hp: 8, atk: 4, armor: 2, move: 1, range: 1, cost: 26, isLeader: false, desc: 'Slow melee bruiser, heavy armor' },
      { type: 'sniper',       name: 'Sniper',       icon: '\u25CE', hp: 4, atk: 4, armor: 0, move: 1, range: 4, cost: 24, isLeader: false, desc: 'Longest range in game, fragile' },
      { type: 'medic',        name: 'Medic',        icon: '\u271A', hp: 5, atk: 1, armor: 0, move: 3, range: 1, cost: 18, isLeader: false, desc: 'Heals adjacent allies at turn start' },
      { type: 'engineer',     name: 'Engineer',     icon: '\u2692', hp: 6, atk: 2, armor: 1, move: 2, range: 1, cost: 22, isLeader: false, desc: 'Salvage tokens give +2 instead of +1' },
      { type: 'scout',        name: 'Scout',        icon: '\u25C8', hp: 3, atk: 1, armor: 0, move: 4, range: 1, cost: 10, isLeader: false, desc: 'Cheapest unit, high mobility' },
    ],
    synergies: [
      {
        id: 'coordinated_fire',
        name: 'Coordinated Fire',
        desc: '2+ Vanguard units in range of same enemy: +1 ATK to those units',
        check(units, ctx) {
          const alive = units.filter(u => u.hp > 0 && u.faction === 'vanguard');
          for (const e of ctx.enemies()) {
            if (e.hp <= 0) continue;
            const inRange = alive.filter(u => ctx.manhattan(u.pos, e.pos) <= u.range);
            if (inRange.length >= 2) return true;
          }
          return false;
        },
        apply(units, ctx) {
          const alive = units.filter(u => u.hp > 0 && u.faction === 'vanguard');
          const boosted = new Set();
          for (const e of ctx.enemies()) {
            if (e.hp <= 0) continue;
            const inRange = alive.filter(u => ctx.manhattan(u.pos, e.pos) <= u.range);
            if (inRange.length >= 2) {
              inRange.forEach(u => boosted.add(u));
            }
          }
          for (const u of boosted) {
            u.bonusAtk += 1;
          }
        }
      },
      {
        id: 'tactical_flexibility',
        name: 'Tactical Flexibility',
        desc: '+1 Move when no two Vanguard units share a row or column',
        check(units, ctx) {
          const alive = units.filter(u => u.hp > 0 && u.faction === 'vanguard');
          if (alive.length < 2) return false;
          for (let i = 0; i < alive.length; i++) {
            for (let j = i + 1; j < alive.length; j++) {
              if (alive[i].pos.x === alive[j].pos.x) return false;
              if (alive[i].pos.y === alive[j].pos.y) return false;
            }
          }
          return true;
        },
        apply(units, ctx) {
          const alive = units.filter(u => u.hp > 0 && u.faction === 'vanguard');
          if (alive.length < 2) return;
          for (let i = 0; i < alive.length; i++) {
            for (let j = i + 1; j < alive.length; j++) {
              if (alive[i].pos.x === alive[j].pos.x) return;
              if (alive[i].pos.y === alive[j].pos.y) return;
            }
          }
          alive.forEach(u => u.bonusMove += 1);
        }
      }
    ],
    coreList: ['commander', 'rifleman', 'shock_trooper', 'medic', 'scout'],
    startPositions: [{x:0,y:0},{x:0,y:1},{x:1,y:2},{x:0,y:3},{x:1,y:4}]
  },
  convergence: {
    name: 'The Convergence',
    color: '#56d4c0',
    desc: 'Nanite swarm that builds momentum through board control. Position safely, spawn drones, and overwhelm with networked precision.',
    playstyle: 'Swarm / Growth / Board Control',
    roster: [
      { type: 'nexus_core', name: 'Nexus Core', icon: '\u2B21', hp: 8,  atk: 2, armor: 1, move: 1, range: 2, cost: 30, isLeader: true,  canProliferate: true,  proliferateCount: 2, desc: 'Spawns 2 drones; drones within 2 gain +1 ATK' },
      { type: 'assembler',  name: 'Assembler',  icon: '\u2699', hp: 7,  atk: 2, armor: 1, move: 2, range: 1, cost: 20, isLeader: false, canProliferate: true,  proliferateCount: 1, desc: 'Standard proliferator' },
      { type: 'sentinel',   name: 'Sentinel',   icon: '\u2B22', hp: 10, atk: 1, armor: 2, move: 1, range: 1, cost: 28, isLeader: false, canProliferate: true,  proliferateCount: 1, desc: 'Heavy tank, area denial' },
      { type: 'reaver',     name: 'Reaver',     icon: '\u2726', hp: 6,  atk: 4, armor: 0, move: 3, range: 1, cost: 22, isLeader: false, canProliferate: false, proliferateCount: 0, desc: 'Fast melee, does NOT proliferate' },
      { type: 'adapter',    name: 'Adapter',    icon: '\u2727', hp: 5,  atk: 3, armor: 0, move: 2, range: 2, cost: 24, isLeader: false, canProliferate: false, proliferateCount: 0, desc: 'Ranged; gains +1 to stat of last enemy it damaged' },
      { type: 'reclaimer',  name: 'Reclaimer',  icon: '\u267B', hp: 6,  atk: 1, armor: 0, move: 2, range: 1, cost: 18, isLeader: false, canProliferate: false, proliferateCount: 0, desc: 'Consumes adjacent drone at turn start, heals 3 HP' },
    ],
    synergies: [
      {
        id: 'swarm_density',
        name: 'Swarm Density',
        desc: '3+ adjacent Convergence units (incl drones): +1 Armor',
        check(units, ctx) {
          const alive = units.filter(u => u.hp > 0 && u.faction === 'convergence');
          for (const u of alive) {
            const adjCount = alive.filter(v => v !== u && ctx.manhattan(u.pos, v.pos) === 1).length;
            if (adjCount >= 2) return true;
          }
          return false;
        },
        apply(units, ctx) {
          const alive = units.filter(u => u.hp > 0 && u.faction === 'convergence');
          const boosted = new Set();
          for (const u of alive) {
            const adjAllies = alive.filter(v => v !== u && ctx.manhattan(u.pos, v.pos) === 1);
            if (adjAllies.length >= 2) {
              boosted.add(u);
              adjAllies.forEach(v => boosted.add(v));
            }
          }
          for (const u of boosted) {
            u.bonusArmor += 1;
          }
        }
      },
      {
        id: 'collective_processing',
        name: 'Collective Processing',
        desc: 'Nexus Core alive + 3+ drones on board: non-drone units gain +1 ATK',
        check(units, ctx) {
          const nexus = units.find(u => u.type === 'nexus_core' && u.hp > 0);
          if (!nexus) return false;
          const droneCount = units.filter(u => u.hp > 0 && u.isDrone).length;
          return droneCount >= 3;
        },
        apply(units, ctx) {
          const nexus = units.find(u => u.type === 'nexus_core' && u.hp > 0);
          if (!nexus) return;
          const droneCount = units.filter(u => u.hp > 0 && u.isDrone).length;
          if (droneCount < 3) return;
          for (const u of units) {
            if (u.hp > 0 && u.faction === 'convergence' && !u.isDrone) {
              u.bonusAtk += 1;
            }
          }
        }
      }
    ],
    coreList: ['nexus_core', 'sentinel', 'adapter', 'reclaimer'],
    startPositions: [{x:0,y:0},{x:0,y:1},{x:1,y:2},{x:0,y:3},{x:1,y:4}]
  }
};
