/**
 * @author   AdamInTheOculus
 * @date     April 13th 2019
 * @purpose  Contains client-side data and logic for anything related to the player.
 **/

class Player {

    constructor(sprite, isClient) {
        this.sprite = sprite;
        this.isClient = isClient;
    }
}

export default Player;