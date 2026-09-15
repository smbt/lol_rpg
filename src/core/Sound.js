export class Sound {
    constructor() {
        this.audioCtx = null;
    }

    _initAudio() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
        return this.audioCtx;
    }

    /**
     * Spielt ein leicht raschelndes Gras-Schrittgeräusch ab.
     */
    playStep() {
        const ctx = this._initAudio();
        const now = ctx.currentTime;

        // 1. Wir erzeugen weißes Rauschen (White Noise) für das Rascheln der Grashalme
        const bufferSize = ctx.sampleRate * 0.08; // Sehr kurz: 0.08 Sekunden
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        // Den Buffer mit zufälligen Werten füllen (Rauschen)
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = buffer;

        // 2. Ein Audio-Filter (BiquadFilter), damit das Rauschen dumpfer und natürlicher klingt
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, now); // Frequenzbereich für ein trockenes Rascheln
        filter.Q.setValueAtTime(2, now);

        // 3. Ein normaler Oszillator für das dumpfe "Aufkommen" des Fußes
        const thudOsc = ctx.createOscillator();
        thudOsc.type = 'sine';
        thudOsc.frequency.setValueAtTime(60, now); // Sehr tiefe Frequenz
        thudOsc.frequency.exponentialRampToValueAtTime(20, now + 0.08);

        // 4. Lautstärkeregler (Gain) für beide Sound-Komponenten
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.04, now); // Das Rascheln soll dezent sein (4% Lautstärke)
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        const thudGain = ctx.createGain();
        thudGain.gain.setValueAtTime(.75, now); // Das Aufkommen des Fußes (8% Lautstärke)
        thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        // 5. Alles richtig miteinander verkabeln
        noiseNode.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        thudOsc.connect(thudGain);
        thudGain.connect(ctx.destination);

        // 6. Beide Klänge gleichzeitig starten und stoppen
        noiseNode.start(now);
        noiseNode.stop(now + 0.08);

        thudOsc.start(now);
        thudOsc.stop(now + 0.08);
    }
}
