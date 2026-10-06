/**
 * Pheromone decay, diffusion and painting logic.
 */
class PheromoneSystem {
  static update(dt, grid, gameState) {
    const mult = gameState.unlockedEvolutions.has('improvedPheromones')
      ? CONFIG.PHEROMONES.DECAY_RATE * 0.5
      : CONFIG.PHEROMONES.DECAY_RATE;

    const decay = mult * dt * 25;

    for (let i = 0; i < grid.cells.length; i++) {
      const cell = grid.cells[i];
      for (let p = 0; p < 3; p++) {
        if (cell.pheromones[p] > 0) {
          cell.pheromones[p] = Math.max(0, cell.pheromones[p] - decay);
        }
      }
    }
  }

  static applyPheromone(grid, cellX, cellY, pheroType, amount = 40) {
    const cell = grid.getCell(cellX, cellY);
    if (!cell) return;
    cell.pheromones[pheroType] = Math.min(
      CONFIG.PHEROMONES.MAX_INTENSITY,
      cell.pheromones[pheroType] + amount
    );
  }

  static clearPheromones(grid, cellX, cellY) {
    const cell = grid.getCell(cellX, cellY);
    if (cell) cell.pheromones = [0, 0, 0];
  }
}