# Game.js (Klasse)

Zentrale Steuerung des Spiels. Initialisiert die Spielsysteme,
verwaltet den Game Loop, verarbeitet Eingaben, aktualisiert den
Spielzustand und zeichnet die aktuelle Spielsituation.

## Imports

`Input`, `Map`, `Camera`, `Sound`, `Player`, `UI`, `constants`

## Konstruktor

`constructor(canvasId)` → `void`

## Attribute

`canvas`, `ctx`, `input`, `map`, `camera`, `sound`, `ui`, `player`,
`lerpSpeed`, `lastMoveTime`, `moveCooldown`

## Funktionen

- `handleResize(newWidth, newHeight)` → `void`
- `start()` → `void`
- `update(timestamp)` → `void`
- `draw()` → `void`



# Input.js (Klasse)

Verarbeitet Tastatur- und Touch-Eingaben und stellt eine einheitliche Schnittstelle für die Spiellogik bereit.

## Konstruktor

`constructor()` → `void`

## Attribute

`keys`, `virtualDpad`, `touchId`, `startX`, `startY`, `threshold`, `joyBase`, `joyKnob`, `moveTouchId`, `touchTimer`, `isHoldMode`, `onInteraction`

## Funktionen

- `initKeyboard()` → `void`
- `initTouch()` → `void`
- `showJoystick(x, y)` → `void`
- `handleTapAction(screenX, screenY)` → `void`
- `isPressed(direction)` → `boolean`


# Sound.js (Klasse)

Verwaltet Schritt- und Treffergeräusche sowie die Hintergrundmusik und deren Wiedergabe-Kontext.

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

## Konstruktor

`constructor()` → `void`

## Attribute

`hpElement`, `epElement`

## Funktionen

- `updateHP(current, max)` → `void`
- `updateEP(current, max)` → `void`