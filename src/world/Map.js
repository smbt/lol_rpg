import { textures } from './textures.js';

export class Map {
    constructor() {
        this.tileSize = 40;

        // --- KONFIGURATION ---
        this.width = 64;
        this.height = 64;
        this.seed = 1243435;
        this.wallChance = 0.06; // Chance für Natur-Wände (ID 1)
        this.treeChance = 0.04; // Chance für Bäume (ID 2) auf der Wiese
        // ---------------------

        this.rngState = this.seed;
        this.grid = Array(this.height).fill(null).map(() => Array(this.width).fill(0));

        // --- TEXTUREN LADEN ---
        this.texturesLoaded = 0;
        this.grassTexture = new Image();
        this.wallTexture = new Image();
        this.treeTexture = new Image();
        this.houseTexture = new Image();
        this.chestTexture = new Image();

        this.grassTexture.onload = () => this.texturesLoaded++;
        this.wallTexture.onload = () => this.texturesLoaded++;
        this.treeTexture.onload = () => this.texturesLoaded++;
        this.houseTexture.onload = () => this.texturesLoaded++;
        this.chestTexture.onload = () => this.texturesLoaded++;


        // 1. Das Gras-Muster (exakt nach deiner funktionierenden Spieler-Vorlage)
        this.grassTexture.src = textures.grass;

        // 2. Das Stein-Muster
        this.wallTexture.src = textures.wall;

        this.treeTexture.src = textures.tree;


        this.houseTexture.src = textures.house;

        this.chestTexture.src = textures.chest;


        this.generateProcedural();
    }

    random() {
        this.rngState = (this.rngState * 1664525 + 1013904223) % 4294967296;
        return this.rngState / 4294967296;
    }

    generateProcedural() {
        // 1. Ränder und Naturwände würfeln
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1) {
                    this.grid[y][x] = 1; // Außenrand = Braune Naturwand
                } else if (this.random() < this.wallChance) {
                    this.grid[y][x] = 1;
                }
            }
        }

        // Naturwände glätten
        for (let i = 0; i < 2; i++) {
            this.smoothWalls();
        }

        // 2. Bäume (ID 2) auf freien Wiesenplätzen verteilen
        for (let y = 1; y < this.height - 1; y++) {
            for (let x = 1; x < this.width - 1; x++) {
                if (this.grid[y][x] === 0 && this.random() < this.treeChance) {
                    this.grid[y][x] = 2; // Dunkelgrüner Baum
                }
            }
        }

        // 3. Häuser bauen (Wände = ID 3, Kisten im Inneren = ID 4)
        let housesBuilt = 0;
        let attempts = 0;
        while (housesBuilt < 4 && attempts < 80) {
            attempts++;
            const hW = 5;
            const hH = 5;
            const hX = Math.floor(this.random() * (this.width - hW - 4)) + 2;
            const hY = Math.floor(this.random() * (this.height - hH - 4)) + 2;

            if (this.isAreaClearForHouse(hX, hY, hW, hH)) {
                this.buildHouse(hX, hY, hW, hH);
                housesBuilt++;
            }
        }

        // 4. Sicherheitszone für den Spieler-Spawn (Kachel 1,1 bis 3,3 radikal freiräumen)
        for (let y = 1; y <= 3; y++) {
            for (let x = 1; x <= 3; x++) {
                this.grid[y][x] = 0;
            }
        }
    }

    smoothWalls() {
        const tempGrid = JSON.parse(JSON.stringify(this.grid));
        for (let y = 1; y < this.height - 1; y++) {
            for (let x = 1; x < this.width - 1; x++) {
                let wallNeighbors = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (this.grid[y + i][x + j] === 1) wallNeighbors++;
                    }
                }
                if (wallNeighbors >= 5) {
                    tempGrid[y][x] = 1;
                } else if (wallNeighbors < 2) {
                    tempGrid[y][x] = 0;
                }
            }
        }
        this.grid = tempGrid;
    }

    isAreaClearForHouse(startX, startY, w, h) {
        for (let y = startY - 1; y < startY + h + 1; y++) {
            for (let x = startX - 1; x < startX + w + 1; x++) {
                if (x <= 4 && y <= 4) return false;
                // Häuser dürfen nicht auf bestehenden Naturwänden landen
                if (this.grid[y][x] === 1) return false;
            }
        }
        return true;
    }

    buildHouse(startX, startY, w, h) {
        for (let y = startY; y < startY + h; y++) {
            for (let x = startX; x < startX + w; x++) {
                if (x === startX || x === startX + w - 1 || y === startY || y === startY + h - 1) {
                    this.grid[y][x] = 3; // NEU: Haus-Wand (Grau)
                } else {
                    // Inneres des Hauses: Wiese plätten (0) und mit Chance eine Kiste (4) spawnen
                    if (this.random() < 0.05) { // 25% Chance pro Kachel im Haus
                        this.grid[y][x] = 4; // NEU: Kiste (Gold)
                    } else {
                        this.grid[y][x] = 0;
                    }
                }
            }
        }
        // Eine Tür einbauen (Mitte der Südwand)
        const doorX = startX + Math.floor(w / 2);
        const doorY = startY + h - 1;
        this.grid[doorY][doorX] = 0; // Tür auf!
    }

    isWalkable(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return false;
        }
        const tile = this.grid[y][x];
        return tile === 0;
    }

    draw(ctx, camera) {
        const startX = Math.max(0, Math.floor(camera.x / this.tileSize));
        const startY = Math.max(0, Math.floor(camera.y / this.tileSize));
        const endX = Math.min(this.width, Math.ceil((camera.x + camera.width) / this.tileSize));
        const endY = Math.min(this.height, Math.ceil((camera.y + camera.height) / this.tileSize));

        const camX = Math.floor(camera.x);
        const camY = Math.floor(camera.y);

        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const screenX = x * this.tileSize - camX;
                const screenY = y * this.tileSize - camY;

                const tileType = this.grid[y][x];

                // Ändere die Abfrage oben drüber zu:
                if (this.texturesLoaded >= 5) {
                    ctx.drawImage(this.grassTexture, screenX, screenY, this.tileSize + 1, this.tileSize + 1);
                } else {
                    ctx.fillStyle = "#00c921";
                    ctx.fillRect(screenX, screenY, this.tileSize + 1, this.tileSize + 1);
                }

                // DER NEUE SWITCH-CASE-BLOCK:
                switch (tileType) {
                    case 1: // Natur-Wand (Brauner Fels)
                        if (this.texturesLoaded >= 5) {
                            ctx.drawImage(this.wallTexture, screenX, screenY, this.tileSize + 1, this.tileSize + 1);
                        } else {
                            ctx.fillStyle = "#443b1a";
                            ctx.fillRect(screenX, screenY, this.tileSize + 1, this.tileSize + 1);
                        }
                        break;

                    case 2: // Baum (Tanne auf der Wiese)
                        if (this.texturesLoaded >= 5) {
                            ctx.drawImage(this.treeTexture, screenX, screenY, this.tileSize + 1, this.tileSize + 1);
                        } else {
                            ctx.fillStyle = "#095313";
                            ctx.fillRect(screenX, screenY, this.tileSize + 1, this.tileSize + 1);
                        }
                        break;

                    case 3: // Haus-Wand (Graues Gemäuer)
                        if (this.texturesLoaded >= 5) {
                            ctx.drawImage(this.houseTexture, screenX, screenY, this.tileSize + 1, this.tileSize + 1);
                        } else {
                            ctx.fillStyle = "#737373";
                            ctx.fillRect(screenX, screenY, this.tileSize + 1, this.tileSize + 1);
                        }
                        break;

                    case 4: // Kiste im Haus (Holz/Gold Schatztruhe)
                        if (this.texturesLoaded >= 5) {
                            // Wir zeichnen die Kiste minimal kleiner, damit man den Boden des Hauses darunter sieht!
                            ctx.drawImage(
                                this.chestTexture,
                                screenX + 3,
                                screenY + 3,
                                this.tileSize - 5,
                                this.tileSize - 5
                            );
                        } else {
                            ctx.fillStyle = "#ca8a04";
                            ctx.fillRect(screenX + 4, screenY + 4, this.tileSize - 7, this.tileSize - 7);
                        }
                        break;
                }
            }
        }
    }
}
