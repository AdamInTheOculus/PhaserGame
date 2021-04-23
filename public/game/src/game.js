/**
 * @author   AdamInTheOculus
 * @date     April 2021
 * @purpose  Entry point for Phaser 3 game.
 */

import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import MultiplayerGameScene from './scenes/MultiplayerGameScene.js';
import GUIScene from './scenes/GUIScene.js';

const config = {
    type: Phaser.AUTO,    // Attempts to load WebGL. If it fails then load Canvas.
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    input: { gamepad: true },
    scene: [
        BootScene,
        GUIScene,
        MenuScene,
        MultiplayerGameScene
    ]
};

const game = new Phaser.Game(config);
