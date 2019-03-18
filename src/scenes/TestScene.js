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
        let map = this.make.tilemap({key: 'map_1'});
        let tileset = map.addTilesetImage('platformer_1', 'game_tiles');

        // ===================================================================
        // == Build world with background image, tilemaps, and game objects ==
        // ===================================================================
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        let collidableLayer = map.createDynamicLayer(0, tileset, 0, 0);

        let spawnPoints = [];
        spawnPoints.push(map.findObject("GameObjects", obj => obj.name === "SpawnPoint1"));
        spawnPoints.push(map.findObject("GameObjects", obj => obj.name === "SpawnPoint2"));

        // ======================================
        // == Initialize player and animations ==
        // ======================================
        this.player = this.physics.add.sprite(spawnPoints[0].x, spawnPoints[0].y, 'dude');
        this.player.setGravityY(300);

        // ===================================
        // == Set up collisions and physics ==
        // ===================================
        collidableLayer.setCollisionByProperty({ collidable: true });
        this.physics.add.collider(this.player, collidableLayer);

        let debugGraphics = this.add.graphics();
        collidableLayer.renderDebug(debugGraphics, {
            tileColor:          new Phaser.Display.Color(255, 255, 255, 0),  // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 150),    // Color of colliding tiles
            faceColor:          new Phaser.Display.Color(40, 39, 37, 0)       // Color of colliding face edges
        });


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

        // ============================
        // == Set up player movement ==
        // ============================
        this.keyboard = this.input.keyboard.createCursorKeys();

        // ========================================
        // == Bind camera within game boundaries ==
        // ========================================
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
    }

    update(time, delta) {

        // Handle player side movement
        if (this.keyboard.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.keyboard.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        // Handle player jump
        // TODO: Support double jumping
        if (this.keyboard.up.isDown && this.player.body.blocked.down) {
            this.player.setVelocityY(-330);
        }
    }
}

export default TestScene;