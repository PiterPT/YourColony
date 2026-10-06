/**
 * Resource balance, consumption, limits and passive generation.
 */
class ResourceSystem {
  static update(dt, gameState) {
    const pop = gameState.ants.length;

    // Active insect water & sugar consumption
    const sugarBurn = pop * 0.08 * dt;
    const waterBurn = pop * 0.06 * dt;

    gameState.resources.sugar = Math.max(0, gameState.resources.sugar - sugarBurn);
    gameState.resources.water = Math.max(0, gameState.resources.water - waterBurn);

    // Symbiosis perk passive sugar
    if (gameState.unlockedEvolutions.has('aphidSymbiosis')) {
      gameState.resources.sugar = Math.min(
        gameState.resources.maxSugar,
        gameState.resources.sugar + 0.4 * dt
      );
    }

    // Safety checks against NaN/Infinity
    const keys = ['biomass', 'sugar', 'material', 'water'];
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (isNaN(gameState.resources[k]) || !isFinite(gameState.resources[k])) {
        gameState.resources[k] = 0;
      }
    }
  }
}