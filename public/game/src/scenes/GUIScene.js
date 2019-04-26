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
      this.sw = this.cameras.main.width;
      this.sh = this.cameras.main.height;

      this.drawHealthBar(200);
      this.drawSpellsInventory();
    }

    /**
     * @author   JonCatalano
     * @date     April 26th 2019
     * @purpose  Draws `this.healthBar` with hp amount of health
     * @param    `hp` - Health Points in Health Bar
    **/
    drawHealthBar(hp){
        this.healthBar = this.add.graphics()
        this.healthBar.fillStyle(0xff0000, 1);
        this.healthBar.fillRect(this.sw*0.02, this.sh*0.02, hp, this.sh*0.03);
    }

    /**
     * @author   JonCatalano
     * @date     April 26th 2019
     * @purpose  Updates `this.spellsInventory` menu with updated spell icon.
     * @param    `spellsInventoryIndex` - Number representing index of spellsInventory.
    **/
    updateHealthBar(hp) {
        if(this.healthBar!=undefined){
            this.healthBar.destroy();
        }
        this.drawHealthBar(hp);
    }

    /**
     * @author   JonCatalano
     * @date     April 25th 2019
     * @purpose  Removes item from `this.spellsInventory` at Index
     * @param    `spellsInventoryIndex` - Number representing index of spellsInventory.
    **/
    removeFromSpellsInventory(spellsInventoryIndex){
        this.spellsInventory[spellsInventoryIndex].destroy();
        this.drawSpellsInventory();
    }

    /**
     * @author   JonCatalano
     * @date     April 25th 2019
     * @purpose  Draws `this.spellsInventory` in the GUI Scene
    **/
    drawSpellsInventory(){
        this.spellsInventory[1] = this.add.graphics()
        this.spellsInventory[1].fillStyle(0xff0000, 1);
        this.spellsInventory[1].strokeRect(this.sw*0.02, this.sh*0.82, this.sw*0.1, this.sh*0.13);

        this.spellsInventory[2] = this.add.graphics()
        this.spellsInventory[2].fillStyle(0xff0000, 1);
        this.spellsInventory[2].strokeRect(this.sw*0.02+(this.sw*0.1), this.sh*0.82, this.sw*0.1, this.sh*0.13);
    }

    /**
     * @author   JonCatalano
     * @date     April 26th 2019
     * @purpose  Draws keybindings spells inventory gui item
    **/
    drawKeyBindings(){
        for (var i = 0; i < 3; i++) {
            this.spellsInventory[1] = this.add.text(this.sw*0.02+(this.sw*0.042), this.sh*0.79, `1`, {fill: '#000', fontSize: this.sw*0.03})
            this.spellsInventory[2] = this.add.text(this.sw*0.02+(this.sw*0.1)+(this.sw*0.042), this.sh*0.79, `2`, {fill: '#000', fontSize: this.sw*0.03})
        }
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
            this.spellsInventory[spellsInventoryIndex] = this.add.image(this.sw*0.072+(this.sw*0.1), this.sh*0.89, key)
        }
        this.spellsInventory[spellsInventoryIndex].displayWidth = this.sw*0.1;
        this.spellsInventory[spellsInventoryIndex].displayHeight = this.sh*0.13;
        this.drawKeyBindings()
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
