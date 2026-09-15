export class Player {
    constructor(startX, startY) {
        this.x = startX;
        this.y = startY;

        this.visualX = startX * 40;
        this.visualY = startY * 40;

        // Ein Status-Marker, um zu wissen, wann die Grafik bereit ist
        this.isLoaded = false;

        this.sprite = new Image();

        // Sobald die Datei fertig geladen ist, aktivieren wir den Marker
        this.sprite.onload = () => {
            this.isLoaded = true;
        };

        // Fehler abfangen, falls der Pfad doch mal falsch sein sollte
        this.sprite.onerror = () => {
            console.error("Fehler beim Laden des Spieler-SVGs unter: " + this.sprite.src);
        };

        // Dein genutzter Pfad
        this.sprite.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="40" height="40" shape-rendering="crispEdges">
    <rect x="2" y="1" width="4" height="2" fill="#643b0f"/>
    <rect x="2" y="2" width="4" height="2" fill="#ffdbac"/>
    <rect x="3" y="2" width="1" height="1" fill="#000"/>
    <rect x="5" y="2" width="1" height="1" fill="#000"/>
    <rect x="2" y="4" width="4" height="3" fill="#1d4ed8"/>
    <rect x="1" y="5" width="1" height="1" fill="#ffdbac"/>
    <rect x="6" y="5" width="1" height="1" fill="#ffdbac"/>
    <rect x="2" y="7" width="1" height="1" fill="#374151"/>
    <rect x="5" y="7" width="1" height="1" fill="#374151"/>
</svg>`);

        //   this.sprite.src = 'src/assets/entities/player.svg';
    }

    interpolate(targetPixelX, targetPixelY, lerpSpeed) {
        this.visualX += (targetPixelX - this.visualX) * lerpSpeed;
        this.visualY += (targetPixelY - this.visualY) * lerpSpeed;
    }

    draw(ctx, camX, camY, tileSize) {
        const screenX = Math.floor(this.visualX) - camX;
        const screenY = Math.floor(this.visualY) - camY;

        if (this.isLoaded) {
            // Wenn das SVG fertig geladen ist -> Schön zeichnen!
            ctx.drawImage(
                this.sprite,
                screenX + 2,
                screenY + 2,
                tileSize - 4,
                tileSize - 4
            );
        } else {
            // Sicherheitsnetz: Solange das Bild lädt, zeichnen wir ein rotes Quadrat
            // Das verhindert den "broken state"-Absturz im ersten Frame!
            ctx.fillStyle = "red";
            ctx.fillRect(
                screenX + 4,
                screenY + 4,
                tileSize - 8,
                tileSize - 8
            );
        }
    }
}
