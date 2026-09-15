import { Input } from './Input.js';

export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Systeme initialisieren
        this.input = new Input();

        // Temporärer Spielzustand für Meilenstein 1
        this.tileSize = 40;
        this.player = { x: 2, y: 2, color: 'red' };

        // Steuerung des Bewegungs-Timings (Cooldown)
        this.lastMoveTime = 0;
        this.moveCooldown = 150; // Millisekunden zwischen Kachel-Schritten
    }

    start() {
        // Starte den offiziellen Game Loop des Browsers
        const loop = (timestamp) => {
            this.update(timestamp);
            this.draw();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    update(timestamp) {
        // Prüfen, ob der Cooldown abgelaufen ist, um Kachel-Weise zu laufen
        if (timestamp - this.lastMoveTime > this.moveCooldown) {
            let dx = 0;
            let dy = 0;

            if (this.input.isPressed('ArrowUp') || this.input.isPressed('w')) dy = -1;
            if (this.input.isPressed('ArrowDown') || this.input.isPressed('s')) dy = 1;
            if (this.input.isPressed('ArrowLeft') || this.input.isPressed('a')) dx = -1;
            if (this.input.isPressed('ArrowRight') || this.input.isPressed('d')) dx = 1;

            // Wenn eine Bewegung stattfindet
            if (dx !== 0 || dy !== 0) {
                this.player.x += dx;
                this.player.y += dy;
                this.lastMoveTime = timestamp; // Cooldown zurücksetzen
            }
        }
    }

    draw() {
        // Canvas leeren
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Raster im Hintergrund zeichnen (zur Orientierung)
        this.ctx.strokeStyle = '#333';
        for (let x = 0; x < this.canvas.width; x += this.tileSize) {
            for (let y = 0; y < this.canvas.height; y += this.tileSize) {
                this.ctx.strokeRect(x, y, this.tileSize, this.tileSize);
            }
        }

        // Spieler zeichnen
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(
            this.player.x * this.tileSize + 4,
            this.player.y * this.tileSize + 4,
            this.tileSize - 8,
            this.tileSize - 8
        );
    }
}
