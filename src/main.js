let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
let keyF, keyR, keyLEFT, keyRIGHT;

// Sam Tancio
// 04/18/2022, project "Bird Bread" took roughly 10 hours
// Points Breakdown:
// Redesign the game's artwork, UI, and sound to change its theme/aesthetic (to something other than sci-fi) (60)
// Implement a new timing/scoring mechanism that adds time to the clock for successful hits (20)
// Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (20)
// 60 + 20 +20 = 100 points

// Credits Breakdown:
// Game Sound Effects: https://www.pico-8-edu.com/
// Background Music: https://www.youtube.com/watch?v=ox_T5Ia_Y0A by super noot ensemble
// All Art: made by me (Sam Tancio) using the Procreate app on iPad Pro