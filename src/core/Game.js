import { Input } from './Input.js';
import { Map } from '../world/Map.js';
import { Camera } from '../world/Camera.js';
import { Sound } from './Sound.js';
import { Player } from '../entities/Player.js';
import { UI } from './UI.js';
import { constants } from './constants.js';

export class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Systeme initialisieren
        this.input = new Input();
        this.map = new Map();
        this.camera = new Camera(this.canvas.width, this.canvas.height);
        this.sound = new Sound();
        this.ui = new UI();

        this.player = new Player(constants.player.startX, constants.player.startY);

        this.input.onInteraction = () => {
            this.sound.startMusic();
        };

        // 3. NEU: Dem Spieler Werte geben
        this.player.currentHP = 25;
        this.player.maxHP = 25
        this.player.currentEP = 1;
        this.player.maxEP = 50;

        this.lerpSpeed = 0.2;
        this.lastMoveTime = 0;
        this.moveCooldown = 200;

        // Einmalig das UI beim Start mit den echten Werten füttern
        this.ui.updateHP(this.player.currentHP, this.player.maxHP);
        this.ui.updateEP(this.player.currentEP, this.player.maxEP);

        this.input.onTap = () => {
            this.sound.playHit();
            this.attack();
        };
    }

    handleResize(newWidth, newHeight) {
        if (!this.map || !this.camera) return;

        const gewuenschteKachelnBreite = newWidth > newHeight ? 30 : 10;
        const dynamischeTileSize = Math.ceil(newWidth / gewuenschteKachelnBreite);
        this.map.tileSize = dynamischeTileSize;
        this.tileSize = dynamischeTileSize;
        this.camera.width = newWidth;
        this.camera.height = newHeight;
        this.draw();
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

            if (this.input.isPressed('up')) dy = -1;
            if (this.input.isPressed('down')) dy = 1;
            if (this.input.isPressed('left')) dx = -1;
            if (this.input.isPressed('right')) dx = 1;

            if (dx !== 0 || dy !== 0) {

                if (dx === 1) this.player.facingDirection = 'right';
                if (dx === -1) this.player.facingDirection = 'left';
                if (dy === 1) this.player.facingDirection = 'down';
                if (dy === -1) this.player.facingDirection = 'up';

                console.log(this.player.facingDirection);

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

        const targetPixelX = this.player.x * this.map.tileSize;
        const targetPixelY = this.player.y * this.map.tileSize;
        this.player.interpolate(targetPixelX, targetPixelY, this.lerpSpeed);

        const playerCenterX = this.player.visualX + this.map.tileSize / 2;
        const playerCenterY = this.player.visualY + this.map.tileSize / 2;
        this.camera.x = playerCenterX - this.camera.width / 2;
        this.camera.y = playerCenterY - this.camera.height / 2;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.map.draw(this.ctx, this.camera);
        const camX = Math.floor(this.camera.x);
        const camY = Math.floor(this.camera.y);
        this.player.draw(this.ctx, camX, camY, this.map.tileSize);
    }


    attack() {
        let targetX = this.player.x;
        let targetY = this.player.y;

        if (this.player.facingDirection === 'up') targetY--;
        if (this.player.facingDirection === 'down') targetY++;
        if (this.player.facingDirection === 'left') targetX--;
        if (this.player.facingDirection === 'right') targetX++;

        const target = this.map.getObjectAt(targetX, targetY);

        console.log(target)

        if (target && target.hp !== undefined) {
            target.hp--;

            console.log('Target getroffen. HP:', target.hp);

            if (target.hp <= 0) {
                this.map.removeObject(target);
            }
        }
    }
}
