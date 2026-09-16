# Spieldokumentation: Event-Wege & Steuerungs-Ablauf
last edited: 2026-09-16

## 1. Desktop: Tastatur-Steuerung
1. **Der Tastendruck (Start):** Der Spieler drückt eine Bewegungstaste (z. B. `W` oder `ArrowUp`).
2. **Abfangen im Input-System:** 
   * **Datei:** `src/core/Input.js`
   * **Funktion/Ort:** `initKeyboard()` (wird im `constructor` geladen)
   * **Ablauf:** Der `window.addEventListener('keydown')` springt an. Er speichert die gedrückte Taste in einer Liste (`this.keys[e.key] = true`). Falls es eine Pfeiltaste oder Leertaste war, verhindert `e.preventDefault()`, dass der Webbrowser die Seite scrollt.
3. **Abfrage im Spiel-Loop (Bewegung):**
   * **Datei:** `src/core/Game.js`
   * **Funktion/Ort:** `update(timestamp)`
   * **Ablauf:** Die Update-Funktion läuft ununterbrochen. Sie fragt über `this.input.isPressed('up')` ab, ob die Richtung aktiv ist.
4. **Ausführung der Aktion:**
   * **Datei:** `src/core/Game.js` (in `update()`)
   * **Ablauf:** Wenn der Cooldown abgelaufen ist und das Zielfeld begehbar ist (`this.map.isWalkable()`), werden die Koordinaten der Spielfigur (`this.player.x/y`) geändert und der Schritt-Sound (`this.sound.playStep()`) abgespielt.
5. **Taste loslassen (Reset):** Der `window.addEventListener('keyup')` in der `Input.js` löscht die Taste wieder aus der Liste (`this.keys[e.key] = false`).

---

## 2. Mobile: Touch-Steuerung (Laufen & Angreifen)
1. **Bildschirm berühren (Start):** Der Spieler tippt oder drückt auf den Bildschirm.
2. **Berührung registrieren:**
   * **Datei:** `src/core/Input.js`
   * **Funktion/Ort:** `initTouch()` (wird im `constructor` geladen)
   * **Ablauf:** Der `window.addEventListener('touchstart')` springt an. Er merkt sich die Start-Finger-Position (`this.startX/Y`) und startet einen Timer (`setTimeout`) von 150 Millisekunden.
3. **Zwei mögliche Wege (Laufen oder Angreifen):**

   * **Weg A: Der Spieler will LAUFEN (Hold / Drag)**
     * **Datei:** `src/core/Input.js`
     * **Funktion/Ort:** `initTouch()` -> `touchmove`-Listener
     * **Ablauf:** Wenn der Finger länger als 150ms liegen bleibt ODER sich direkt bewegt, schaltet das System auf Bewegung um. Das Steuerkreuz im UI (`joystick-base`) wird eingeblendet. Während der Finger wischt, berechnet das System die Richtung und setzt die Flags (`this.virtualDpad.up = true` usw.).
     * **Aktion im Spiel:** Genau wie bei der Tastatur holt sich `Game.js` in `update()` diese Flags über `this.input.isPressed('up')` ab und bewegt den Spieler im Grid weiter.

   * **Weg B: Der Spieler will ANGRIEFEN (Einfacher Tap)**
     * **Datei:** `src/core/Input.js`
     * **Funktion/Ort:** `initTouch()` -> `touchend`-Listener
     * **Ablauf:** Wenn der Finger in weniger als 150ms wieder abgehoben wird, ohne dass er sich groß bewegt hat, wird der Timer gestoppt und die Funktion `handleTapAction()` aufgerufen.
     * **Weiterleitung an das Spiel:** `handleTapAction()` ruft eine vordefinierte Verbindung (`this.onTap()`) auf, die wir in der `main.js` mit dem Spiel verknüpft haben.
     * **Aktion im Spiel:** In `main.js` (innerhalb von `DOMContentLoaded`) fängt die Logik diesen Aufruf ab und sagt dem Sound-System Bescheid. In `src/core/Sound.js` wird die Funktion `playHit()` ausgeführt, die sofort die Sounddatei `hit30.mp3.flac` abspielt.

4. **Multitouch (Gleichzeitig laufen und angreifen):**
   * Wenn der Lauf-Finger (erste ID) bereits aktiv ist und ein zweiter Finger den Bildschirm berührt, springt in `Input.js` der `touchstart`-Listener erneut an. Er erkennt, dass der Lauf-Finger besetzt ist, überspringt den Timer und feuert für den zweiten Finger sofort `handleTapAction()`. Dadurch wird der Sound abgespielt, während man weiterläuft.

---

## 3. UI-Layer: Vollbild-Button
1. **Button drücken (Start):** Der Spieler tippt oben rechts auf das Ecken-Icon.
2. **Klick abfangen:**
   * **Datei:** `main.js`
   * **Funktion/Ort:** `handleFullScreenBtn()`
   * **Ablauf:** Der `fullscreenBtn.addEventListener('pointerup')` löst aus. `e.stopPropagation()` sorgt dafür, dass dieser Touch nicht nach unten zum Spiel-Canvas durchrutscht. Der Code prüft, ob das Spiel im Vollbild ist oder nicht, und fordert das Vollbild vom Browser an (`requestFullscreen()`).
3. **Größenänderung verarbeiten:**
   * **Datei:** `main.js`
   * **Funktion/Ort:** `onFullscreenChange()`
   * **Ablauf:** Der Browser wechselt ins Vollbild und feuert das automatische Event `fullscreenchange`. Die Funktion `onFullscreenChange()` reagiert darauf, tauscht die SVG-Pfeilspitzen im HTML aus und ruft die Funktion `resizeGame()` auf.
4. **Ausführung der Aktion (Canvas-Skalierung):**
   * **Datei:** `main.js` (in `resizeGame()`)
   * **Ablauf:** Das Canvas holt sich die exakte neue Bildschirmbreite und -höhe (`canvas.clientWidth/Height`). Diese neuen Maße werden sofort an `game.handleResize()` übergeben. Die Kamera im Spiel berechnet das Sichtfeld neu, damit nichts verzerrt oder abgeschnitten wird.
