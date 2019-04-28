/**
 * @author   JonCatalano
 * @date     Thurs Aprl 11th 2019
 * @purpose  Preload game assets
 */

class BootScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'BootScene'
        });
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
          // prepare all animations, defined in a separate file
          //makeAnimations(this);
          progress.destroy();
          this.scene.start('MenuScene');
      });

      this.load.image('background', 'game/assets/backgrounds/landscape.png');       // Load background image.
      this.load.image('game_tiles', 'game/assets/tilesets/map.png');       // Load Tiled tileset.
      this.load.image('blue_orb', 'game/assets/triggerables/blue_orb.png');         // Load first collectable.
      this.load.image('tombstone', 'game/assets/triggerables/tombstone.png');       // Load GameOver trigger.
      this.load.tilemapTiledJSON('map_1', 'game/assets/maps/adam-test_base64.json');       // Load Tiled map.
      this.load.spritesheet('dude', 'game/assets/spritesheets/dude.png', {          // Load spritesheet for player
          frameWidth: 32, frameHeight: 48
      });
      this.load.spritesheet('enemy', 'game/assets/spritesheets/dude_blue.png', {          // Load spritesheet for player
          frameWidth: 32, frameHeight: 48
      });

      this.load.atlas('map_atlas', 'game/assets/tilesets/map.png', 'game/assets/tilesets/map.json');

      this.load.bitmapFont('font', 'game/assets/fonts/font.png', 'game/assets/fonts/font.fnt');

      //
      // Spells
      //
      this.load.spritesheet('fireball', 'game/assets/spritesheets/fireball.png', {            // Load spritesheet for player.
          frameWidth: 134, frameHeight: 134
      });
      this.load.spritesheet('iceball', 'game/assets/spritesheets/ice.png', {            // Load spritesheet for player.
          frameWidth: 192, frameHeight: 192
      });
      this.load.image('fireball_spell_icon', 'game/assets/icons/fireball_spell_icon.png');
      this.load.image('iceball_spell_icon', 'game/assets/icons/ice_spell_icon.png');
    }
}

export default BootScene;
