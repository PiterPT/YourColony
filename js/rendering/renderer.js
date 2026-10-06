/**
 * High-performance procedural Canvas 2D renderer.
 */
class Renderer {
  constructor(canvas, grid, camera) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.grid = grid;
    this.camera = camera;
  }

  render(gameState) {
    const ctx = this.ctx;
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    ctx.clearRect(0, 0, cw, ch);

    ctx.save();
    // Center camera transform
    ctx.translate(cw / 2, ch / 2);
    ctx.scale(this.camera.zoom, this.camera.zoom);
    ctx.translate(-this.camera.x, -this.camera.y);

    this.renderSkyAndWeather(ctx, gameState);
    this.renderGrid(ctx);
    this.renderBrood(ctx, gameState.brood);
    this.renderAnts(ctx, gameState.ants, gameState.queen);
    this.renderPredators(ctx, gameState.predators);

    ctx.restore();
  }

  renderSkyAndWeather(ctx, gameState) {
    const surfaceY = CONFIG.GRID.SURFACE_ROW * CONFIG.GRID.CELL_SIZE;
    const worldW = this.grid.cols * CONFIG.GRID.CELL_SIZE;

    // Sky tint reflecting Day/Night
    const hour = gameState.dayTime;
    let skyHue = '#87ceeb'; // daytime
    if (hour < 5 || hour > 21) skyHue = '#0a0d1a'; // night
    else if (hour < 8 || hour > 18) skyHue = '#d35400'; // dawn/dusk

    ctx.fillStyle = skyHue;
    ctx.fillRect(0, -200, worldW, surfaceY + 200);

    // Rain visualization
    if (gameState.isRaining) {
      ctx.strokeStyle = 'rgba(150, 190, 255, 0.4)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 40; i++) {
        const rx = Math.random() * worldW;
        const ry = Math.random() * surfaceY;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 3, ry + 10);
        ctx.stroke();
      }
    }
  }

  renderGrid(ctx) {
    const cs = CONFIG.GRID.CELL_SIZE;
    for (let i = 0; i < this.grid.cells.length; i++) {
      const cell = this.grid.cells[i];
      const px = cell.x * cs;
      const py = cell.y * cs;

      switch (cell.type) {
        case CONFIG.CELL_TYPES.SOLID_SOIL:
          ctx.fillStyle = '#2f2115';
          ctx.fillRect(px, py, cs, cs);
          break;
        case CONFIG.CELL_TYPES.EMPTY:
          // Translucent surface background
          break;
        case CONFIG.CELL_TYPES.TUNNEL:
          ctx.fillStyle = '#17110c';
          ctx.fillRect(px, py, cs, cs);
          break;
        case CONFIG.CELL_TYPES.CHAMBER:
        case CONFIG.CELL_TYPES.QUEEN_CHAMBER:
          ctx.fillStyle = '#3a2718';
          ctx.fillRect(px, py, cs, cs);
          break;
        case CONFIG.CELL_TYPES.FOOD_STORAGE:
          ctx.fillStyle = '#293318';
          ctx.fillRect(px, py, cs, cs);
          break;
        case CONFIG.CELL_TYPES.BLOCKED:
          ctx.fillStyle = '#4f4f4f';
          ctx.fillRect(px, py, cs, cs);
          break;
      }

      // Resource node indicator (seeds on surface)
      if (cell.resourceAmount > 0) {
        ctx.fillStyle = '#a8e048';
        ctx.beginPath();
        ctx.arc(px + cs / 2, py + cs / 2, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Pheromones Overlay
      if (cell.pheromones[0] > 1) { // FORAGE (Green)
        ctx.fillStyle = `rgba(76, 175, 80, ${cell.pheromones[0] / 150})`;
        ctx.fillRect(px, py, cs, cs);
      }
      if (cell.pheromones[1] > 1) { // ALARM (Red)
        ctx.fillStyle = `rgba(229, 57, 53, ${cell.pheromones[1] / 150})`;
        ctx.fillRect(px, py, cs, cs);
      }
      if (cell.pheromones[2] > 1) { // BUILD (Cyan)
        ctx.fillStyle = `rgba(0, 188, 212, ${cell.pheromones[2] / 150})`;
        ctx.fillRect(px, py, cs, cs);
      }
    }
  }

  renderBrood(ctx, brood) {
    const cs = CONFIG.GRID.CELL_SIZE;
    for (let i = 0; i < brood.length; i++) {
      const b = brood[i];
      const bx = b.x * cs;
      const by = b.y * cs;

      if (b.stage === 'EGG') {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(bx, by, 2, 1.2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (b.stage === 'LARVA') {
        ctx.fillStyle = '#e0ded3';
        ctx.beginPath();
        ctx.ellipse(bx, by, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (b.stage === 'PUPA') {
        ctx.fillStyle = '#d0b48c';
        ctx.beginPath();
        ctx.ellipse(bx, by, 3.5, 2.2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  renderAnts(ctx, ants, queen) {
    const cs = CONFIG.GRID.CELL_SIZE;

    // Render Queen
    if (queen && queen.health > 0) {
      const qx = queen.x * cs;
      const qy = queen.y * cs;
      ctx.fillStyle = '#8b2500';
      ctx.beginPath();
      ctx.ellipse(qx, qy, 9, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Abdomen stripes
      ctx.strokeStyle = '#c94c1c';
      ctx.stroke();
    }

    // Render Workers & Soldiers
    for (let i = 0; i < ants.length; i++) {
      const a = ants[i];
      const ax = a.x * cs;
      const ay = a.y * cs;

      if (a.caste === CONFIG.CASTES.WORKER) {
        ctx.fillStyle = '#1c1712';
        ctx.beginPath();
        ctx.arc(ax, ay, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Carried resource particle
        if (a.carryingAmount > 0) {
          ctx.fillStyle = '#8bc34a';
          ctx.beginPath();
          ctx.arc(ax, ay - 3, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Soldier
        ctx.fillStyle = '#b71c1c';
        ctx.beginPath();
        ctx.arc(ax, ay, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  renderPredators(ctx, predators) {
    const cs = CONFIG.GRID.CELL_SIZE;
    for (let i = 0; i < predators.length; i++) {
      const p = predators[i];
      const px = p.x * cs;
      const py = p.y * cs;

      ctx.fillStyle = p.type === 'SPIDER' ? '#ff9800' : '#795548';
      ctx.beginPath();
      ctx.arc(px, py, p.type === 'SPIDER' ? 4 : 5.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}