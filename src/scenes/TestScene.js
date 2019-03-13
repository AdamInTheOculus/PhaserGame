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
        this.load.image('background', 'assets/images/landscape.png');            // Load background image.
        this.load.image('game_tiles', 'assets/tilesets/platformer_1.png');       // Load Tiled tileset.
        this.load.tilemapTiledJSON('map_1', 'assets/maps/adam-test.json');       // Load Tiled map.
    }

    create() {
        this.map = this.make.tilemap({key: 'map_1'});

        const tileset = this.map.addTilesetImage(
            'platformer_1',         // Name of tilemap specified in map data.
            'game_tiles'            // Key of image used for tileset in map data.
        );

        // console.log('Index of background image from Image Layer: ' + this.map.getImageIndex('background')); // Prints '0'
        // console.log(this.map.images);   // Prints all data from Image Layer
        // console.log(this.map.layers);   // Prints all data from Tiled Layer
        // console.log(this.map.objects);  // Prints all data from Object Layer

        // ===================================================================
        // == Build world with background image, tilemaps, and game objects ==
        // ===================================================================
        this.add.image(400, 550, 'background');
        this.collidable = this.map.createStaticLayer('Collidable', tileset, 0, 0);

        // ===================================================
        // == Attempting to draw rectangles on spawn points ==
        // ===================================================
        let spawnPoints = [];
        spawnPoints.push(this.map.findObject("GameObjects", obj => obj.name === "SpawnPoint1"));
        spawnPoints.push(this.map.findObject("GameObjects", obj => obj.name === "SpawnPoint2"));
        const rect1 = new Phaser.Geom.Rectangle(spawnPoints[0].x, spawnPoints[0].y, 50, 50);
        const rect2 = new Phaser.Geom.Rectangle(spawnPoints[1].x, spawnPoints[1].y, 50, 50);
        const graphics = this.add.graphics({ fillStyle: { color: 0x0000ff }});
        graphics.fillRectShape(rect1);
        graphics.fillRectShape(rect2);

        // ========================================
        // == Bind camera within game boundaries ==
        // ========================================
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(spawnPoints[0]);  // Have camera follow player (currently only a spawn point)
    }

    update(time, delta) {
        
    }
}

export default TestScene;