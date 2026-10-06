/**
 * Lightweight decoupled publisher/subscriber event bus.
 */
class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const filtered = this.listeners.get(event).filter(cb => cb !== callback);
    this.listeners.set(event, filtered);
  }

  emit(event, data) {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event);
    for (let i = 0; i < callbacks.length; i++) {
      try {
        callbacks[i](data);
      } catch (err) {
        console.error(`Erro ao disparar evento [${event}]:`, err);
      }
    }
  }
}

const GlobalEvents = new EventBus();