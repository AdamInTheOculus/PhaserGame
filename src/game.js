/**
 * @author   AdamInTheOculus
 * @date     Tues March 12th 2019
 * @purpose  Entry point for Phaser 3 game.
 */

import TestScene from './scenes/TestScene.js';

const config = {
    type: Phaser.AUTO,    // Attempts to load WebGL. If it fails then load Canvas.
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
    scene: [ TestScene ]
};

const game = new Phaser.Game(config);