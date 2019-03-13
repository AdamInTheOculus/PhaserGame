/**
 * @author   AdamInTheOculus
 * @date     Tues March 12th 2019
 * @purpose  Entry point for Phaser 3 game.
 */

class TestScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'TestScene'
        });
    }

    preload() {
        this.load.image('game_tiles', 'assets/tilesets/platformer_1.png');       // Load Tiled tileset.
        this.load.tilemapTiledJSON('map_1', 'assets/maps/adam-test.json');       // Load Tiled map.
    }

    create() {
        this.map = this.make.tilemap({key: 'map_1'});

        const tileset = this.map.addTilesetImage(
            'platformer_1',         // Name of tilemap specified in map data.
            'game_tiles'            // Key of image used for tileset in map data.
        );

        console.log('Index of background: ' + this.map.getImageIndex('background'));
        console.log(this.map);
        console.log(this.map.images);   // Prints all data from Image Layer
        console.log(this.map.layers);   // Prints all data from Tiled Layer
        console.log(this.map.objects);  // Prints all data from Object Layer

        // How can I load first index of image layer as a background image?
        // How can I load the objects into world?

        this.collidable = this.map.createStaticLayer('Collidable', tileset, 0, -350);
    }

    update(time, delta) {
        
    }
}

export default TestScene;