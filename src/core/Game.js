import { Input } from './Input.js';
import { Map } from '../world/Map.js';
import { Camera } from '../world/Camera.js';
import { Sound } from './Sound.js'; // 1. NEUER IMPORT

export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Systeme initialisieren
        this.input = new Input();
        this.map = new Map();
        this.camera = new Camera(this.canvas.width, this.canvas.height);
        this.sound = new Sound(); // 2. SOUND-SYSTEM INITIALISIEREN

        // Logischer Zustand
        this.player = { x: 1, y: 1, color: 'red' };

        // Visueller Zustand
        this.playerVisual = {
            x: this.player.x * this.map.tileSize,
            y: this.player.y * this.map.tileSize
        };

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

                    // 3. SOUND ÜBER DAS NEUE MODUL ABSPIELEN
                    this.sound.playStep();
                }
            }
        }

        const targetPixelX = this.player.x * this.map.tileSize;
        const targetPixelY = this.player.y * this.map.tileSize;

        this.playerVisual.x += (targetPixelX - this.playerVisual.x) * this.lerpSpeed;
        this.playerVisual.y += (targetPixelY - this.playerVisual.y) * this.lerpSpeed;

        const playerCenterX = this.playerVisual.x + this.map.tileSize / 2;
        const playerCenterY = this.playerVisual.y + this.map.tileSize / 2;
        this.camera.x = playerCenterX - this.camera.width / 2;
        this.camera.y = playerCenterY - this.camera.height / 2;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.map.draw(this.ctx, this.camera);

        const camX = Math.floor(this.camera.x);
        const camY = Math.floor(this.camera.y);

        const playerScreenX = Math.floor(this.playerVisual.x) - camX;
        const playerScreenY = Math.floor(this.playerVisual.y) - camY;

        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(
            playerScreenX + 4,
            playerScreenY + 4,
            this.map.tileSize - 8,
            this.map.tileSize - 8
        );
    }
}
