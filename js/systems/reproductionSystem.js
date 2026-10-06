/**
 * Handles the complete lifecycle: Egg -> Larva -> Pupa -> Adult Ant.
 */
class ReproductionSystem {
  static update(dt, gameState) {
    const speedMult = gameState.unlockedEvolutions.has('advancedNursery') ? 1.3 : 1.0;
    const aliveBrood = [];

    for (let i = 0; i < gameState.brood.length; i++) {
      const b = gameState.brood[i];
      b.progress += dt * speedMult;

      if (b.stage === 'EGG') {
        if (b.progress >= b.duration) {
          b.stage = 'LARVA';
          b.progress = 0;
          b.duration = 12.0;
          GlobalEvents.emit('notification', 'Um ovo eclodiu em larva.');
        }
        aliveBrood.push(b);
      } else if (b.stage === 'LARVA') {
        // Larvae consume biomass
        const needed = dt * 0.4;
        if (gameState.resources.biomass >= needed) {
          gameState.resources.biomass -= needed;
          if (b.progress >= b.duration) {
            b.stage = 'PUPA';
            b.progress = 0;
            b.duration = 8.0;
          }
          aliveBrood.push(b);
        } else {
          // Mortality due to starvation
          b.progress -= dt * 0.5;
          if (b.progress > -4.0) aliveBrood.push(b);
        }
      } else if (b.stage === 'PUPA') {
        if (b.progress >= b.duration) {
          // Metamorphosis into adult
          const isSoldier = Math.random() < 0.25;
          const caste = isSoldier ? CONFIG.CASTES.SOLDIER : CONFIG.CASTES.WORKER;
          const newAnt = new Ant(Date.now() + Math.random(), caste, b.x, b.y);

          // Apply health boost if researched
          if (gameState.unlockedEvolutions.has('reinforcedChitin')) {
            newAnt.maxHealth += 15;
            newAnt.health += 15;
          }

          gameState.ants.push(newAnt);
          GlobalEvents.emit('notification', `Uma nova formiga ${caste === 'SOLDIER' ? 'Soldado' : 'Obreira'} emergiu.`);
        } else {
          aliveBrood.push(b);
        }
      }
    }

    gameState.brood = aliveBrood;
  }
}