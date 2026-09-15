export class Map {
    constructor() {
        this.tileSize = 40;

        // 1 = Wand (grau), 0 = Boden (begehbar)
        this.grid = [,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];

        this.height = this.grid.length;
        this.width = this.grid[0].length;
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
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // Berechne die Position auf dem Bildschirm
                const screenX = x * this.tileSize - camera.x;
                const screenY = y * this.tileSize - camera.y;

                if (this.grid[y][x] === 1) {
                    ctx.fillStyle = "#555"; // Wand
                } else {
                    ctx.fillStyle = "#222"; // Boden
                }

                ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                ctx.strokeStyle = "#333";
                ctx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);
            }
        }
    }
}
