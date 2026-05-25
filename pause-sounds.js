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
        default: ""
    });

    // Unpause Settings
    game.settings.register("custom-pause-sounds", "unpauseSoundPath", {
        name: "Game Unpaused Sound",
        hint: "The audio file played when the game is unpaused.",
        scope: "world",
        config: true,
        type: String,
        filePicker: "audio",
        default: ""
    });

    // Override the default keybinding
    game.keybindings.register("custom-pause-sounds", "audioTogglePause", {
        name: "Audio Toggle Pause Override",
        hint: "Toggles the game pause state using spacebar and runs Custom Pause Sounds.",
        editable: [
            { key: "Space" }
        ],
        onDown: () => {
            // Are you the GM? If not, return.
            if (!game.user.isGM) return;

            // Get the sound files from settings.
            const pauseSound = game.settings.get("custom-pause-sounds", "pauseSoundPath");
            const unpauseSound = game.settings.get("custom-pause-sounds", "unpauseSoundPath");

            // Pick which sound to use based on the state we will going to.
            const targetPauseState = !game.paused;
            const selectedSound = targetPauseState ? pauseSound : unpauseSound;

            // Pause everyone.
            game.togglePause(targetPauseState, { broadcast: true });

            // Play the sound to everyone.
            if (selectedSound) {
                foundry.audio.AudioHelper.play({
                    src: selectedSound,
                    volume: 0.8,
                    loop: false
                }, true); // Setting this second argument to `true` pushes the sound to all players
            }

            return true; // Done.
        },
        precedence: CONST.KEYBINDING_PRECEDENCE.PRIORITY
    });
});

// Set everything up, announce we are ready-to-go.
Hooks.once("ready", () => {
    // In Foundry's API, .get() returns the KeybindingActionBinding[] array directly
    const corePauseBindings = game.keybindings.get("core", "pause");

    if (corePauseBindings && Array.isArray(corePauseBindings)) {
        // Filter out any standalone "Space" bindings from the default rule
        const filteredBindings = corePauseBindings.filter(b => b.key !== "Space");

        // Re-assign the cleaned array back to the core pause action to save it
        game.keybindings.set("core", "pause", filteredBindings);
    }
    const moduleVersion = game.modules.get("custom-pause-sounds")?.version || "unknown";
    console.log(`Custom Pause Sounds v${moduleVersion} | Module is ready and active!`);
});
