/**
 * Application Entrypoint: Bootstraps DOM readiness and game instance.
 */
window.addEventListener('DOMContentLoaded', () => {
  try {
    window.YourColonyGame = new Game();
  } catch (error) {
    console.error('Falha crítica ao inicializar YourColony:', error);
  }
});