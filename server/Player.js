/**
 * @author   JonCatalano
 * @date     April 16th 2019
 * @purpose  Player class for server update information
**/

module.exports = class Player {
    constructor() {
        this.hp = 100;
        this.id = 0;
        this.state = 4; // IDLE
        this.position = {
            x: 0,
            y: 0
        };
    }
};
