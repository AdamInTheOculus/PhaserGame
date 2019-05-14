/**
 * @author   AdamInTheOculus
 * @date     Tues March 12th 2019
 * @purpose  Entry point for Phaser 3 game.
 */

import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import SingleplayerGameScene from './scenes/SingleplayerGameScene.js';
import MultiplayerGameScene from './scenes/MultiplayerGameScene.js';
import GUIScene from './scenes/GUIScene.js';


const config = {
    type: Phaser.AUTO,    // Attempts to load WebGL. If it fails then load Canvas.
    width: window.innerWidth*window.devicePixelRatio,
    height: window.innerHeight*window.devicePixelRatio,
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
        SingleplayerGameScene,
        MultiplayerGameScene
    ]
};

const game = new Phaser.Game(config);
