export class Input {
    constructor() {
        this.keys = {};

        // Virtuelle Achsen für die Touch-Steuerung
        this.virtualDpad = { up: false, down: false, left: false, right: false };

        // Touch-Tracking-Variablen
        this.touchId = null;
        this.startX = 0;
        this.startY = 0;
        this.threshold = 20; // Mindestabstand in Pixeln, ab dem eine Bewegung als Schritt zählt

        // DOM-Elemente für den visuellen Joystick
        this.joyBase = document.getElementById('joystick-base');
        this.joyKnob = document.getElementById('joystick-knob');

        this.initKeyboard();
        this.initTouch();
    }

    initKeyboard() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    initTouch() {
        // Timer für die Unterscheidung zwischen Tap und Hold
        this.touchTimer = null;
        this.isHoldMode = false;

        window.addEventListener('touchstart', (e) => {
            if (this.touchId !== null) return;

            const touch = e.changedTouches[0];

            if (e.target.closest('#ui-layer') && ['BUTTON', 'A'].includes(e.target.tagName)) return;

            // Browser-Standardverhalten für Gesten blockieren
            e.preventDefault();

            this.touchId = touch.identifier;
            this.startX = touch.clientX;
            this.startY = touch.clientY;
            this.isHoldMode = false;

            // Starte einen Timer: Wenn der Finger 150ms verbleibt, aktiviere das D-Pad
            this.touchTimer = setTimeout(() => {
                this.isHoldMode = true;
                this.showJoystick(this.startX, this.startY);
            }, 150); // Zeitfenster in Millisekunden

        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (this.touchId === null) return;
            e.preventDefault();

            const touch = Array.from(e.touches).find(t => t.identifier === this.touchId);
            if (!touch) return;

            const dx = touch.clientX - this.startX;
            const dy = touch.clientY - this.startY;

            // Falls sich der Finger vor Ablauf der 150ms signifikant bewegt, 
            // erzwingen wir sofort den Hold/Drag-Modus (Spieler wischt direkt los)
            if (!this.isHoldMode && (Math.abs(dx) > this.threshold || Math.abs(dy) > this.threshold)) {
                clearTimeout(this.touchTimer);
                this.isHoldMode = true;
                this.showJoystick(this.startX, this.startY);
            }

            // Richtungsverarbeitung nur im Hold-Modus
            if (this.isHoldMode) {
                const angle = Math.atan2(dy, dx);
                const distance = Math.min(Math.hypot(dx, dy), 40);

                if (this.joyKnob) {
                    const knobX = Math.cos(angle) * distance;
                    const knobY = Math.sin(angle) * distance;
                    this.joyKnob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;
                }

                this.virtualDpad.up = dy < -this.threshold;
                this.virtualDpad.down = dy > this.threshold;
                this.virtualDpad.left = dx < -this.threshold;
                this.virtualDpad.right = dx > this.threshold;
            }
        }, { passive: false });

        window.addEventListener('touchend', (e) => {
            const touch = Array.from(e.changedTouches).find(t => t.identifier === this.touchId);
            if (!touch) return;

            // Timer stoppen, falls der Finger vor den 150ms angehoben wurde
            clearTimeout(this.touchTimer);

            // AUSWERTUNG: War es ein einfacher Tap?
            if (!this.isHoldMode) {
                this.handleTapAction(this.startX, this.startY);
            }

            // Reset für den nächsten Touch
            this.touchId = null;
            this.virtualDpad.up = false;
            this.virtualDpad.down = false;
            this.virtualDpad.left = false;
            this.virtualDpad.right = false;

            if (this.joyBase) this.joyBase.style.display = 'none';
            if (this.joyKnob) this.joyKnob.style.transform = 'translate(-50%, -50%)';
        });
    }

    /**
     * Hilfsmethode zum Einblenden und Platzieren des Steuerkreuzes
     */
    showJoystick(x, y) {
        if (this.joyBase) {
            this.joyBase.style.left = `${x}px`;
            this.joyBase.style.top = `${y}px`;
            this.joyBase.style.display = 'block';
        }
    }

    /**
     * Wird gefeuert, wenn der Spieler nur kurz auf den Screen getappt hat
     */
    handleTapAction(screenX, screenY) {
        console.log(`Einfacher Tap registriert bei Pixel-X: ${screenX}, Pixel-Y: ${screenY}`);
        if (typeof this.onTap === 'function') {
            this.onTap();
        }

    }


    /**
     * Prüft, ob eine Taste gedrückt ist ODER das virtuelle D-Pad in diese Richtung zeigt.
     */
    isPressed(direction) {
        if (direction === 'up') return this.keys['ArrowUp'] || this.keys['w'] || this.virtualDpad.up;
        if (direction === 'down') return this.keys['ArrowDown'] || this.keys['s'] || this.virtualDpad.down;
        if (direction === 'left') return this.keys['ArrowLeft'] || this.keys['a'] || this.virtualDpad.left;
        if (direction === 'right') return this.keys['ArrowRight'] || this.keys['d'] || this.virtualDpad.right;

        return !!this.keys[direction];
    }
}
