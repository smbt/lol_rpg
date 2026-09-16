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
        // Berührung startet: Joystick positionieren und einblenden
        window.addEventListener('touchstart', (e) => {
            if (this.touchId !== null) return; // Nur einen Touch-Point erlauben

            const touch = e.changedTouches[0];

            // Ignoriere Touch, wenn er auf UI-Buttons (wie Menü/Karte) landet
            if (touch.target.closest('#ui-layer') && touch.target.tagName === 'BUTTON') return;

            this.touchId = touch.identifier;
            this.startX = touch.clientX;
            this.startY = touch.clientY;

            // Platziere das D-Pad exakt unter dem Finger
            if (this.joyBase) {
                this.joyBase.style.left = `${this.startX}px`;
                this.joyBase.style.top = `${this.startY}px`;
                this.joyBase.style.display = 'block';
            }
        }, { passive: false });

        // Bewegung des Fingers: Richtung berechnen
        window.addEventListener('touchmove', (e) => {
            if (this.touchId === null) return;

            // Finde den aktiven Touch-Point
            const touch = Array.from(e.touches).find(t => t.identifier === this.touchId);
            if (!touch) return;

            const dx = touch.clientX - this.startX;
            const dy = touch.clientY - this.startY;

            // Joystick-Knob visuell bewegen (begrenzt auf den Radius der Base)
            const angle = Math.atan2(dy, dx);
            const distance = Math.min(Math.hypot(dx, dy), 40); // 40px maximaler Ausschlag
            if (this.joyKnob) {
                const knobX = Math.cos(angle) * distance;
                const knobY = Math.sin(angle) * distance;
                this.joyKnob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;
            }

            // Richtungs-Flags zurücksetzen
            this.virtualDpad.up = false;
            this.virtualDpad.down = false;
            this.virtualDpad.left = false;
            this.virtualDpad.right = false;

            // Auswertung über Schwellenwert (Threshold)
            if (Math.abs(dx) > this.threshold || Math.abs(dy) > this.threshold) {
                // Erlaubt auch diagonales Ziehen, falls gewünscht. 
                // Für strikt orthogonale Schritte kann der dominante Vektor geprüft werden.
                if (dy < -this.threshold) this.virtualDpad.up = true;
                if (dy > this.threshold) this.virtualDpad.down = true;
                if (dx < -this.threshold) this.virtualDpad.left = true;
                if (dx > this.threshold) this.virtualDpad.right = true;
            }
        }, { passive: false });

        // Finger wird abgehoben: Joystick ausblenden & Flags resetten
        window.addEventListener('touchend', (e) => {
            const touch = Array.from(e.changedTouches).find(t => t.identifier === this.touchId);
            if (!touch) return;

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
