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

        this.musicTracks = {
            day: [
                'src/assets/sounds/music/day/caketown.mp3',
                'src/assets/sounds/music/day/no_more_magic.mp3',
                'src/assets/sounds/music/day/path_to_lake_land.ogg',
                'src/assets/sounds/music/day/soliloquy.mp3',
                'src/assets/sounds/music/day/woodland_fantasy.mp3'
            ],

            night: [
                // Später:
                // 'assets/sounds/music/night/track.mp3',
            ],

            combat: [
                // Später:
                // 'assets/sounds/music/combat/track.mp3',
            ],

            cave: [
                // Später:
                // 'assets/sounds/music/cave/track.mp3',
            ]
        };

        this.musicContext = 'day';
        this.musicPlaylist = [];
        this.currentMusicIndex = 0;
        this.music = null;
        this.musicStarted = false;

        this.createMusicPlaylist();
    }

    createMusicPlaylist() {
        const tracks = this.musicTracks[this.musicContext] || [];

        this.musicPlaylist = [...tracks];

        // Zufällige Reihenfolge
        for (let i = this.musicPlaylist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [this.musicPlaylist[i], this.musicPlaylist[j]] =
                [this.musicPlaylist[j], this.musicPlaylist[i]];
        }

        this.currentMusicIndex = 0;
    }

    startMusic() {
        if (this.musicStarted) return;

        this.musicStarted = true;
        this.playNextMusic();
    }

    playNextMusic() {
        if (this.musicPlaylist.length === 0) return;

        const track = this.musicPlaylist[this.currentMusicIndex];

        this.music = new Audio(track);
        this.music.volume = 0.3;

        this.music.addEventListener('ended', () => {
            this.music = null;
            this.currentMusicIndex++;

            // Playlist durch → neue zufällige Reihenfolge
            if (this.currentMusicIndex >= this.musicPlaylist.length) {
                this.createMusicPlaylist();
            }

            this.playNextMusic();
        });

        this.music.play().catch(error => {
            console.warn('Musik konnte nicht gestartet werden:', error);
            this.music = null;
        });
    }

    setMusicContext(context) {
        if (!this.musicTracks[context]) {
            console.warn(`Unbekannter Musik-Kontext: ${context}`);
            return;
        }

        if (this.musicContext === context) return;

        this.musicContext = context;
        this.createMusicPlaylist();

        // Aktuellen Track stoppen
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
            this.music = null;
        }

        // Neue Musik starten, falls Musik bereits aktiviert wurde
        if (this.musicStarted) {
            this.playNextMusic();
        }
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

    playHit() {
        const audio = new Audio('src/assets/sounds/hit30.mp3.flac');
        audio.volume = 0.5; // Lautstärke optional anpassen
        audio.play().catch(err => console.error("Audio Autoplay Blockade:", err));
    }
}
