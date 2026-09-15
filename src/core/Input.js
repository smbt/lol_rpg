export class Input {
    constructor() {
        this.keys = {};

        // Lausche auf gedrückte Tasten
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;

            // Verhindert das Scrollen des Browsers bei Pfeiltasten & Leertaste
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
        });

        // Lösche Taste, wenn sie losgelassen wird
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    /**
     * Prüft, ob eine bestimmte Taste gerade gedrückt ist.
     * @param {string} key - Der Name der Taste (z.B. 'ArrowUp' oder 'w')
     */
    isPressed(key) {
        return !!this.keys[key];
    }
}
