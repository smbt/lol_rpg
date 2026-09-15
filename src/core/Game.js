import { Input } from './Input.js';
import { Map } from '../world/Map.js';
import { Camera } from '../world/Camera.js';
import { Sound } from './Sound.js';
import { Player } from '../entities/Player.js'; // 1. NEUER IMPORT

export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Systeme initialisieren
        this.input = new Input();
        this.map = new Map();
        this.camera = new Camera(this.canvas.width, this.canvas.height);
        this.sound = new Sound();

        // 2. SPIELER ALS ECHTES OBJEKT INITIALISIEREN
        this.player = new Player(1, 1);

        this.lerpSpeed = 0.2;
        this.lastMoveTime = 0;
        this.moveCooldown = 200;
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

                if (this.map.isWalkable(nextX, nextY)) {
                    this.player.x = nextX;
                    this.player.y = nextY;
                    this.lastMoveTime = timestamp;
                    this.sound.playStep();
                }
            }
        }

        // 3. VISUELLE INTERPOLATION AN PLAYER DELEGIEREN
        const targetPixelX = this.player.x * this.map.tileSize;
        const targetPixelY = this.player.y * this.map.tileSize;
        this.player.interpolate(targetPixelX, targetPixelY, this.lerpSpeed);

        // Kamera folgt dem Spieler
        const playerCenterX = this.player.visualX + this.map.tileSize / 2;
        const playerCenterY = this.player.visualY + this.map.tileSize / 2;
        this.camera.x = playerCenterX - this.camera.width / 2;
        this.camera.y = playerCenterY - this.camera.height / 2;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Map zeichnen
        this.map.draw(this.ctx, this.camera);

        // 4. SPIELER SICH SELBST ZEICHNEN LASSEN
        const camX = Math.floor(this.camera.x);
        const camY = Math.floor(this.camera.y);
        this.player.draw(this.ctx, camX, camY, this.map.tileSize);
    }
}
