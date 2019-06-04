/**
 * @author   AdamInTheOculus
 * @date     May 17th 2019
 * @purpose  Contains all data and logic of generic Collectable class.
**/

module.exports = class BaseCollectable {

    constructor(config) {
        this.name = config.name;
        this.position = config.position;
        this.size = config.size;
        this.timeSinceCollection = 0;
        this.isActive = false;
    }
};