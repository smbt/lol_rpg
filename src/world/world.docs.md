# World

Verwaltet die Spielwelt, Kamera und grafischen Texturen. Das World-Modul ist für die Darstellung und grundlegende Struktur der Spielkarte zuständig.

Zeilen: 518, Imports: 2, Attribute: 20, Funktionen: 13


# Camera.js (Klasse)

Verwaltet den sichtbaren Ausschnitt der Spielwelt und folgt der Position des Spielers.

Zeilen: 17, Imports: 0, Attribute: 4, Funktionen: 1

## Konstruktor

`constructor(width, height)` → `void`

## Attribute

`x`, `y`, `width`, `height`

## Funktionen

- `update(playerX, playerY, tileSize)` → `void`


# Map.js (Klasse)

Erzeugt und verwaltet die Spielwelt inklusive Terrain, Objekten, Häusern, Kollisionen und Darstellung. Die Karte trennt Terrain-Daten von Objekten und verwendet eine prozedurale Generierung mit festem Seed.

Zeilen: 488, Imports: 2, Attribute: 15, Funktionen: 12

## Konstruktor

`constructor()` → `void`

## Attribute

`tileSize`, `width`, `height`, `seed`, `wallChance`, `treeChance`, `rngState`, `grid`, `objects`, `texturesLoaded`, `grassTexture`, `wallTexture`, `treeTexture`, `houseTexture`, `chestTexture`

## Funktionen

- `random()` → `number`
- `generateProcedural()` → `void`
- `smoothWalls()` → `void`
- `isAreaClearForHouse(startX, startY, w, h)` → `boolean`
- `buildHouse(startX, startY, w, h)` → `void`
- `addObject(object)` → `void`
- `getObjectsAt(x, y)` → `Array`
- `getObjectAt(x, y, type)` → `Object | null`
- `removeObject(object)` → `void`
- `removeObjectsAt(x, y)` → `void`
- `isWalkable(x, y)` → `boolean`
- `draw(ctx, camera)` → `void`

## Refactoring? 
Viele Verantwortlichkeiten; bei weiterem Wachstum ggf. in WorldGenerator, ObjectManager und Renderer aufteilen.


# textures.js

Stellt die grafischen Texturen für Terrain und Weltobjekte als eingebettete SVG-Data-URLs bereit.

Zeilen: 13, Imports: 0, Attribute: 1, Funktionen: 0

## Attribute

`textures`