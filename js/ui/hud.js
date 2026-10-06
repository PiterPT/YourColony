/**
 * User interface bindings, notification popups and dialog management.
 */
class HUD {
  constructor(gameState, grid) {
    this.gameState = gameState;
    this.grid = grid;
    this.initElements();
    this.attachEvents();
    this.renderEvolutionTree();
  }

  initElements() {
    this.elBiomass = document.getElementById('res-biomass');
    this.elSugar = document.getElementById('res-sugar');
    this.elMaterial = document.getElementById('res-material');
    this.elWater = document.getElementById('res-water');
    this.elPop = document.getElementById('stat-pop');
    this.elQueenHp = document.getElementById('queen-hp-fill');
    this.elDay = document.getElementById('stat-day');
    this.elTime = document.getElementById('stat-time');
    this.elWeather = document.getElementById('stat-weather');
    this.notifBox = document.getElementById('notifications-overlay');

    // Modals
    this.modalEvo = document.getElementById('modal-evolution');
    this.modalColony = document.getElementById('modal-colony');
    this.modalGameOver = document.getElementById('modal-gameover');
  }

  attachEvents() {
    GlobalEvents.on('notification', msg => this.pushNotification(msg));

    // Tool switching
    const tools = ['select', 'dig', 'chamber-food', 'chamber-nursery', 'phero-forage', 'phero-alarm', 'phero-build', 'phero-clear'];
    tools.forEach(t => {
      const btn = document.getElementById(`tool-${t}`);
      if (btn) {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.btn-tool').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.gameState.activeTool = t;
        });
      }
    });

    // Speed Controls
    document.getElementById('btn-pause').addEventListener('click', () => {
      this.gameState.isPaused = !this.gameState.isPaused;
      document.getElementById('btn-pause').textContent = this.gameState.isPaused ? '▶' : '⏸';
    });

    [1, 2, 4].forEach(spd => {
      const b = document.getElementById(`btn-speed-${spd}`);
      b.addEventListener('click', () => {
        document.querySelectorAll('.ctrl-group .btn-ctrl').forEach(c => c.classList.remove('active'));
        b.classList.add('active');
        this.gameState.gameSpeed = spd;
        this.gameState.isPaused = false;
        document.getElementById('btn-pause').textContent = '⏸';
      });
    });

    // Modals toggle
    document.getElementById('btn-toggle-evolution').addEventListener('click', () => {
      this.modalEvo.classList.toggle('hidden');
    });
    document.getElementById('btn-close-evolution').addEventListener('click', () => {
      this.modalEvo.classList.add('hidden');
    });

    document.getElementById('btn-toggle-colony').addEventListener('click', () => {
      this.updateColonyModal();
      this.modalColony.classList.toggle('hidden');
    });
    document.getElementById('btn-close-colony').addEventListener('click', () => {
      this.modalColony.classList.add('hidden');
    });

    // Sliders
    ['food', 'dig', 'care'].forEach(p => {
      const slider = document.getElementById(`prio-${p}`);
      const val = document.getElementById(`val-prio-${p}`);
      slider.addEventListener('input', e => {
        val.textContent = e.target.value;
        if (p === 'food') this.gameState.priorities.food = Number(e.target.value);
        if (p === 'dig') this.gameState.priorities.construction = Number(e.target.value);
        if (p === 'care') this.gameState.priorities.nursery = Number(e.target.value);
      });
    });

    // Save
    document.getElementById('btn-save').addEventListener('click', () => {
      SaveSystem.save(this.gameState, this.grid);
    });

    // Restart on gameover
    document.getElementById('btn-restart').addEventListener('click', () => {
      SaveSystem.deleteSave();
      window.location.reload();
    });
  }

  update() {
    this.elBiomass.textContent = Math.floor(this.gameState.resources.biomass);
    this.elSugar.textContent = Math.floor(this.gameState.resources.sugar);
    this.elMaterial.textContent = Math.floor(this.gameState.resources.material);
    this.elWater.textContent = Math.floor(this.gameState.resources.water);

    this.elPop.textContent = this.gameState.ants.length;
    const hp = this.gameState.queen ? Math.max(0, this.gameState.queen.health) : 0;
    this.elQueenHp.style.width = `${hp}%`;

    this.elDay.textContent = this.gameState.daysElapsed;
    const h = Math.floor(this.gameState.dayTime);
    const m = Math.floor((this.gameState.dayTime - h) * 60);
    this.elTime.textContent = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    this.elWeather.textContent = this.gameState.isRaining ? 'Chuva' : 'Seco';

    this.checkVictoryDefeat();
  }

  updateColonyModal() {
    let workers = 0;
    let soldiers = 0;
    this.gameState.ants.forEach(a => {
      if (a.caste === CONFIG.CASTES.WORKER) workers++;
      else soldiers++;
    });

    let eggs = 0;
    let larvae = 0;
    let pupae = 0;
    this.gameState.brood.forEach(b => {
      if (b.stage === 'EGG') eggs++;
      else if (b.stage === 'LARVA') larvae++;
      else pupae++;
    });

    document.getElementById('cnt-workers').textContent = workers;
    document.getElementById('cnt-soldiers').textContent = soldiers;
    document.getElementById('cnt-eggs').textContent = eggs;
    document.getElementById('cnt-larvae').textContent = larvae;
    document.getElementById('cnt-pupae').textContent = pupae;
  }

  renderEvolutionTree() {
    const container = document.getElementById('evolution-tree-grid');
    container.innerHTML = '';

    Object.values(CONFIG.EVOLUTIONS).forEach(evo => {
      const card = document.createElement('div');
      card.className = `evo-card ${this.gameState.unlockedEvolutions.has(evo.id) ? 'unlocked' : ''}`;
      card.id = `evo-card-${evo.id}`;

      const name = document.createElement('div');
      name.className = 'evo-name';
      name.textContent = evo.name;

      const desc = document.createElement('div');
      desc.className = 'evo-desc';
      desc.textContent = evo.description;

      const cost = document.createElement('div');
      cost.className = 'evo-cost';
      cost.textContent = `Custo: ${evo.cost.biomass || 0} Bio | ${evo.cost.sugar || 0} Açúcar`;

      const btn = document.createElement('button');
      btn.className = 'btn-action';
      btn.textContent = this.gameState.unlockedEvolutions.has(evo.id) ? 'Desbloqueado' : 'Evoluir';
      btn.disabled = this.gameState.unlockedEvolutions.has(evo.id);

      btn.addEventListener('click', () => {
        if (EvolutionSystem.unlock(evo.id, this.gameState)) {
          card.classList.add('unlocked');
          btn.textContent = 'Desbloqueado';
          btn.disabled = true;
        }
      });

      card.appendChild(name);
      card.appendChild(desc);
      card.appendChild(cost);
      card.appendChild(btn);
      container.appendChild(card);
    });
  }

  pushNotification(text) {
    const notif = document.createElement('div');
    notif.className = 'notif-msg';
    notif.textContent = text;
    this.notifBox.appendChild(notif);
    setTimeout(() => {
      if (notif.parentNode) notif.parentNode.removeChild(notif);
    }, 4000);
  }

  checkVictoryDefeat() {
    if (this.modalGameOver.classList.contains('active')) return;

    // Defeat
    if (this.gameState.queen && this.gameState.queen.health <= 0) {
      this.showEndGame('A Colónia Caiu', 'A Rainha pereceu. Sem reprodução, o formigueiro colapsou.');
      return;
    }
    if (this.gameState.ants.length === 0 && this.gameState.brood.length === 0) {
      this.showEndGame('Extinção', 'Todas as formigas morreram. A colónia cessou funções.');
      return;
    }

    // Victory: 100 living ants and 3 evolved traits
    if (this.gameState.ants.length >= 100 && this.gameState.unlockedEvolutions.size >= 3) {
      this.showEndGame('Vitória Evolutiva!', 'O teu império biológico dominou o ecossistema com vigor e resiliência.');
    }
  }

  showEndGame(title, desc) {
    this.modalGameOver.classList.remove('hidden');
    this.modalGameOver.classList.add('active');
    document.getElementById('endgame-title').textContent = title;
    document.getElementById('endgame-desc').textContent = desc;
    this.gameState.isPaused = true;
  }
}