/**
 * Single source of truth for the game runtime simulation state.
 */
class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.isPaused = false;
    this.gameSpeed = 1;
    this.dayTime = 8.0; // 08:00
    this.daysElapsed = 1;

    // Environmental readings
    this.temperature = 22.0; // Celsius
    this.humidity = 60.0; // %
    this.isRaining = false;
    this.weatherTimer = 0;

    // Resources
    this.resources = {
      biomass: 60,
      sugar: 50,
      material: 40,
      water: 80,
      maxBiomass: CONFIG.RESOURCES.MAX_DEFAULT,
      maxSugar: CONFIG.RESOURCES.MAX_DEFAULT,
      maxMaterial: CONFIG.RESOURCES.MAX_DEFAULT,
      maxWater: CONFIG.RESOURCES.MAX_DEFAULT
    };

    // Priorities
    this.priorities = {
      food: 3,
      construction: 3,
      nursery: 3
    };

    // Evolutions unlocked
    this.unlockedEvolutions = new Set();

    // Entities
    this.ants = [];
    this.queen = null;
    this.predators = [];
    this.brood = []; // Eggs, larvae, pupae

    // Interaction mode
    this.activeTool = 'select'; // 'select', 'dig', 'chamber-food', 'chamber-nursery', 'phero-forage', etc.
  }
}