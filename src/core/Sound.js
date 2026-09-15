export class Sound {
    constructor() {
        // Wir laden beide FLAC-Dateien direkt im Hintergrund vor
        this.grassSteps = [
            new Audio('src/assets/sounds/sfx_step_grass_l.flac'),
            new Audio('src/assets/sounds/sfx_step_grass_r.flac')
        ];

        // Lautstärke für beide Dateien dezent einstellen (0.0 bis 1.0)
        this.grassSteps.forEach(sound => {
            sound.volume = 0.4;
        });

        // Ein Zeiger, der sich merkt, welcher Fuß gerade dran ist
        this.currentStepIndex = 0;
    }

    /**
     * Spielt abwechselnd die beiden FLAC-Schrittgeräusche ab.
     */
    playStep() {
        // Aktuellen Sound auswählen
        const currentSound = this.grassSteps[this.currentStepIndex];

        // Falls der Sound vom letzten Schritt noch minimal läuft, zurückspulen
        currentSound.currentTime = 0;

        // Sound abspielen
        currentSound.play().catch(err => {
            console.log("Audio wartet auf Klick-Interaktion im Browser:", err.message);
        });

        // Index wechseln (Aus 0 wird 1, aus 1 wird 0)
        this.currentStepIndex = (this.currentStepIndex + 1) % this.grassSteps.length;
    }
}
