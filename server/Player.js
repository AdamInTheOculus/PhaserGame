/**
 * @author   JonCatalano
 * @date     April 16th 2019
 * @purpose  Player class for server update information
**/

module.exports = class Player {
    constructor(id) {
        this.id = id;
        this.hp = 100;
        this.size = { w: 0, h: 0 };
        this.state = new Uint8Array(1);
        this.position = new Float32Array(2);
        this.velocity = new Float32Array(2);
    }

    moveLeft(delta) {
        this.state = 1;
        this.position[0] -= 160.0 * delta; 
    }

    moveRight(delta) {
        this.state = 2;
        this.position[0] += 160.0 * delta;
    }
};
