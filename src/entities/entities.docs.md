# Entities

Verwaltet die im Spiel vorhandenen Spielfiguren und zukünftig weitere bewegliche oder interaktive Lebewesen.

Zeilen: 66, Imports: 0, Attribute: 6, Funktionen: 2


# Entity.js

Aktuell leer. Vorgesehen als mögliche gemeinsame Basisklasse für Spielfiguren und andere Entities.

Zeilen: 0, Imports: 0, Attribute: 0, Funktionen: 0


# Monster.js

Aktuell leer. Vorgesehen für die Implementierung von Monstern und deren Verhalten.

Zeilen: 0, Imports: 0, Attribute: 0, Funktionen: 0


# Player.js (Klasse)

Repräsentiert den Spieler. Verwaltet seine Grid-Position, die visuelle Position für flüssige Bewegung sowie das Laden und Zeichnen seines Sprites.

Zeilen: 66, Imports: 0, Attribute: 6, Funktionen: 2

## Konstruktor

`constructor(startX, startY)` → `void`

## Attribute

`x`, `y`, `visualX`, `visualY`, `isLoaded`, `sprite`

## Funktionen

- `interpolate(targetPixelX, targetPixelY, lerpSpeed)` → `void`
- `draw(ctx, camX, camY, tileSize)` → `void`