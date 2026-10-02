# Core

Zentrale Systeme des Spiels. Das Core-Modul enthält die Spielsteuerung, Eingabeverarbeitung, Audioverwaltung und UI-Anbindung.


# Game.js (Klasse)

Zentrale Steuerung des Spiels. Initialisiert die Spielsysteme, verwaltet den Game Loop, verarbeitet Eingaben, aktualisiert den Spielzustand und zeichnet die aktuelle Spielsituation.

Zeilen: 82, Imports: 7, Attribute: 11, Funktionen: 4

## Imports

`Input`, `Map`, `Camera`, `Sound`, `Player`, `UI`, `constants`

## Konstruktor

`constructor(canvasId)` → `void`

## Attribute

`canvas`, `ctx`, `input`, `map`, `camera`, `sound`, `ui`, `player`, `lerpSpeed`, `lastMoveTime`, `moveCooldown`

## Funktionen

- `handleResize(newWidth, newHeight)` → `void`
- `start()` → `void`
- `update(timestamp)` → `void`
- `draw()` → `void`


# Input.js (Klasse)

Verarbeitet Tastatur- und Touch-Eingaben und stellt eine einheitliche Schnittstelle für die Spiellogik bereit.

Zeilen: 126, Imports: 0, Attribute: 13, Funktionen: 5

## Konstruktor

`constructor()` → `void`

## Attribute

`keys`, `virtualDpad`, `touchId`, `startX`, `startY`, `threshold`, `joyBase`, `joyKnob`, `moveTouchId`, `touchTimer`, `isHoldMode`, `onInteraction`, `onTap`

## Funktionen

- `initKeyboard()` → `void`
- `initTouch()` → `void`
- `showJoystick(x, y)` → `void`
- `handleTapAction(screenX, screenY)` → `void`
- `isPressed(direction)` → `boolean`


# Sound.js (Klasse)

Verwaltet Schritt- und Treffergeräusche sowie die Hintergrundmusik und deren Wiedergabe-Kontext.

Zeilen: 91, Imports: 0, Attribute: 8, Funktionen: 6

## Konstruktor

`constructor()` → `void`

## Attribute

`grassSteps`, `currentStepIndex`, `musicTracks`, `musicContext`, `musicPlaylist`, `currentMusicIndex`, `music`, `musicStarted`

## Funktionen

- `createMusicPlaylist()` → `void`
- `startMusic()` → `void`
- `playNextMusic()` → `void`
- `setMusicContext(context)` → `void`
- `playStep()` → `void`
- `playHit()` → `void`


# UI.js (Klasse)

Verwaltet die Anzeige von Spielerwerten im HTML-UI, aktuell HP und EP.

Zeilen: 17, Imports: 0, Attribute: 2, Funktionen: 2

## Konstruktor

`constructor()` → `void`

## Attribute

`hpElement`, `epElement`

## Funktionen

- `updateHP(current, max)` → `void`
- `updateEP(current, max)` → `void`