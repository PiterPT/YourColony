/**
 * Global game constants and configuration parameters.
 */
const CONFIG = Object.freeze({
  GRID: {
    COLS: 80,
    ROWS: 45,
    CELL_SIZE: 16,
    SURFACE_ROW: 10
  },
  CELL_TYPES: {
    SOLID_SOIL: 0,
    EMPTY: 1,
    TUNNEL: 2,
    CHAMBER: 3,
    FOOD_STORAGE: 4,
    QUEEN_CHAMBER: 5,
    WATER: 6,
    BLOCKED: 7
  },
  PHEROMONES: {
    FORAGING: 0,
    ALARM: 1,
    BUILDING: 2,
    DECAY_RATE: 0.04,
    SPREAD_RATE: 0.015,
    MAX_INTENSITY: 100
  },
  RESOURCES: {
    MAX_DEFAULT: 500
  },
  CASTES: {
    WORKER: 'WORKER',
    SOLDIER: 'SOLDIER',
    QUEEN: 'QUEEN'
  },
  EVOLUTIONS: {
    efficientForaging: {
      id: 'efficientForaging',
      name: 'Forragem Eficiente',
      description: 'Obreiras transportam +2 unidades adicionais de recursos.',
      cost: { biomass: 30, sugar: 20 },
      prerequisites: [],
      effects: { carryBonus: 2 }
    },
    strongerMandibles: {
      id: 'strongerMandibles',
      name: 'Mandíbulas Fortalecidas',
      description: 'Aumenta o dano de ataque das unidades em +4.',
      cost: { biomass: 50, material: 40 },
      prerequisites: ['efficientForaging'],
      effects: { damageBonus: 4 }
    },
    improvedPheromones: {
      id: 'improvedPheromones',
      name: 'Feromonas Estáveis',
      description: 'As feromonas evaporam 50% mais devagar no ambiente.',
      cost: { biomass: 40, sugar: 40 },
      prerequisites: ['efficientForaging'],
      effects: { decayMultiplier: 0.5 }
    },
    reinforcedChitin: {
      id: 'reinforcedChitin',
      name: 'Quitina Reforçada',
      description: 'Aumenta os pontos de vida máximos de todas as formigas em +15.',
      cost: { biomass: 70, material: 50 },
      prerequisites: ['strongerMandibles'],
      effects: { healthBonus: 15 }
    },
    advancedNursery: {
      id: 'advancedNursery',
      name: 'Berçário Otimizado',
      description: 'Acelera a eclosão de larvas e o desenvolvimento pupal em 30%.',
      cost: { biomass: 90, sugar: 60 },
      prerequisites: ['improvedPheromones'],
      effects: { cycleSpeedMultiplier: 1.3 }
    },
    aphidSymbiosis: {
      id: 'aphidSymbiosis',
      name: 'Simbiose com Afídeos',
      description: 'Gera uma fonte contínua de néctar e açúcar na colónia (+0.4/s).',
      cost: { biomass: 120, sugar: 80 },
      prerequisites: ['advancedNursery'],
      effects: { passiveSugar: 0.4 }
    }
  }
});