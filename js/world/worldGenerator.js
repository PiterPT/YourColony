/**
 * Procedural world setup initializing the nest, resources and chambers.
 */
class WorldGenerator {
  static generate(grid, gameState) {
    const surfaceRow = CONFIG.GRID.SURFACE_ROW;

    // 1. Fill ground / surface
    for (let y = 0; y < grid.rows; y++) {
      for (let x = 0; x < grid.cols; x++) {
        const cell = grid.getCell(x, y);
        if (y < surfaceRow) {
          cell.type = CONFIG.CELL_TYPES.EMPTY;
        } else {
          cell.type = CONFIG.CELL_TYPES.SOLID_SOIL;
          // Subterranean granite stones
          if (Math.random() < 0.05 && y > surfaceRow + 4) {
            cell.type = CONFIG.CELL_TYPES.BLOCKED;
          }
        }
      }
    }

    // 2. Initial vertical shaft entrance
    const entranceX = Math.floor(grid.cols / 2);
    for (let y = surfaceRow; y <= surfaceRow + 8; y++) {
      grid.setCellType(entranceX, y, CONFIG.CELL_TYPES.TUNNEL);
    }

    // 3. Queen Chamber
    const qy = surfaceRow + 8;
    for (let ox = -2; ox <= 2; ox++) {
      for (let oy = -1; oy <= 1; oy++) {
        grid.setCellType(entranceX + ox, qy + oy, CONFIG.CELL_TYPES.QUEEN_CHAMBER);
      }
    }

    // 4. Initial Food Storage Chamber
    for (let ox = -5; ox <= -3; ox++) {
      grid.setCellType(entranceX + ox, qy, CONFIG.CELL_TYPES.FOOD_STORAGE);
    }
    // Connect storage to queen chamber
    grid.setCellType(entranceX - 3, qy, CONFIG.CELL_TYPES.TUNNEL);

    // 5. Initial surface food nodes
    for (let i = 0; i < 5; i++) {
      const fx = Math.floor(Math.random() * (grid.cols - 10)) + 5;
      const fCell = grid.getCell(fx, surfaceRow - 1);
      if (fCell) {
        fCell.resourceAmount = 80; // Biomass / seeds
      }
    }

    // 6. Spawn Queen
    gameState.queen = new Queen(entranceX, qy);

    // 7. Initial Starting Workers
    for (let i = 0; i < 6; i++) {
      const worker = new Ant(i + 1, CONFIG.CASTES.WORKER, entranceX, qy);
      gameState.ants.push(worker);
    }

    // 8. Initial Starting Soldier
    const soldier = new Ant(7, CONFIG.CASTES.SOLDIER, entranceX, qy);
    gameState.ants.push(soldier);
  }
}