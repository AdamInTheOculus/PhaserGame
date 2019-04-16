/**
 * @author   AdamInTheOculus
 * @date     Tues March 12th 2019
 * @purpose  Entry point for Phaser 3 game.
 */

import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import SingleplayerGameScene from './scenes/SingleplayerGameScene.js';
import MultiplayerGameScene from './scenes/MultiplayerGameScene.js';

const config = {
    type: Phaser.AUTO,    // Attempts to load WebGL. If it fails then load Canvas.
    width: 1000,
    height: 760,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
    input: { gamepad: true },
    scene: [
        BootScene,
        MenuScene,
        SingleplayerGameScene,
        MultiplayerGameScene
    ]
};

const game = new Phaser.Game(config);
