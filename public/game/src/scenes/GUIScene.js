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

      this.drawSpellsInventory();
    }

    /**
     * @author   JonCatalano
     * @date     April 25th 2019
     * @purpose  Draws `this.spellsInventory` in the GUI Scene
    **/
    drawSpellsInventory(){
        // Draw Spell Inventory
        this.spellsInventory[1] = this.add.graphics()
        this.spellsInventory[1].fillStyle(0xff0000, 1);
        this.spellsInventory[1].strokeRect(this.sw*0.02, this.sh*0.82, this.sw*0.1, this.sh*0.13);

        this.spellsInventory[2] = this.add.graphics()
        this.spellsInventory[2].fillStyle(0xff0000, 1);
        this.spellsInventory[2].strokeRect(this.sw*0.02+(this.sw*0.1), this.sh*0.82, this.sw*0.1, this.sh*0.13);
    }

    /**
     * @author   JonCatalano
     * @date     April 25th 2019
     * @purpose  Updates `this.spellsInventory` menu with updated spell icon.
     * @param    `spellsInventoryIndex` - Number representing index of spellsInventory.
    **/
    updateSpellsInventory(spellsInventoryIndex, key) {
        if(this.spellsInventory[spellsInventoryIndex]!=undefined){
            this.spellsInventory[spellsInventoryIndex].destroy();
            this.drawSpellsInventory();
        }
        if(spellsInventoryIndex===1){
            this.spellsInventory[spellsInventoryIndex] = this.add.image(this.sw*0.072, this.sh*0.89, key)
        }else if(spellsInventoryIndex===2){
            this.spellsInventory[spellsInventoryIndex] = this.add.image(this.sw*0.02+(this.sw*0.1), this.sh*0.85, key)
        }
        this.spellsInventory[spellsInventoryIndex].displayWidth = this.sw*0.1;
        this.spellsInventory[spellsInventoryIndex].displayHeight = this.sh*0.13;
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
