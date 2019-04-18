/**
 * @author   JonCatalano
 * @date     Thurs Aprl 11th 2019
 * @purpose  Startup Menu Scene
 */

class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MenuScene'
        });
    }
    create() {
      this.scene.bringToTop();
      //this.cameras.main.setBackgroundColor('rgba(255, 0, 0, 0.5)');

      this.registry.set('restartScene', false);

      //save canvas dimensions
      this.sh = window.innerHeight;
      this.sw = window.innerWidth;

      let multiplier = 1;
      if (this.sh / this.sw > 0.6) {
          // Portrait, fit width
          multiplier = this.sw / 300;
      } else {
          multiplier = this.sh / 240;
      }
      multiplier = Math.floor(multiplier);
      let el = document.getElementsByTagName('canvas')[0];
      el.style.width = 300 * multiplier + 'px';
      el.style.height = 240 * multiplier + 'px';

      this.background = this.add.graphics()
      this.background.fillStyle(0x000, 1);
      this.background.fillRect(0, 0, 1000, 1000);


      this.title = this.add.text(this.sw/4, 100, 'Spell Slam 1.0', { fill: '#fff', fontSize: 40 });

      this.single_play_button = this.add.text(this.sw/4, 250, 'Single Player', { fill: '#0f0' })
        .setInteractive()
        .on('pointerdown', () => this.startSPGame());

      this.multiplay_button = this.add.text(this.sw/4, 300, 'Multiplayer', { fill: '#0f0' })
        .setInteractive()
        .on('pointerdown', () => this.startMPGame());

    }

    update(time, delta) {
        if (this.registry.get('restartScene')) {
            this.restartScene();
        }
        this.blink -= delta;
        if (this.blink < 0) {
            this.single_play_button.alpha = this.single_play_button.alpha === 1 ? 0 : 1;
            this.blink = 500;
        }
    }

    startSPGame() {
        this.scene.start('SingleplayerGameScene');
    }

    startMPGame() {
        this.scene.start('MultiplayerGameScene');
    }

    restartScene() {
        this.scene.stop('SingleplayerGameScene');
        this.scene.launch('SingleplayerGameScene');
        this.scene.bringToTop();

        this.registry.set('restartScene', false);
    }
}
export default MenuScene;
