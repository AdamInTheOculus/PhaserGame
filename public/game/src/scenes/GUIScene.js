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

    }

    update(time, delta) {

    }

}
export default GUIScene;
