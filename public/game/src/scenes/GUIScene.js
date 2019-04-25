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
        this.spellsInventory = [];
    }

    create(){
      let sw = this.sw = this.cameras.main.width;
      let sh = this.sh = this.cameras.main.height;

      // Health Bar
      this.hp = 150;
      this.health_bar = this.add.graphics()
      this.health_bar.fillStyle(0xff0000, 1);
      this.health_bar.fillRect(sw*0.02, sh*0.02, this.hp, sh*0.03);

      // Spells
      this.spellsInventory[1] = this.add.graphics()
      this.spellsInventory[1].fillStyle(0xff0000, 1);
      this.spellsInventory[1].strokeRect(sw*0.02, sh*0.85, sw*0.1, sh*0.1);

      this.spellsInventory[2] = this.add.graphics()
      this.spellsInventory[2].fillStyle(0xff0000, 1);
      this.spellsInventory[2].strokeRect(sw*0.02+(sw*0.1), sh*0.85, sw*0.1, sh*0.1);
    }

    update(){

    }

    /**
     * @author   AdamInTheOculus
     * @date     April 18th 2019
     * @purpose  Updates `this.title` text with updated player list.
     * @param    `playerCount` - Number representing length of player list.
    **/
    updatePlayerList(playerCount) {
        if(this.title === undefined) {
            this.title = this.add.text(10, 10+this.sh*0.04, `# of players: ${playerCount}`, {fill: '#000', fontSize: 26})
        } else {
            this.title.setText(`# of players: ${playerCount}`);
        }
    }

}
export default GUIScene;
