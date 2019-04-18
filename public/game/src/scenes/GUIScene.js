/**
 * @author   JonCatalano
 * @date     Thurs Aprl 11th 2019
 * @purpose  Startup GUI Scene
 */

class GUIScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GUIScene', active: true
        });
    }
    create() {
      this.title = this.add.text(0, 0, 'GUI', { fill: '#000', fontSize: 40 });

      // Health Bar
      this.hp = 150;
      this.health_bar = this.add.graphics()
      this.health_bar.fillStyle(0xff0000, 1);
      this.health_bar.fillRect(window.innerWidth+10, window.innerHeight*0.02, this.hp, window.innerHeight*0.03);
    }

    update(time, delta) {

    }

}
export default GUIScene;
