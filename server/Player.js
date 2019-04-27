/**
 * @author   JonCatalano
 * @date     April 16th 2019
 * @purpose  Player class for server update information
**/

module.exports = class Player {
    constructor() {
        this.hp = 100;
        this.id = 0;
        this.size = { w: 0, h: 0 };
        this.state = new Uint8Array(1);
        this.position = new Float32Array(2);
        this.velocity = new Float32Array(2);
    }
};
