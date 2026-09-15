import { Game } from './core/Game.js';

window.addEventListener('DOMContentLoaded', () => {
    // Spiel-Instanz erstellen und starten
    const game = new Game('gameCanvas');
    game.start();
});
