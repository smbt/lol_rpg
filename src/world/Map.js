export class Map {
    constructor() {
        this.tileSize = 40;

        // --- KONFIGURATION (Hier kannst du alles frei einstellen!) ---
        this.width = 64;   // Breite des Rasters (frei anpassbar)
        this.height = 64;  // Höhe des Rasters (frei anpassbar)
        this.seed = 12345;  // Der Map-Seed. Gleiche Zahl = Exakt gleiche Map!

        // Wahrscheinlichkeit für lose Wände auf der Wiese (0.05 = 5%)
        this.wallChance = 0.06;
        // --------------------------------------------------------------

        // Unser eigener kontrollierbarer Zufallsgenerator (Seed-basiert)
        this.rngState = this.seed;

        // 2D-Array initialisieren (Standardmäßig alles Wiese = 0)
        this.grid = Array(this.height).fill(null).map(() => Array(this.width).fill(0));

        // Starte die prozedurale Generierung
        this.generateProcedural();
    }

    /**
     * Ein deterministischer Zufallsgenerator (LCG).
     * Gibt einen Wert zwischen 0.0 und 1.0 zurück, basierend auf dem aktuellen Seed-Status.
     */
    random() {
        this.rngState = (this.rngState * 1664525 + 1013904223) % 4294967296;
        return this.rngState / 4294967296;
    }

    /**
     * Erstellt die komplette Welt
     */
    generateProcedural() {
        // 1. Ränder als Wände setzen & vereinzelte Hindernisse würfeln
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // Wenn es der Rand ist -> Immer Wand (1)
                if (x === 0 || y === 0 || x === this.width - 1 || y === this.height - 1) {
                    this.grid[y][x] = 1;
                }
                // Ansonsten zufällige einzelne Wand-Teile/Büsche mit geringer Chance
                else if (this.random() < this.wallChance) {
                    this.grid[y][x] = 1;
                }
            }
        }

        // 2. Zusammenhängende Wand-Teile erzeugen (Glättungs-Durchgang)
        // Wenn ein Feld viele Nachbarn hat, die Wände sind, wird es auch zur Wand.
        for (let i = 0; i < 2; i++) { // 2 Durchgänge für schöne organische Klumpen
            this.smoothWalls();
        }

        // 3. Häuser bauen (Wir versuchen 4 Häuser auf der Map zu platzieren)
        let housesBuilt = 0;
        let attempts = 0;

        while (housesBuilt < 4 && attempts < 50) {
            attempts++;
            // Zufällige Position für die obere linke Ecke des Hauses würfeln
            const hW = 5; // Haus-Breite (festgelegt auf 5 Kacheln)
            const hH = 5; // Haus-Höhe

            const hX = Math.floor(this.random() * (this.width - hW - 4)) + 2;
            const hY = Math.floor(this.random() * (this.height - hH - 4)) + 2;

            // Prüfen, ob der Platz um das Haus herum frei von anderen Wänden/Rändern ist
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

    /**
     * Lässt lose Wände zu größeren, zusammenhängenden Felsen/Hecken verschmelzen
     */
    smoothWalls() {
        const tempGrid = JSON.parse(JSON.stringify(this.grid));

        for (let y = 1; y < this.height - 1; y++) {
            for (let x = 1; x < this.width - 1; x++) {
                let wallNeighbors = 0;

                // Zähle alle 8 Nachbarkacheln
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (this.grid[y + i][x + j] === 1) wallNeighbors++;
                    }
                }

                // Wenn zu viele Wände drumherum sind, klumpe sie zusammen
                if (wallNeighbors >= 5) {
                    tempGrid[y][x] = 1;
                } else if (wallNeighbors < 2) {
                    tempGrid[y][x] = 0;
                }
            }
        }
        this.grid = tempGrid;
    }

    /**
     * Prüft, ob ein Bereich flach genug ist, um ein Haus zu bauen
     */
    isAreaClearForHouse(startX, startY, w, h) {
        for (let y = startY - 1; y < startY + h + 1; y++) {
            for (let x = startX - 1; x < startX + w + 1; x++) {
                // Wenn wir den Spawn-Punkt des Spielers kreuzen, hier kein Haus bauen!
                if (x <= 4 && y <= 4) return false;
            }
        }
        return true;
    }

    /**
     * Stanzt ein begehbares Haus mit Wänden und einer Tür in das Grid
     */
    buildHouse(startX, startY, w, h) {
        for (let y = startY; y < startY + h; y++) {
            for (let x = startX; x < startX + w; x++) {
                // Ränder des Hauses werden zu Wänden (1)
                if (x === startX || x === startX + w - 1 || y === startY || y === startY + h - 1) {
                    this.grid[y][x] = 1;
                } else {
                    this.grid[y][x] = 0; // Das Innere ist begehbarer Boden!
                }
            }
        }
        // Eine Tür einbauen (Wir machen die Kachel in der Mitte der Südwand auf!)
        const doorX = startX + Math.floor(w / 2);
        const doorY = startY + h - 1;
        this.grid[doorY][doorX] = 0; // Tür auf!
    }

    isWalkable(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return false;
        }
        return this.grid[y][x] === 0;
    }

    draw(ctx, camera) {
        // OPTIMIERUNG (Frustum Culling): 
        // Wir berechnen, welche Kacheln überhaupt gerade auf dem Bildschirm sichtbar sind.
        // Das verhindert, dass JavaScript bei einer 64x64 Map alle 4096 Kacheln zeichnet!
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

                if (this.grid[y][x] === 1) {
                    ctx.fillStyle = "#443b1a"; // Deine braune Wand
                } else {
                    ctx.fillStyle = "#00c921"; // Deine grüne Wiese
                }

                ctx.fillRect(screenX, screenY, this.tileSize + 1, this.tileSize + 1);
            }
        }
    }
}
