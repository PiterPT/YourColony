/**
 * 2D viewport pan/zoom transform coordinates converter.
 */
class Camera {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = 0;
    this.y = 0;
    this.zoom = 1.0;
    this.minZoom = 0.5;
    this.maxZoom = 2.5;
  }

  worldToScreen(worldX, worldY) {
    return {
      x: (worldX - this.x) * this.zoom + this.canvas.width / 2,
      y: (worldY - this.y) * this.zoom + this.canvas.height / 2
    };
  }

  screenToWorld(screenX, screenY) {
    return {
      x: (screenX - this.canvas.width / 2) / this.zoom + this.x,
      y: (screenY - this.canvas.height / 2) / this.zoom + this.y
    };
  }

  pan(dx, dy) {
    this.x += dx / this.zoom;
    this.y += dy / this.zoom;
  }

  adjustZoom(factor, centerScreenX, centerScreenY) {
    const prevWorld = this.screenToWorld(centerScreenX, centerScreenY);
    this.zoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoom * factor));
    const nextWorld = this.screenToWorld(centerScreenX, centerScreenY);
    this.x += prevWorld.x - nextWorld.x;
    this.y += prevWorld.y - nextWorld.y;
  }
}