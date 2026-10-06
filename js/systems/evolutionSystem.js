/**
 * Evolutionary research tree purchases and prerequisites.
 */
class EvolutionSystem {
  static unlock(evoId, gameState) {
    const evo = CONFIG.EVOLUTIONS[evoId];
    if (!evo || gameState.unlockedEvolutions.has(evoId)) return false;

    // Verify prerequisites
    for (let i = 0; i < evo.prerequisites.length; i++) {
      if (!gameState.unlockedEvolutions.has(evo.prerequisites[i])) {
        GlobalEvents.emit('notification', 'Pré-requisitos biológicos em falta.');
        return false;
      }
    }

    // Check costs
    const res = gameState.resources;
    if (evo.cost.biomass && res.biomass < evo.cost.biomass) return false;
    if (evo.cost.sugar && res.sugar < evo.cost.sugar) return false;
    if (evo.cost.material && res.material < evo.cost.material) return false;

    // Deduct costs
    if (evo.cost.biomass) res.biomass -= evo.cost.biomass;
    if (evo.cost.sugar) res.sugar -= evo.cost.sugar;
    if (evo.cost.material) res.material -= evo.cost.material;

    gameState.unlockedEvolutions.add(evoId);
    GlobalEvents.emit('notification', `Evolução Desbloqueada: ${evo.name}!`);
    GlobalEvents.emit('evolutionUnlocked', evoId);
    return true;
  }
}