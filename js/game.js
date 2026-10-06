/**
 * Master game coordinator tying inputs, systems, rendering and simulation loop.
 */
class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.grid = new CellGrid(CONFIG.GRID.COLS, CONFIG.GRID.ROWS);
    this.gameState = new GameState();
    this.camera = new Camera(this.canvas);
    this.pathfinding = new Pathfinding(this.grid);
    this.renderer = new Renderer(this.canvas, this.grid, this.camera);
    this.hud = new HUD(this.gameState, this.grid);
    this.loop = new GameLoop(this.update.bind(this), this.render.bind(this));

    this.isDragging = false;
    this.lastMouse = { x: 0, y: 0 };
    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Generate world & center camera
    WorldGenerator.generate(this.grid, this.gameState);
    SaveSystem.load(this.gameState, this.grid);

    this.camera.x = (CONFIG.GRID.COLS * CONFIG.GRID.CELL_SIZE) / 2;
    this.camera.y = (CONFIG.GRID.SURFACE_ROW + 5) * CONFIG.GRID.CELL_SIZE;

    this.bindInputs();
    this.loop.start();
  }

  resizeCanvas() {
    this.canvas.width = this.canvas.parentElement.clientWidth;
    this.canvas.height = this.canvas.parentElement.clientHeight;
  }

  bindInputs() {
    this.canvas.addEventListener('contextmenu', e => e.preventDefault());

    this.canvas.addEventListener('mousedown', e => {
      if (e.button === 2) {
        // Cancel/reset tool to inspect
        this.gameState.activeTool = 'select';
        return;
      }
      this.isDragging = true;
      this.lastMouse = { x: e.clientX, y: e.clientY };
      this.handlePointerAction(e.clientX, e.clientY);
    });

    window.addEventListener('mousemove', e => {
      if (!this.isDragging) return;
      if (e.buttons === 4 || (e.buttons === 1 && e.shiftKey)) {
        // Pan viewport
        this.camera.pan(this.lastMouse.x - e.clientX, this.lastMouse.y - e.clientY);
      } else if (e.buttons === 1) {
        this.handlePointerAction(e.clientX, e.clientY);
      }
      this.lastMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      this.camera.adjustZoom(zoomFactor, e.clientX, e.clientY);
    });

    window.addEventListener('keydown', e => {
      switch (e.code) {
        case 'Space':
          this.gameState.isPaused = !this.gameState.isPaused;
          break;
        case 'Digit1':
          this.gameState.gameSpeed = 1;
          break;
        case 'Digit2':
          this.gameState.gameSpeed = 2;
          break;
        case 'Digit3':
          this.gameState.gameSpeed = 4;
          break;
        case 'KeyF':
          this.gameState.activeTool = 'phero-forage';
          break;
        case 'KeyA':
          this.gameState.activeTool = 'phero-alarm';
          break;
        case 'KeyC':
          this.gameState.activeTool = 'phero-build';
          break;
        case 'KeyE':
          document.getElementById('modal-evolution').classList.toggle('hidden');
          break;
      }
    });
  }

  handlePointerAction(screenX, screenY) {
    const worldPos = this.camera.screenToWorld(screenX, screenY);
    const cellX = Math.floor(worldPos.x / CONFIG.GRID.CELL_SIZE);
    const cellY = Math.floor(worldPos.y / CONFIG.GRID.CELL_SIZE);

    const cell = this.grid.getCell(cellX, cellY);
    if (!cell) return;

    const tool = this.gameState.activeTool;

    if (tool === 'dig') {
      if (cell.type === CONFIG.CELL_TYPES.SOLID_SOIL && this.gameState.resources.material >= 1) {
        this.gameState.resources.material -= 1;
        cell.type = CONFIG.CELL_TYPES.TUNNEL;
      }
    } else if (tool === 'chamber-food') {
      if (cell.type === CONFIG.CELL_TYPES.TUNNEL && this.gameState.resources.material >= 5) {
        this.gameState.resources.material -= 5;
        cell.type = CONFIG.CELL_TYPES.FOOD_STORAGE;
      }
    } else if (tool === 'chamber-nursery') {
      if (cell.type === CONFIG.CELL_TYPES.TUNNEL && this.gameState.resources.material >= 5) {
        this.gameState.resources.material -= 5;
        cell.type = CONFIG.CELL_TYPES.CHAMBER;
      }
    } else if (tool === 'phero-forage') {
      PheromoneSystem.applyPheromone(this.grid, cellX, cellY, CONFIG.PHEROMONES.FORAGING);
    } else if (tool === 'phero-alarm') {
      PheromoneSystem.applyPheromone(this.grid, cellX, cellY, CONFIG.PHEROMONES.ALARM);
    } else if (tool === 'phero-build') {
      PheromoneSystem.applyPheromone(this.grid, cellX, cellY, CONFIG.PHEROMONES.BUILDING);
    } else if (tool === 'phero-clear') {
      PheromoneSystem.clearPheromones(this.grid, cellX, cellY);
    }
  }

  update(delta) {
    if (this.gameState.isPaused) return;

    const simDelta = delta * this.gameState.gameSpeed;

    // Simulation Subsystems
    EnvironmentSystem.update(simDelta, this.gameState, this.grid);
    ResourceSystem.update(simDelta, this.gameState);
    PheromoneSystem.update(simDelta, this.grid, this.gameState);

    if (this.gameState.queen) {
      this.gameState.queen.update(simDelta, this.gameState, this.grid);
    }

    ReproductionSystem.update(simDelta, this.gameState);

    for (let i = 0; i < this.gameState.ants.length; i++) {
      this.gameState.ants[i].update(simDelta, this.grid, this.pathfinding, this.gameState);
    }

    CombatSystem.update(simDelta, this.gameState, this.grid, this.pathfinding);

    this.hud.update();
  }

  render() {
    this.renderer.render(this.gameState);
  }
}