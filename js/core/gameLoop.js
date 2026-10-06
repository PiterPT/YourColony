/**
 * Strict requestAnimationFrame loop with capped delta time.
 */
class GameLoop {
  constructor(updateFn, renderFn) {
    this.updateFn = updateFn;
    this.renderFn = renderFn;
    this.lastTime = 0;
    this.running = false;
    this.frameId = null;
    this.maxDelta = 0.1; // 100ms cap to avoid spiral of death
    this.step = this.step.bind(this);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.frameId = requestAnimationFrame(this.step);
  }

  stop() {
    this.running = false;
    if (this.frameId) cancelAnimationFrame(this.frameId);
  }

  step(currentTime) {
    if (!this.running) return;
    let delta = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    if (delta > this.maxDelta) delta = this.maxDelta;

    this.updateFn(delta);
    this.renderFn();

    this.frameId = requestAnimationFrame(this.step);
  }
}