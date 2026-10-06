/**
 * Surface predators that attack foragers and invade exposed tunnels.
 */
class Predator {
  constructor(id, type, x, y) {
    this.id = id;
    this.type = type; // 'SPIDER' or 'BEETLE'
    this.x = x;
    this.y = y;
    this.health = type === 'SPIDER' ? 30 : 60;
    this.maxHealth = this.health;
    this.speed = type === 'SPIDER' ? 2.8 : 1.6;
    this.damage = type === 'SPIDER' ? 8 : 14;
    this.attackCooldown = 0;
    this.path = [];
  }

  update(dt, grid, pathfinder, gameState) {
    this.attackCooldown = Math.max(0, this.attackCooldown - dt);

    // Movement
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
    }

    const cx = Math.round(this.x);
    const cy = Math.round(this.y);

    // Find nearby ant targets
    let nearestAnt = null;
    let minDist = 7.0;

    for (let i = 0; i < gameState.ants.length; i++) {
      const ant = gameState.ants[i];
      const d = Math.hypot(this.x - ant.x, this.y - ant.y);
      if (d < minDist) {
        minDist = d;
        nearestAnt = ant;
      }
    }

    if (nearestAnt) {
      if (minDist <= 1.2) {
        if (this.attackCooldown <= 0) {
          nearestAnt.health -= this.damage;
          this.attackCooldown = 1.0;
        }
      } else if (this.path.length === 0) {
        const path = pathfinder.findPath(cx, cy, Math.round(nearestAnt.x), Math.round(nearestAnt.y));
        if (path.length > 0) this.path = path;
      }
    } else if (this.path.length === 0 && Math.random() < 0.05) {
      // Wander surface
      const sx = cx + Math.floor((Math.random() - 0.5) * 10);
      const sy = CONFIG.GRID.SURFACE_ROW - 1;
      if (grid.isPassable(sx, sy)) {
        this.path = pathfinder.findPath(cx, cy, sx, sy);
      }
    }
  }
}