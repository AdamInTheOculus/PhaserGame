/**
 * @author   JonCatalano
 * @date     April 18th 2019
 * @purpose  Startup GUI Scene
 */

class GUIScene extends Phaser.Scene {
    
    constructor() {
        super({
            key: 'GUIScene', active: true
        });
    }

    create() {
        this.title = this.add.text(5, 5, 'GUI Test', { fill: '#000', fontSize: 32 });
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 18th 2019
     * @purpose  Updates `this.title` text with updated player list.
     * @param    `playerCount` - Number representing length of player list.
    **/
    updatePlayerList(playerCount) {
        this.title.setText(`# of players: ${playerCount}`);
    }

}
export default GUIScene;
