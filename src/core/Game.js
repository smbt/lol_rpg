import { Input } from './Input.js';
import { Map } from '../world/Map.js';
import { Camera } from '../world/Camera.js';

export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.input = new Input();
        this.map = new Map();
        this.camera = new Camera(this.canvas.width, this.canvas.height);

        // LOGISCHE POSITION (Feste Kachel-Koordinaten)
        this.player = { x: 3, y: 3, color: 'red' };

        // VISUELLE POSITION (In Pixeln, startet exakt auf der Kachel)
        this.playerVisual = {
            x: this.player.x * this.map.tileSize,
            y: this.player.y * this.map.tileSize
        };

        // Animations-Geschwindigkeit (Höher = schnelleres Rutschen)
        this.lerpSpeed = 0.2;

        this.lastMoveTime = 0;
        this.moveCooldown = 200; // Etwas höher, passend zur Animation
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
        // 1. Logische Bewegung (Kachel-Weise)
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

                if (this.map.isWalkable(nextX, nextY)) {
                    this.player.x = nextX;
                    this.player.y = nextY;
                    this.lastMoveTime = timestamp;
                }
            }
        }

        // 2. VISUELLE INTERPOLATION (Linear Interpolation / LERP)
        // Berechne, wo der Spieler in Pixeln sein SOLLTE
        const targetPixelX = this.player.x * this.map.tileSize;
        const targetPixelY = this.player.y * this.map.tileSize;

        // Bewege die visuelle Position jeden Frame ein Stück näher an das Ziel
        this.playerVisual.x += (targetPixelX - this.playerVisual.x) * this.lerpSpeed;
        this.playerVisual.y += (targetPixelY - this.playerVisual.y) * this.lerpSpeed;

        // 3. KAMERA AKTUALISIEREN
        // Die Kamera folgt jetzt der flüssigen visuellen Pixel-Position statt den starren Kacheln!
        // Da update() Pixel erwartet, rechnen wir hier nicht mehr mal tileSize
        const playerCenterX = this.playerVisual.x + this.map.tileSize / 2;
        const playerCenterY = this.playerVisual.y + this.map.tileSize / 2;
        this.camera.x = playerCenterX - this.camera.width / 2;
        this.camera.y = playerCenterY - this.camera.height / 2;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Map zeichnen (Kamera nutzt die flüssigen Werte)
        this.map.draw(this.ctx, this.camera);

        // Spieler basierend auf der VISUELLEN Position zeichnen
        const playerScreenX = this.playerVisual.x - this.camera.x;
        const playerScreenY = this.playerVisual.y - this.camera.y;

        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(
            playerScreenX + 4,
            playerScreenY + 4,
            this.map.tileSize - 8,
            this.map.tileSize - 8
        );
    }
}
