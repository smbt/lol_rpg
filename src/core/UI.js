export class UI {
    constructor() {
        // Wir fangen uns die HTML-Anzeige-Elemente aus der index.html
        this.hpElement = document.getElementById('ui-hp');
        this.epElement = document.getElementById('ui-ep');
    }

    updateHP(current, max) {
        if (this.hpElement) {
            this.hpElement.textContent = current + "/" + max;
        }
    }

    updateEP(current, max) {
        if (this.epElement) {
            this.epElement.textContent = current + "/" + max;
        }
    }
}
