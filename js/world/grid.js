/**
 * 2D Cell grid containing terrain, moisture and pheromones.
 */
class CellGrid {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.cells = new Array(cols * rows);
    this.init();
  }

  init() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const index = y * this.cols + x;
        this.cells[index] = {
          x,
          y,
          type: CONFIG.CELL_TYPES.SOLID_SOIL,
          humidity: 45.0,
          temperature: 20.0,
          structuralIntegrity: 100,
          resourceAmount: 0,
          pheromones: [0, 0, 0] // FORAGING, ALARM, BUILDING
        };
      }
    }
  }

  index(x, y) {
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return -1;
    return y * this.cols + x;
  }

  getCell(x, y) {
    const idx = this.index(x, y);
    return idx !== -1 ? this.cells[idx] : null;
  }

  setCellType(x, y, type) {
    const cell = this.getCell(x, y);
    if (!cell) return false;
    cell.type = type;
    return true;
  }

  isPassable(x, y) {
    const cell = this.getCell(x, y);
    if (!cell) return false;
    return cell.type !== CONFIG.CELL_TYPES.SOLID_SOIL &&
           cell.type !== CONFIG.CELL_TYPES.BLOCKED;
  }
}