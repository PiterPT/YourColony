/**
 * Queen entity: reproduction center and survival prerequisite.
 */
class Queen {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.health = 100;
    this.maxHealth = 100;
    this.eggCooldown = 6.0; // Seconds between oviposition
    this.timer = 0;
    this.state = 'LAYING_EGGS';
  }

  update(dt, gameState, grid) {
    this.timer += dt;

    // Environmental impacts on Queen
    const cell = grid.getCell(Math.round(this.x), Math.round(this.y));
    const temp = cell ? cell.temperature : 22.0;

    if (temp < 10 || temp > 35) {
      this.health = Math.max(0, this.health - dt * 1.5);
      this.state = 'STRESSED';
    } else {
      this.state = 'LAYING_EGGS';
      if (this.health < this.maxHealth) {
        this.health = Math.min(this.maxHealth, this.health + dt * 0.4);
      }
    }

    // Lay egg condition: sufficient biomass and cooldown elapsed
    if (this.timer >= this.eggCooldown) {
      this.timer = 0;
      if (gameState.resources.biomass >= 8 && this.health > 20) {
        gameState.resources.biomass -= 8;
        this.layEgg(gameState);
      }
    }
  }

  layEgg(gameState) {
    gameState.brood.push({
      stage: 'EGG',
      progress: 0,
      duration: 10.0, // seconds to hatch
      x: this.x + (Math.random() - 0.5) * 1.5,
      y: this.y + (Math.random() - 0.5) * 0.8
    });
    GlobalEvents.emit('notification', 'A Rainha depositou um novo ovo.');
  }
}