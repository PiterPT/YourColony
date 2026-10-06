/**
 * Safe persistence engine utilizing localStorage with validation checks.
 */
class SaveSystem {
  static SAVE_KEY = 'YOURCOLONY_STATE_V1';

  static save(gameState, grid) {
    try {
      const terrainData = grid.cells.map(c => ({
        t: c.type,
        r: c.resourceAmount
      }));

      const payload = {
        timestamp: Date.now(),
        days: gameState.daysElapsed,
        dayTime: gameState.dayTime,
        resources: gameState.resources,
        priorities: gameState.priorities,
        evolutions: Array.from(gameState.unlockedEvolutions),
        queen: { x: gameState.queen.x, y: gameState.queen.y, hp: gameState.queen.health },
        ants: gameState.ants.map(a => ({
          c: a.caste,
          x: a.x,
          y: a.y,
          hp: a.health
        })),
        terrain: terrainData
      };

      localStorage.setItem(this.SAVE_KEY, JSON.stringify(payload));
      GlobalEvents.emit('notification', 'Jogo guardado com sucesso.');
      return true;
    } catch (err) {
      console.error('Falha ao guardar o estado:', err);
      return false;
    }
  }

  static load(gameState, grid) {
    try {
      const raw = localStorage.getItem(this.SAVE_KEY);
      if (!raw) return false;

      const data = JSON.parse(raw);
      if (!data || !data.resources || !Array.isArray(data.terrain)) {
        throw new Error('Dados de save corrompidos ou incompatíveis.');
      }

      // Restore terrain
      for (let i = 0; i < grid.cells.length; i++) {
        if (data.terrain[i]) {
          grid.cells[i].type = data.terrain[i].t;
          grid.cells[i].resourceAmount = data.terrain[i].r || 0;
        }
      }

      // Restore state
      gameState.daysElapsed = data.days || 1;
      gameState.dayTime = data.dayTime || 8.0;
      Object.assign(gameState.resources, data.resources);
      Object.assign(gameState.priorities, data.priorities || { food: 3, construction: 3, nursery: 3 });
      gameState.unlockedEvolutions = new Set(data.evolutions || []);

      if (data.queen) {
        gameState.queen.x = data.queen.x;
        gameState.queen.y = data.queen.y;
        gameState.queen.health = data.queen.hp;
      }

      gameState.ants = (data.ants || []).map((a, idx) => {
        const ant = new Ant(idx, a.c, a.x, a.y);
        ant.health = a.hp;
        return ant;
      });

      GlobalEvents.emit('notification', 'Jogo carregado com sucesso.');
      return true;
    } catch (err) {
      console.warn('Falha no carregamento. A reiniciar estado novo:', err);
      return false;
    }
  }

  static deleteSave() {
    localStorage.removeItem(this.SAVE_KEY);
  }
}