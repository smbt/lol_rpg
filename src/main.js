import { Game } from './core/Game.js';

window.addEventListener('DOMContentLoaded', () => {
    const game = new Game('gameCanvas');

    const canvas = document.getElementById('gameCanvas');

    // Funktion zur dynamischen Anpassung des Canvas an den Bildschirm
    const resizeGame = () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        // Übergibt die neuen Maße an die Game-Klasse für die Kamera
        game.handleResize(canvas.width, canvas.height);
    };

    // Beim Start einmal direkt ausführen, um die Initialgröße zu setzen
    resizeGame();

    // Bei jeder Größenänderung des Fensters automatisch anpassen
    window.addEventListener('resize', resizeGame);

    // Das Spiel offiziell starten
    game.start();
});
