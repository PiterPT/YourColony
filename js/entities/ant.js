/**
 * Agent simulation representation of a worker/soldier ant.
 */
class Ant {
  constructor(id, caste, x, y) {
    this.id = id;
    this.caste = caste; // WORKER, SOLDIER
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.path = [];
    this.state = 'IDLE';

    this.health = caste === CONFIG.CASTES.SOLDIER ? 45 : 20;
    this.maxHealth = this.health;
    this.energy = 100;
    this.speed = caste === CONFIG.CASTES.SOLDIER ? 3.2 : 2.6; // cells per sec
    this.damage = caste === CONFIG.CASTES.SOLDIER ? 12 : 3;

    this.carryingResource = null;
    this.carryingAmount = 0;
    this.carryCapacity = 5;

    this.targetRef = null;
    this.actionCooldown = 0;
  }

  update(dt, grid, pathfinder, gameState) {
    this.actionCooldown = Math.max(0, this.actionCooldown - dt);

    // Passive energy consumption
    this.energy = Math.max(0, this.energy - dt * 0.4);

    // Health regeneration or starvation
    if (this.energy <= 0) {
      this.health -= dt * 1.5;
    } else if (this.health < this.maxHealth) {
      this.health = Math.min(this.maxHealth, this.health + dt * 0.5);
    }

    if (this.health <= 0) {
      this.state = 'DEAD';
      return;
    }

    // Movement step
    if (this.path.length > 0) {
      const next = this.path[0];
      const dx = next.x - this.x;
      const dy = next.y - this.y;
      const dist = Math.hypot(dx, dy);
      const step = this.speed * dt;

      if (dist <= step) {
        this.x = next.x;
        this.y = next.y;
        this.path.shift();
      } else {
        this.x += (dx / dist) * step;
        this.y += (dy / dist) * step;
      }
      return;
    }

    // Caste-Specific FSM
    if (this.caste === CONFIG.CASTES.WORKER) {
      this.updateWorkerBehavior(dt, grid, pathfinder, gameState);
    } else if (this.caste === CONFIG.CASTES.SOLDIER) {
      this.updateSoldierBehavior(dt, grid, pathfinder, gameState);
    }
  }

  updateWorkerBehavior(dt, grid, pathfinder, gameState) {
    const cx = Math.round(this.x);
    const cy = Math.round(this.y);

    switch (this.state) {
      case 'IDLE': {
        // High priority: If carrying items, deliver them
        if (this.carryingAmount > 0) {
          this.state = 'DELIVERING';
          this.navigateToFoodStorage(cx, cy, grid, pathfinder);
          return;
        }

        // Assess Colony Priorities
        const r = Math.random();
        if (r < 0.45 && gameState.priorities.food > 1) {
          this.state = 'SEARCHING_FOOD';
        } else if (r < 0.8 && gameState.priorities.construction > 1) {
          this.state = 'EXCAVATING';
        } else {
          // Wander nearby or rest
          this.wanderNearby(cx, cy, grid, pathfinder);
        }
        break;
      }

      case 'SEARCHING_FOOD': {
        // Look for surface food node
        const surfaceFood = this.findNearestSurfaceFood(cx, cy, grid);
        if (surfaceFood) {
          const path = pathfinder.findPath(cx, cy, surfaceFood.x, surfaceFood.y);
          if (path.length > 0) {
            this.path = path;
            this.state = 'COLLECTING';
          } else {
            this.state = 'IDLE';
          }
        } else {
          this.state = 'IDLE';
        }
        break;
      }

      case 'COLLECTING': {
        const cell = grid.getCell(cx, cy);
        if (cell && cell.resourceAmount > 0) {
          const bonus = gameState.unlockedEvolutions.has('efficientForaging') ? 2 : 0;
          const gather = Math.min(cell.resourceAmount, this.carryCapacity + bonus);
          cell.resourceAmount -= gather;
          this.carryingResource = 'biomass';
          this.carryingAmount = gather;

          // Lay foraging pheromone trail
          cell.pheromones[CONFIG.PHEROMONES.FORAGING] = Math.min(
            CONFIG.PHEROMONES.MAX_INTENSITY,
            cell.pheromones[CONFIG.PHEROMONES.FORAGING] + 40
          );

          this.state = 'DELIVERING';
          this.navigateToFoodStorage(cx, cy, grid, pathfinder);
        } else {
          this.state = 'IDLE';
        }
        break;
      }

      case 'DELIVERING': {
        const cell = grid.getCell(cx, cy);
        if (cell && (cell.type === CONFIG.CELL_TYPES.FOOD_STORAGE || cell.type === CONFIG.CELL_TYPES.QUEEN_CHAMBER)) {
          if (this.carryingResource === 'biomass') {
            gameState.resources.biomass = Math.min(gameState.resources.maxBiomass, gameState.resources.biomass + this.carryingAmount);
          } else if (this.carryingResource === 'material') {
            gameState.resources.material = Math.min(gameState.resources.maxMaterial, gameState.resources.material + this.carryingAmount);
          }
          this.carryingAmount = 0;
          this.carryingResource = null;
          this.state = 'IDLE';
        } else {
          this.navigateToFoodStorage(cx, cy, grid, pathfinder);
        }
        break;
      }

      case 'EXCAVATING': {
        // Check surrounding cells for marked excavation/dig targets
        const digTarget = this.findNearbyDigTarget(cx, cy, grid);
        if (digTarget) {
          const path = pathfinder.findPath(cx, cy, digTarget.passableX, digTarget.passableY);
          if (path.length > 0) {
            this.path = path;
          }
          if (Math.hypot(cx - digTarget.targetX, cy - digTarget.targetY) <= 1.5) {
            // Perform digging
            const targetCell = grid.getCell(digTarget.targetX, digTarget.targetY);
            if (targetCell && targetCell.type === CONFIG.CELL_TYPES.SOLID_SOIL) {
              targetCell.structuralIntegrity -= 35;
              if (targetCell.structuralIntegrity <= 0) {
                targetCell.type = CONFIG.CELL_TYPES.TUNNEL;
                targetCell.structuralIntegrity = 100;
                gameState.resources.material = Math.min(
                  gameState.resources.maxMaterial,
                  gameState.resources.material + 3
                );
              }
            }
            this.state = 'IDLE';
          }
        } else {
          this.state = 'IDLE';
        }
        break;
      }
    }
  }

  updateSoldierBehavior(dt, grid, pathfinder, gameState) {
    const cx = Math.round(this.x);
    const cy = Math.round(this.y);

    // 1. Check for immediate predators in attack range
    let closestPredator = null;
    let minDist = 8.0;

    for (let i = 0; i < gameState.predators.length; i++) {
      const pred = gameState.predators[i];
      const dist = Math.hypot(this.x - pred.x, this.y - pred.y);
      if (dist < minDist) {
        minDist = dist;
        closestPredator = pred;
      }
    }

    if (closestPredator) {
      if (minDist <= 1.2) {
        // Attack predator
        if (this.actionCooldown <= 0) {
          const dmg = this.damage + (gameState.unlockedEvolutions.has('strongerMandibles') ? 4 : 0);
          closestPredator.health -= dmg;
          this.actionCooldown = 0.8;
          // Emit alarm pheromone on combat
          const cell = grid.getCell(cx, cy);
          if (cell) {
            cell.pheromones[CONFIG.PHEROMONES.ALARM] = CONFIG.PHEROMONES.MAX_INTENSITY;
          }
        }
      } else {
        // Navigate toward predator
        const targetX = Math.round(closestPredator.x);
        const targetY = Math.round(closestPredator.y);
        const path = pathfinder.findPath(cx, cy, targetX, targetY);
        if (path.length > 0) this.path = path;
      }
      return;
    }

    // 2. Respond to alarm pheromone concentrations
    if (this.state !== 'PATROLLING') {
      const alarmTarget = this.findStrongestAlarmPheromone(cx, cy, grid);
      if (alarmTarget) {
        const path = pathfinder.findPath(cx, cy, alarmTarget.x, alarmTarget.y);
        if (path.length > 0) {
          this.path = path;
          return;
        }
      }
    }

    // 3. Default: Patrol Nest Entrance
    if (Math.random() < 0.05 && this.path.length === 0) {
      const patrolX = Math.floor(grid.cols / 2) + Math.floor((Math.random() - 0.5) * 8);
      const patrolY = CONFIG.GRID.SURFACE_ROW;
      const path = pathfinder.findPath(cx, cy, patrolX, patrolY);
      if (path.length > 0) this.path = path;
    }
  }

  navigateToFoodStorage(cx, cy, grid, pathfinder) {
    // Find closest storage or queen chamber
    let target = null;
    let bestDist = Infinity;

    for (let y = CONFIG.GRID.SURFACE_ROW; y < grid.rows; y++) {
      for (let x = 0; x < grid.cols; x++) {
        const cell = grid.getCell(x, y);
        if (cell && (cell.type === CONFIG.CELL_TYPES.FOOD_STORAGE || cell.type === CONFIG.CELL_TYPES.QUEEN_CHAMBER)) {
          const d = Math.hypot(cx - x, cy - y);
          if (d < bestDist) {
            bestDist = d;
            target = { x, y };
          }
        }
      }
    }

    if (target) {
      const path = pathfinder.findPath(cx, cy, target.x, target.y);
      if (path.length > 0) this.path = path;
    }
  }

  findNearestSurfaceFood(cx, cy, grid) {
    let nearest = null;
    let minDist = Infinity;
    for (let x = 0; x < grid.cols; x++) {
      const cell = grid.getCell(x, CONFIG.GRID.SURFACE_ROW - 1);
      if (cell && cell.resourceAmount > 0) {
        const d = Math.hypot(cx - x, cy - (CONFIG.GRID.SURFACE_ROW - 1));
        if (d < minDist) {
          minDist = d;
          nearest = { x, y: CONFIG.GRID.SURFACE_ROW - 1 };
        }
      }
    }
    return nearest;
  }

  findNearbyDigTarget(cx, cy, grid) {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const tx = cx + dx;
        const ty = cy + dy;
        const cell = grid.getCell(tx, ty);
        if (cell && cell.type === CONFIG.CELL_TYPES.SOLID_SOIL && cell.pheromones[CONFIG.PHEROMONES.BUILDING] > 20) {
          return { targetX: tx, targetY: ty, passableX: cx, passableY: cy };
        }
      }
    }
    return null;
  }

  findStrongestAlarmPheromone(cx, cy, grid) {
    let best = null;
    let maxPhero = 25;
    for (let dy = -6; dy <= 6; dy++) {
      for (let dx = -6; dx <= 6; dx++) {
        const cell = grid.getCell(cx + dx, cy + dy);
        if (cell && cell.pheromones[CONFIG.PHEROMONES.ALARM] > maxPhero) {
          maxPhero = cell.pheromones[CONFIG.PHEROMONES.ALARM];
          best = { x: cell.x, y: cell.y };
        }
      }
    }
    return best;
  }

  wanderNearby(cx, cy, grid, pathfinder) {
    const rx = cx + Math.floor((Math.random() - 0.5) * 6);
    const ry = cy + Math.floor((Math.random() - 0.5) * 4);
    if (grid.isPassable(rx, ry)) {
      const path = pathfinder.findPath(cx, cy, rx, ry);
      if (path.length > 0) this.path = path;
    }
  }
}