import { Game } from './core/Game.js';

const handleFullScreenBtn = () => {
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const fullscreenIcon = document.getElementById('fullscreen-icon');

    if (fullscreenBtn) {
        // Absolute Sicherheit im CSS erzwingen: Der Button MUSS Klicks annehmen
        fullscreenBtn.style.pointerEvents = 'auto';

        // 'pointerup' gilt im Browser als sichere Benutzer-Geste (User Gesture) für Fullscreen!
        fullscreenBtn.addEventListener('pointerup', (e) => {
            e.stopPropagation();
            e.preventDefault(); // Verhindert Geister-Klicks auf mobilen Geräten

            // Prüfen, ob das Spiel bereits im Vollbildmodus läuft
            if (!document.fullscreenElement &&
                !document.webkitFullscreenElement &&
                !document.msFullscreenElement) {

                // Vollbild anfordern
                const element = document.documentElement;
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullscreen) { /* Safari / iOS */
                    element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            } else {
                // Vollbild verlassen
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        });
    }

    // Event-Listener für Statusänderungen (wichtig für das automatische Canvas-Resizing)
    // Ersetze die onFullscreenChange-Funktion in deiner main.js:
    const onFullscreenChange = () => {
        const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);

        if (!fullscreenIcon || !fullscreenBtn) return;

        // Visuelles Feedback: Nur die 2 Pfeilspitzen umschalten
        if (isFullscreen) {
            // Spitzen zeigen nach innen (Zusammenziehen)
            fullscreenIcon.innerHTML = `
                <!-- Spitze Oben-Rechts zeigt nach innen -->
                <polyline points="20 9 15 9 15 4"></polyline>
                <!-- Spitze Unten-Links zeigt nach innen -->
                <polyline points="4 15 9 15 9 20"></polyline>
            `;
        } else {
            // Spitzen zeigen nach außen (Standard)
            fullscreenIcon.innerHTML = `
                <!-- Spitze Oben-Rechts zeigt nach außen -->
                <polyline points="16 4 20 4 20 8"></polyline>
                <!-- Spitze Unten-Links zeigt nach außen -->
                <polyline points="8 20 4 20 4 16"></polyline>
            `;
        }

        // Berechnet die Canvas-Auflösung über dein Event-System neu
        window.dispatchEvent(new Event('resize'));
    };


    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('msfullscreenchange', onFullscreenChange);
}


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

    // Aufruf der Logik
    handleFullScreenBtn();

    // Das Spiel offiziell starten
    game.start();
});
