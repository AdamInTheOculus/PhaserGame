/**
 * @author   AdamInTheOculus
 * @date     April 2021
 * @purpose  Preload game assets
 */

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
      const progress = this.add.graphics();

      // Register a load progress event to show a load bar
      this.load.on('progress', (value) => {
          progress.clear();
          progress.fillStyle(0xffff, 1);
          progress.fillRect(window.innerWidth*0.1, this.sys.game.config.height / 4, value*(window.innerWidth*0.77), 10); // x,y,w,h
      });

      // Register a load complete event to launch the title screen when all files are loaded
      this.load.on('complete', () => {
          progress.destroy();
          this.scene.start('MenuScene');
      });

      this.load.image('background', 'game/assets/backgrounds/landscape.png');       // Load background image.
      this.load.image('game_tiles', 'game/assets/tilesets/platformer_1.png');       // Load Tiled tileset.
      this.load.image('blue_orb', 'game/assets/triggerables/blue_orb.png');         // Load first collectable.
      this.load.image('tombstone', 'game/assets/triggerables/tombstone.png');       // Load GameOver trigger.
      this.load.tilemapTiledJSON('map_1', 'game/assets/maps/test-map-csv.json');       // Load Tiled map.
      this.load.spritesheet('dude', 'game/assets/spritesheets/dude.png', {          // Load spritesheet for player
          frameWidth: 32, frameHeight: 48
      });

      this.load.bitmapFont('font', 'game/assets/fonts/font.png', 'game/assets/fonts/font.fnt');
    }
}

export default BootScene;
