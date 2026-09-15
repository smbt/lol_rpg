export class Camera {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;   // Breite des Canvas (Sichtfenster)
        this.height = height; // Höhe des Canvas
    }

    // Folgt der Pixel-Position des Spielers
    update(playerX, playerY, tileSize) {
        // Berechne das Zentrum des Spielers in Pixeln
        const playerCenterX = playerX * tileSize + tileSize / 2;
        const playerCenterY = playerY * tileSize + tileSize / 2;

        // Verschiebe die Kamera so, dass dieses Zentrum in der Mitte des Canvas liegt
        this.x = playerCenterX - this.width / 2;
        this.y = playerCenterY - this.height / 2;
    }
}
