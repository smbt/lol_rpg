export class Map {
    constructor() {
        this.tileSize = 40;

        // --- KONFIGURATION ---
        this.width = 64;
        this.height = 64;
        this.seed = 124345;
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
        this.grassTexture.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="8" height="8" shape-rendering="crispEdges">
   <!-- Basis-Wiese (Mittleres Grün) -->
    <rect x="0" y="0" width="8" height="8" fill="#00c921"/>
    
    <!-- Dunkle Schatten-Punkte (Bringen Tiefe zwischen die Halme) -->
    <rect x="0" y="2" width="1" height="1" fill="#1dad35"/>
    <rect x="3" y="0" width="1" height="1" fill="#1dad35"/>
    <rect x="5" y="4" width="1" height="1" fill="#1dad35"/>
    <rect x="2" y="7" width="1" height="1" fill="#1dad35"/>
    <rect x="7" y="6" width="1" height="1" fill="#1dad35"/>

    <!-- Helle Halm-Spitzen (Simulieren Licht auf den Grashalmen) -->
    <rect x="1" y="1" width="1" height="2" fill="#26e344"/>
    <rect x="4" y="0" width="1" height="1" fill="#26e344"/>
    <rect x="3" y="4" width="2" height="1" fill="#26e344"/>
    <rect x="6" y="3" width="1" height="2" fill="#26e344"/>
    <rect x="1" y="6" width="2" height="1" fill="#26e344"/>
    <rect x="5" y="7" width="1" height="1" fill="#26e344"/>
</svg>`);

        // 2. Das Stein-Muster
        this.wallTexture.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="8" height="8" shape-rendering="crispEdges">
    <!-- Fels-Hintergrund (Mittleres Naturstein-Braun) -->
    <rect x="0" y="0" width="8" height="8" fill="#443b1a"/>
    
    <!-- Tiefen & Risse (Dunkle Schatten für unregelmäßige Steinkanten) -->
    <rect x="1" y="2" width="2" height="1" fill="#241f0d"/>
    <rect x="3" y="1" width="1" height="3" fill="#241f0d"/>
    <rect x="5" y="4" width="3" height="1" fill="#241f0d"/>
    <rect x="4" y="5" width="1" height="2" fill="#241f0d"/>
    <rect x="0" y="6" width="3" height="1" fill="#241f0d"/>
    <rect x="6" y="0" width="1" height="2" fill="#241f0d"/>

    <!-- Stein-Wölbungen (Helle Akzente, die wie hervorstehende Felsen wirken) -->
    <rect x="1" y="0" width="2" height="1" fill="#5e5225"/>
    <rect x="0" y="1" width="1" height="2" fill="#5e5225"/>
    <rect x="4" y="2" width="2" height="2" fill="#5e5225"/>
    <rect x="1" y="4" width="3" height="1" fill="#5e5225"/>
    <rect x="2" y="5" width="1" height="1" fill="#5e5225"/>
    <rect x="5" y="6" width="2" height="1" fill="#5e5225"/>
</svg>`);

        this.treeTexture.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="8" height="8" shape-rendering="crispEdges">
    <!-- Baumkrone oben (Helles Grün) -->
    <rect x="3" y="1" width="2" height="2" fill="#15803d"/>
    <!-- Mittlerer Stamm/Blätter (Kräftiges Grün) -->
    <rect x="2" y="3" width="4" height="2" fill="#166534"/>
    <!-- Breite Basis unten (Dunkles Tannen-Grün) -->
    <rect x="1" y="5" width="6" height="2" fill="#14532d"/>
    <!-- Der sichtbare Stamm ganz unten (Holz-Braun) -->
    <rect x="3" y="7" width="2" height="1" fill="#78350f"/>
    <!-- Schattenwurf auf den Stamm (Dunkelbraun) -->
    <rect x="3" y="7" width="1" height="1" fill="#451a03"/>
</svg>`);


        this.houseTexture.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="8" height="8" shape-rendering="crispEdges">
    <!-- Basis-Mauerwerk (Sattes Dunkelgrau) -->
    <rect x="0" y="0" width="8" height="8" fill="#4b5563"/>
    
    <!-- Tiefen & Fugen (Sehr dunkles Anthrazit) -->
    <rect x="0" y="3" width="8" height="1" fill="#1f2937"/>
    <rect x="4" y="0" width="1" height="3" fill="#1f2937"/>
    <rect x="2" y="4" width="1" height="4" fill="#1f2937"/>
    
    <!-- Highlights / Kanten (Mittleres Grau für den 3D-Effekt) -->
    <rect x="0" y="0" width="8" height="1" fill="#6b7280"/>
    <rect x="0" y="4" width="8" height="1" fill="#6b7280"/>
</svg>`);

        this.chestTexture.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="8" height="8" shape-rendering="crispEdges">
    <!-- Schwarzer Außenrahmen für den knackigen Retro-Look -->
    <rect x="0" y="0" width="8" height="8" fill="#472c19"/>
    
    <!-- Roter Samt/Holz-Korpus (Zentrum der Kiste) -->
    <rect x="2" y="1" width="4" height="3" fill="#b91c1c"/> <!-- Helles Rot oben -->
    <rect x="2" y="4" width="4" height="3" fill="#7f1d1d"/> <!-- Dunkles Rot unten -->
    <rect x="3" y="1" width="1" height="6" fill="#991b1b"/> <!-- Mittlerer Schatten-Streifen -->

    <!-- Goldene Beschläge links und rechts -->
    <rect x="1" y="1" width="1" height="6" fill="#d97706"/> <!-- Warmes Gold -->
    <rect x="6" y="1" width="1" height="6" fill="#b45309"/> <!-- Dunkleres Gold rechts (Schatten) -->
    
    <!-- Horizontale goldene Zierleiste (Trennlinie Deckel/Boden) -->
    <rect x="1" y="3" width="6" height="1" fill="#f59e0b"/> <!-- Glänzendes Gold -->
    
    <!-- Großes goldenes Schloss in der Mitte -->
    <rect x="3" y="3" width="2" height="2" fill="#fbbf24"/> <!-- Schloss-Platte -->
    <rect x="4" y="4" width="1" height="1" fill="#1c1917"/> <!-- Schlüsselloch -->
</svg>`);


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
