//
// Custon Pause Sounds
// A Simple Foundry VTT Mod to add sounds to the default pause/unpause keypress.
// May 2026, Claycle
//

// Initialize the mod
Hooks.once("init", () => {

    // Pause Setting
    game.settings.register("custom-pause-sounds", "pauseSoundPath", {
        name: "Game Paused Sound",
        hint: "The audio file played when the game is paused.",
        scope: "world",
        config: true,
        type: String,
        filePicker: "audio",
        default: "modules/custom-pause-sounds/ogg/Pause.ogg"
    });

    // Unpause Settings
    game.settings.register("custom-pause-sounds", "unpauseSoundPath", {
        name: "Game Unpaused Sound",
        hint: "The audio file played when the game is unpaused.",
        scope: "world",
        config: true,
        type: String,
        filePicker: "audio",
        default: "modules/custom-pause-sounds/ogg/Unpause.ogg"
    });

    // Enter Settings
    game.settings.register("custom-pause-sounds", "enterSoundPath", {
        name: "Player Enters Sound",
        hint: "The audio file played when a player enters the game.",
        scope: "world",
        config: true,
        type: String,
        filePicker: "audio",
        default: "modules/custom-pause-sounds/ogg/Enter.ogg"
    });

    // Leave Settings
    game.settings.register("custom-pause-sounds", "leaveSoundPath", {
        name: "Player Leaves Sound",
        hint: "The audio file played when a player leaves the game.",
        scope: "world",
        config: true,
        type: String,
        filePicker: "audio",
        default: "modules/custom-pause-sounds/ogg/Leave.ogg"
    });




    // Volume Setting
    game.settings.register("custom-pause-sounds", "soundVolume", {
        name: "Volume",
        hint: "The volume (0 to 1) that you want the sound played at.",
        scope: "world",
        config: true,
        type: Number,
        range: {
            min: 0.0,
            max: 1.0,
            step: 0.05
        },
        default: 0.5
    });
});

// Watch for the pause state changing (happens via Spacebar OR UI Click)
Hooks.on("pauseGame", (paused) => {
    // Only the GM should initiate the broadcast sound trigger
    if (!game.user.isGM) return;

    // Get the sound files from settings.
    const pauseSound = game.settings.get("custom-pause-sounds", "pauseSoundPath");
    const unpauseSound = game.settings.get("custom-pause-sounds", "unpauseSoundPath");

    // Pick which sound to use based on the incoming state.
    const selectedSound = paused ? pauseSound : unpauseSound;
    const volumeSetting = game.settings.get("custom-pause-sounds", "soundVolume");

    // Play the sound to everyone.
    if (selectedSound) {
        console.log("Custom Pause Sounds, Playing:", selectedSound);
        foundry.audio.AudioHelper.play({
            src: selectedSound,
            volume: volumeSetting,
            loop: false
        }, true); // Setting this second argument to `true` pushes the sound to all players
    }
});


// Register the hook when Foundry is initialized or ready
Hooks.on("userConnected", (user, connected) => {
    if (user.id === game.user.id) return;

    // Get the sound files from settings.
    const enterSound = game.settings.get("custom-pause-sounds", "enterSoundPath");
    const leaveSound = game.settings.get("custom-pause-sounds", "leaveSoundPath");

    // What am I going to play?
    const soundPath = connected ?
        enterSound // Path to join sound
        :
        leaveSound; // Path to leave sound

    const volumeSetting = game.settings.get("custom-pause-sounds", "soundVolume");

    if (soundPath) {
        console.log("Custom Pause Sounds, Playing:", soundPath);
        foundry.audio.AudioHelper.play({
            src: soundPath,
            volume: volumeSetting,
            loop: false
        }, true); // Setting this second argument to `true` pushes the sound to all players
    }
});


// Announce we are ready-to-go.
Hooks.once("ready", () => {
    const moduleVersion = game.modules.get("custom-pause-sounds")?.version || "unknown";
    console.log(`Custom Pause Sounds v${moduleVersion}`);
});
