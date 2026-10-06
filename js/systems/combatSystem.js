/**
 * Spawns predators, clears dead entities and monitors colony boundaries.
 */
class CombatSystem {
  static init() {
    this.spawnTimer = 0;
  }

  static update(dt, gameState, grid, pathfinder) {
    this.spawnTimer += dt;

    // Periodic surface predator spawn (approx. every 45-60 seconds)
    if (this.spawnTimer >= 50) {
      this.spawnTimer = 0;
      const type = Math.random() < 0.5 ? 'SPIDER' : 'BEETLE';
      const spawnX = Math.random() < 0.5 ? 2 : grid.cols - 3;
      const spawnY = CONFIG.GRID.SURFACE_ROW - 1;
      const predator = new Predator(Date.now(), type, spawnX, spawnY);
      gameState.predators.push(predator);
      GlobalEvents.emit('notification', `Alerta! Um predador (${type}) surgiu à superfície!`);
    }

    // Update Predators
    for (let i = 0; i < gameState.predators.length; i++) {
      gameState.predators[i].update(dt, grid, pathfinder, gameState);
    }

    // Filter dead entities
    gameState.predators = gameState.predators.filter(p => {
      if (p.health <= 0) {
        // Drop biomass on death
        const cell = grid.getCell(Math.round(p.x), Math.round(p.y));
        if (cell) cell.resourceAmount += 25;
        GlobalEvents.emit('notification', 'Predador eliminado! Biomassa deixada no terreno.');
        return false;
      }
      return true;
    });

    gameState.ants = gameState.ants.filter(ant => ant.health > 0);
  }
}
CombatSystem.init();