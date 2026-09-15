export class Map {
    constructor() {
        this.tileSize = 40;

        // Reparierter Hack: Wir nutzen Strings, damit das Array nicht verschluckt wird
        const mapStrings = [
            "111111111111111",
            "100000100000001",
            "100000101111101",
            "100000001000101",
            "100000000010101",
            "100010000010001",
            "111010000011101",
            "100000101000101",
            "101111101110101",
            "101000000010001",
            "101011111011101",
            "100010001000101",
            "111110101110101",
            "100000100000001",
            "111111111111111"
        ];

        // Wir wandeln die Strings in ein echtes 2D-Array aus Zahlen um
        this.grid = mapStrings.map(zeile =>
            zeile.split('').map(zeichen => parseInt(zeichen, 10))
        );

        this.height = this.grid.length;      // 15 Zeilen
        this.width = this.grid[0].length;    // 15 Spalten
    }

    // Prüft, ob eine Ziel-Koordinate begehbar ist
    isWalkable(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return false; // Außerhalb der Map
        }
        return this.grid[y][x] === 0;
    }

    // Zeichnet die Map unter Berücksichtigung des Kamera-Offsets
    draw(ctx, camera) {
        // 1. Zuerst die Kamera-Werte komplett auf glatte Pixel runden
        const camX = Math.floor(camera.x);
        const camY = Math.floor(camera.y);

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // Bildschirm-Position mit der gerundeten Kamera berechnen
                const screenX = x * this.tileSize - camX;
                const screenY = y * this.tileSize - camY;

                if (this.grid[y][x] === 1) {
                    ctx.fillStyle = "#443b1a"; // Wand
                } else {
                    ctx.fillStyle = "#00c921"; // Boden
                }

                // DIE RETTUNG: +1 Pixel bei Breite und Höhe hinzufügen (Überlappung)
                ctx.fillRect(screenX, screenY, this.tileSize + 1, this.tileSize + 1);
            }
        }
    }
}
