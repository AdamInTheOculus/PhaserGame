/**
 * @author   JonCatalano
 * @date     April 16th 2019
 * @purpose  Player class for server update information
**/

module.exports = class Player {
    constructor() {
        this.hp = 100;
        this.id = 0;
        this.state = 0;
        this.position = { x: 0, y: 0 };
        this.size = { w: 0, h: 0 };
    }
};
