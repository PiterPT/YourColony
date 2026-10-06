/**
 * Grid-based Breadth-First-Search (BFS) pathfinder.
 */
class Pathfinding {
  constructor(grid) {
    this.grid = grid;
  }

  findPath(startX, startY, goalX, goalY) {
    if (!this.grid.isPassable(goalX, goalY)) return [];
    if (startX === goalX && startY === goalY) return [];

    const queue = [[startX, startY]];
    const visited = new Set();
    const parentMap = new Map();

    const startKey = `${startX},${startY}`;
    visited.add(startKey);

    const dirs = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 }
    ];

    let found = false;

    while (queue.length > 0) {
      const [cx, cy] = queue.shift();

      if (cx === goalX && cy === goalY) {
        found = true;
        break;
      }

      for (let i = 0; i < dirs.length; i++) {
        const nx = cx + dirs[i].x;
        const ny = cy + dirs[i].y;
        const nKey = `${nx},${ny}`;

        if (this.grid.isPassable(nx, ny) && !visited.has(nKey)) {
          visited.add(nKey);
          parentMap.set(nKey, [cx, cy]);
          queue.push([nx, ny]);
        }
      }
    }

    if (!found) return [];

    const path = [];
    let current = `${goalX},${goalY}`;

    while (current !== startKey) {
      const [px, py] = parentMap.get(current);
      const coords = current.split(',').map(Number);
      path.push({ x: coords[0], y: coords[1] });
      current = `${px},${py}`;
    }

    return path.reverse();
  }
}