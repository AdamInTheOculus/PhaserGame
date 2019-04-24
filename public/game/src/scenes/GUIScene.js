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

    create(){
      let sw = this.cameras.main.width;
      let sh = this.cameras.main.height;

      // Health Bar
      this.hp = 150;
      this.health_bar = this.add.graphics()
      this.health_bar.fillStyle(0xff0000, 1);
      this.health_bar.fillRect(sw-10, sh*0.02, this.hp, sh*0.03);

      // Spells
      this.spells = [];
      this.spellsInventory = this.add.graphics()
      this.spellsInventory.fillStyle(0xff0000, 1);
      this.spellsInventory.strokeRect(sw*0.02+10, sh*0.02, sw*0.04, sh*0.03);
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 18th 2019
     * @purpose  Updates `this.title` text with updated player list.
     * @param    `playerCount` - Number representing length of player list.
    **/
    updatePlayerList(playerCount) {
        if(this.title === undefined) {
            this.title = this.add.text(10, 10, `# of players: ${playerCount}`, {fill: '#000', fontSize: 26})
        } else {
            this.title.setText(`# of players: ${playerCount}`);
        }
    }

}
export default GUIScene;
