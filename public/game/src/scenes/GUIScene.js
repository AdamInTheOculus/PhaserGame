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
    removeSpellsInventory(){
        for(var i = 0; i<this.spellsInventory.length; i++){
            if(this.spellsInventory[i]!=undefined){
                this.spellsInventory[i].destroy();
            }
        }
    }

    /**
     * @author   JonCatalano
     * @date     April 25th 2019
     * @purpose  Draws `this.spellsInventory` in the GUI Scene
    **/
    drawSpellsInventory(spellsList, time){
        if(this.spellsInventory[1]!=undefined){
            this.spellsInventory[1].destroy();
        }
        if(this.spellsInventory[2]!=undefined){
            this.spellsInventory[2].destroy();
        }
        let spellsArray = Object.values(spellsList);

        if(spellsArray[0]!=undefined){
            if(time >= (spellsArray[0].lastCastTime+spellsArray[0].initCoolDown)){
                this.spellsInventory[1] = this.add.graphics()
                this.spellsInventory[1].lineStyle(2, 0xfff000, 1);
                this.spellsInventory[1].strokeRect(this.sw*0.02, this.sh*0.82, this.sw*0.1, this.sh*0.13);
            }else{
                this.spellsInventory[1] = this.add.graphics()
                this.spellsInventory[1].lineStyle(2, 0x000, 1);
                this.spellsInventory[1].strokeRect(this.sw*0.02, this.sh*0.82, this.sw*0.1, this.sh*0.13);
            }
        }

        if(spellsArray[1]!=undefined){
            if(time >= (spellsArray[1].lastCastTime+spellsArray[1].initCoolDown)){
                this.spellsInventory[2] = this.add.graphics()
                this.spellsInventory[2].lineStyle(2, 0xfff000, 1);
                this.spellsInventory[2].strokeRect(this.sw*0.02+(this.sw*0.11), this.sh*0.82, this.sw*0.1, this.sh*0.13);
            }else{
                this.spellsInventory[2] = this.add.graphics()
                this.spellsInventory[2].lineStyle(2, 0x000, 1);
                this.spellsInventory[2].strokeRect(this.sw*0.02+(this.sw*0.11), this.sh*0.82, this.sw*0.1, this.sh*0.13);
            }
        }
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
        }else{
            if(spellStock.a>=0){
                if(spellStock.a!=undefined){
                    this.spellsInventoryText1.setText(`${spellStock.a}`);
                }
            }else{
                this.spellsInventoryText1.setText('');
            }
        }

        if(this.spellsInventoryText2===undefined){
            if(spellStock.b!=undefined){
                this.spellsInventoryText2 = this.add.text(this.sw*0.02+(this.sw*0.1)+(this.sw*0.042), this.sh*0.79, `${spellStock.b}`, {fill: '#000', fontSize: this.sw*0.03});
            }
        }else{
            if(spellStock.b>=0){
                if(spellStock.b!=undefined){
                    this.spellsInventoryText2.setText(`${spellStock.b}`);
                }
            }else{
                this.spellsInventoryText2.setText('');
            }
        }
    }

    /**
     * @author   JonCatalano
     * @date     April 25th 2019
     * @purpose  Updates `this.spellsInventory` menu with updated spell icon.
     * @param    `spellsInventoryIndex` - Number representing index of spellsInventory.
    **/
    updateSpellsInventory(spellsList, time) {
        let spellsArray = Object.values(spellsList);
        if(spellsArray.length===0){
            return;
        }
        this.drawSpellsInventory(spellsList, time);
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
