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
    drawStock(spellStock){
        if(this.spellsInventoryText1===undefined){
            if(spellStock.a!=undefined){
                this.spellsInventoryText1 = this.add.text(this.sw*0.02+(this.sw*0.042), this.sh*0.79, `${spellStock.a}`, {fill: '#000', fontSize: this.sw*0.03});
            }
            if(spellStock.b!=undefined){
                this.spellsInventoryText2 = this.add.text(this.sw*0.02+(this.sw*0.1)+(this.sw*0.042), this.sh*0.79, `${spellStock.b}`, {fill: '#000', fontSize: this.sw*0.03});
            }
        }else{
            if(spellStock.a!=undefined){
                this.spellsInventoryText1.setText(`${spellStock.a}`);
            }if(spellStock.b!=undefined){
                this.spellsInventoryText2.setText(`${spellStock.b}`);
            }
        }
    }

    /**
     * @author   JonCatalano
     * @date     April 25th 2019
     * @purpose  Updates `this.spellsInventory` menu with updated spell icon.
     * @param    `spellsInventoryIndex` - Number representing index of spellsInventory.
    **/
    updateSpellsInventory(spellsList) {
        let spellsArray = Object.values(spellsList);
        for(var i; i<spellsArray.length; i++){
            if(this.spellsInventory[i]!=undefined){
                this.spellsInventory[i].destroy();
                this.drawSpellsInventory();
            }
        }
        let stockA = undefined;
        let stockB = undefined;
        if(spellsArray[0]!=undefined){
            this.spellsInventory[1] = this.add.image(this.sw*0.072, this.sh*0.89, spellsArray[0].icon)
            this.spellsInventory[1].displayWidth = this.sw*0.1;
            this.spellsInventory[1].displayHeight = this.sh*0.13;
            stockA = spellsArray[0].stock;
        }
        if(spellsArray[1]!=undefined){
            this.spellsInventory[2] = this.add.image(this.sw*0.072+(this.sw*0.1), this.sh*0.89, spellsArray[1].icon)
            this.spellsInventory[2].displayWidth = this.sw*0.1;
            this.spellsInventory[2].displayHeight = this.sh*0.13;
            stockB = spellsArray[1].stock;
        }
        this.drawStock({a: stockA, b: stockB})
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
