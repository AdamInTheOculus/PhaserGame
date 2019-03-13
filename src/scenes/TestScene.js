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
        this.load.spritesheet('dude', 'assets/spritesheets/dude.png', {          // Load spritesheet for player
            frameWidth: 32, frameHeight: 48 
        });
    }

    create() {
        this.map = this.make.tilemap({key: 'map_1'});

        const tileset = this.map.addTilesetImage(
            'platformer_1',         // Name of tilemap specified in map data.
            'game_tiles'            // Key of image used for tileset in map data.
        );

        // ===================================================================
        // == Build world with background image, tilemaps, and game objects ==
        // ===================================================================
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.collidable = this.map.createStaticLayer('Collidable', tileset, 0, 0);

        let spawnPoints = [];
        spawnPoints.push(this.map.findObject("GameObjects", obj => obj.name === "SpawnPoint1"));
        spawnPoints.push(this.map.findObject("GameObjects", obj => obj.name === "SpawnPoint2"));

        // ======================================
        // == Initialize player and animations ==
        // ======================================
        this.player = this.physics.add.sprite(spawnPoints[0].x, spawnPoints[0].y, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(300);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // ===================================
        // == Set up collisions and physics ==
        // ===================================
        this.physics.add.collider(this.player, this.collidable);

        // ============================
        // == Set up player movement ==
        // ============================
        this.cursors = this.input.keyboard.createCursorKeys();

        // ========================================
        // == Bind camera within game boundaries ==
        // ========================================
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player);  // Have camera follow player (currently only a spawn point)

        console.log(this.player.body);
    }

    update(time, delta) {

        // Handle player side movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        // Handle player jump
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }
}

export default TestScene;