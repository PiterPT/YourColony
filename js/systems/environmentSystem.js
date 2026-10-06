/**
 * Day/night cycle, thermal zones and weather phenomena.
 */
class EnvironmentSystem {
  static update(dt, gameState, grid) {
    // 24-hour cycle advances 1 hour every 10 real seconds
    gameState.dayTime += (dt / 10);
    if (gameState.dayTime >= 24.0) {
      gameState.dayTime = 0.0;
      gameState.daysElapsed++;
      GlobalEvents.emit('notification', `Dia ${gameState.daysElapsed} começou.`);
    }

    // Weather toggle (rain vs dry)
    gameState.weatherTimer += dt;
    if (gameState.weatherTimer > 90) { // change every 90s
      gameState.weatherTimer = 0;
      gameState.isRaining = Math.random() < 0.35;
      GlobalEvents.emit('notification', gameState.isRaining ? 'Começou a chover.' : 'O tempo secou.');
    }

    // Temperature fluctuation based on time of day
    const hour = gameState.dayTime;
    const baseTemp = 20 + 8 * Math.sin(((hour - 8) / 24) * Math.PI * 2);
    gameState.temperature = baseTemp - (gameState.isRaining ? 4 : 0);

    // Humidity adjustment
    if (gameState.isRaining) {
      gameState.humidity = Math.min(95, gameState.humidity + dt * 2);
      gameState.resources.water = Math.min(gameState.resources.maxWater, gameState.resources.water + dt * 1.5);
    } else {
      gameState.humidity = Math.max(30, gameState.humidity - dt * 0.5);
    }

    // Propagate thermal readings underground (thermal inertia)
    const surfaceRow = CONFIG.GRID.SURFACE_ROW;
    for (let y = surfaceRow; y < grid.rows; y++) {
      const depth = y - surfaceRow;
      const depthDamp = Math.max(0.2, 1 - depth * 0.04);
      for (let x = 0; x < grid.cols; x++) {
        const cell = grid.getCell(x, y);
        if (cell) {
          cell.temperature = 18 + (gameState.temperature - 18) * depthDamp;
          cell.humidity = Math.min(100, gameState.humidity + depth * 0.8);
        }
      }
    }
  }
}