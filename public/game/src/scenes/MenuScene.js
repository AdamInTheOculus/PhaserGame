class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MenuScene'
        });
    }

    create() {
      this.scene.bringToTop();
      this.registry.set('restartScene', false);

      //save canvas dimensions
      this.sh = window.innerHeight;
      this.sw = window.innerWidth;

      this.background = this.add.graphics()
      this.background.fillStyle(0x000, 1);
      this.background.fillRect(0, 0, 1000, 1000);

      this.multiplay_button = this.add.text(this.sw / 4, 300, 'Play Multiplayer', { fill: '#0f0' })
        .setInteractive()
        .on('pointerdown', () => this.scene.start('MultiplayerGameScene'));
    }

    update(time, delta) {
        if (this.registry.get('restartScene')) {
            this.restartScene();
        }
    }

    restartScene() {
        this.scene.stop('SingleplayerGameScene');
        this.scene.launch('SingleplayerGameScene');
        this.scene.bringToTop();
        this.registry.set('restartScene', false);
    }
}

export default MenuScene;