/**
 * @author   Adam Sinclair
 * @date     April 2021
 * @purpose  Startup GUI Scene
 */

class GUIScene extends Phaser.Scene {
    constructor() {
        super({key: 'GUIScene', active: true});

        this.spellsInventory = [];
        this.collisionText = [];
    }

    create(){
      this.sw = this.cameras.main.width;
      this.sh = this.cameras.main.height;
    }

    toggleDebugMode() {
        this.debug = !this.debug;
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

    updateCollisionText(collider) {

        let x = this.sw - (this.sw / 7);
        let y = this.sh - (this.sh / 10);

        if(this.collisionTextBackground === undefined) {
            this.collisionTextBackground = this.add.rectangle(x + 50, y - 20, 150, 175, 0x000000, 0.75);
        }

        Object.keys(collider).forEach((direction, index) => {

            if(this.collisionText[index] === undefined) {
                this.collisionText.push(this.add.text(x, y - (20 * index), `${direction}: ${collider[direction]}`, {fontFamily: 'Verdana, "Times New Roman", Tahoma, serif', fill: '#fff', fontSize: 15}));
            } else {
                this.collisionText[index].setText(`${direction}: ${collider[direction]}`);
            }
        });
    }

    showLatency(latency) {

        let x = this.sw - (this.sw / 7);
        let y = this.sh - (this.sh / 10) - 90;

        if(this.latencyText === undefined) {
            this.latencyText = this.add.text(x, y, `Ping: ${latency} ms`, {fontFamily: 'Verdana, "Times New Roman", Tahoma, serif', fill: '#fff', fontSize: 15});
        } else {
            this.latencyText.setText(`Ping: ${latency} ms`);
        }
    }

}
export default GUIScene;
