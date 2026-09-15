import { Input } from './Input.js';
import { Map } from '../world/Map.js';
import { Camera } from '../world/Camera.js';

export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Systeme initialisieren
        this.input = new Input();
        this.map = new Map();
        this.camera = new Camera(this.canvas.width, this.canvas.height);

        // Spieler-Startposition (muss auf einem begehbaren 0-Feld liegen)
        this.player = { x: 1, y: 1, color: 'red' };

        // Steuerung des Bewegungs-Timings
        this.lastMoveTime = 0;
        this.moveCooldown = 180;
    }

    start() {
        const loop = (timestamp) => {
            this.update(timestamp);
            this.draw();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    update(timestamp) {
        if (timestamp - this.lastMoveTime > this.moveCooldown) {
            let dx = 0;
            let dy = 0;

            if (this.input.isPressed('ArrowUp') || this.input.isPressed('w')) dy = -1;
            if (this.input.isPressed('ArrowDown') || this.input.isPressed('s')) dy = 1;
            if (this.input.isPressed('ArrowLeft') || this.input.isPressed('a')) dx = -1;
            if (this.input.isPressed('ArrowRight') || this.input.isPressed('d')) dx = 1;

            if (dx !== 0 || dy !== 0) {
                const nextX = this.player.x + dx;
                const nextY = this.player.y + dy;

                // KOLLISIONSPRÜFUNG: Frage die Map, ob das Feld frei ist
                if (this.map.isWalkable(nextX, nextY)) {
                    this.player.x = nextX;
                    this.player.y = nextY;
                }
                this.lastMoveTime = timestamp;
            }
        }

        // Kamera aktualisieren – sie folgt den Koordinaten des Spielers
        this.camera.update(this.player.x, this.player.y, this.map.tileSize);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 1. Map zeichnen (Kamera verschiebt die Kacheln beim Zeichnen)
        this.map.draw(this.ctx, this.camera);

        // 2. Spieler relativ zur Kamera zeichnen
        const playerScreenX = this.player.x * this.map.tileSize - this.camera.x;
        const playerScreenY = this.player.y * this.map.tileSize - this.camera.y;

        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(
            playerScreenX + 4,
            playerScreenY + 4,
            this.map.tileSize - 8,
            this.map.tileSize - 8
        );
    }
}
