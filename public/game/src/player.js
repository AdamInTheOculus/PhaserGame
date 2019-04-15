/**
 * @author   AdamInTheOculus
 * @date     April 13th 2019
 * @purpose  Contains client-side data and logic for anything related to the player.
 **/

import io from 'socket.io-client';

class Player {

    constructor(position, avatar) {
        this.position = position;
        this.avatar = avatar;
        this.socket = io();
        this.players = {};
    }

    create() {

    }

    addPlayer(id, x, y) {
        this.players[id] = this.scene.physics.add.sprite(x, y, 'dude');
    }

}