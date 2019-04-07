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
        this.load.image('blue_orb', 'assets/triggerables/blue_orb.png');         // Load first collectable.
        this.load.image('tombstone', 'assets/triggerables/tombstone.png');       // Load GameOver trigger.
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
        this.layers = {};
        this.groups = {};

        // Set up layers
        this.layers.collidable = map.createStaticLayer(0, tileset, 0, 0);
        this.layers.spawnPoints = map.getObjectLayer('SpawnPoints')['objects'];
        this.layers.endPoints = map.getObjectLayer('EndPoints')['objects'];
        this.layers.flightOrbs = map.getObjectLayer('FlightOrbs')['objects'];

        // Set up flight orb triggerables
        this.groups.flightOrbs = this.physics.add.staticGroup();
        this.layers.flightOrbs.forEach(flightOrb => {
            let orb = this.groups.flightOrbs.create(flightOrb.x, flightOrb.y, 'blue_orb');
            orb.setOrigin(0, 0);
            orb.body.width = flightOrb.width;
            orb.body.height = flightOrb.height;
        });

        // Set up endpoint (tombstone) triggerables
        this.groups.endPoints = this.physics.add.staticGroup();
        this.layers.endPoints.forEach(endpoint => {
            let tombstone = this.groups.endPoints.create(endpoint.x, endpoint.y, 'tombstone');
            tombstone.setOrigin(0, 0);
            tombstone.body.width = endpoint.width;
            tombstone.body.height = endpoint.height;
        });

        // ======================================
        // == Initialize player and animations ==
        // ======================================
        let spawnPoint = this.getRandomSpawnPoint();
        this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'dude');
        this.player.setGravityY(300);

        // Set up custom variables for jumping / double jumping.
        this.canJump = true;
        this.canDoubleJump = false;

        // ===================================
        // == Set up collisions and physics ==
        // ===================================
        this.layers.collidable.setCollisionByProperty({ collidable: true });
        this.physics.add.collider(this.player, this.layers.collidable);
        this.physics.add.overlap(this.player, this.groups.flightOrbs, this.collideWithFlightOrb, null, this);
        this.physics.add.overlap(this.player, this.groups.endPoints, this.collideWithTombstone, null, this);

        // =============================
        // == Setup player animations ==
        // =============================
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
        this.input.keyboard.on('keydown-UP', this.handleJump, this);

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

        // Reset jump availability when player touches ground.
        if(this.player.body.blocked.down) {
            this.canJump = true;
            this.canDoubleJump = false;
        }
    }

    /**
     * @author   AdamInTheOculus
     * @date     March 18th 2019
     * @purpose  Handles single and double jump logic.
    **/
    handleJump() {

        if(this.canJump && this.player.body.blocked.down) {

            // Apply jumping force
            this.player.body.setVelocityY(-300);
            this.canJump = false;
            this.canDoubleJump = true;

        } else {

            console.log('Checking can can jump: ' + this.canJump);
            console.log('Checking if can double jump: ' + this.canDoubleJump);

 
            // Check if player can double jump
            if(this.canDoubleJump){
                console.log('Performing double jump!');
                this.canDoubleJump = false;
                this.player.body.setVelocityY(-300);
            }

        }
    }

    /**
     * @author   AdamInTheOculus
     * @date     March 18th 2019
     * @purpose  Displays debug colouring for tiles, colliding tiles, and faces.
    **/
    displayDebugGraphics(layer) {
        const debugGraphics = this.add.graphics();
        layer.renderDebug(debugGraphics, {
            tileColor:          new Phaser.Display.Color(255, 255, 255, 0),  // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 150),    // Color of colliding tiles
            faceColor:          new Phaser.Display.Color(40, 39, 37, 0)       // Color of colliding face edges
        });
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 7th 2019
     * @purpose  Returns a random spawn point from spawn point layer.
    **/
    getRandomSpawnPoint() {
        return this.layers.spawnPoints[this.getRandomInt(0, this.layers.spawnPoints.length)];
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 7th 2019
     * @purpose  Logic when a player collides with a blue flight orb.
    **/
    collideWithFlightOrb(player, orb) {
        const FLIGHT_BOOST = -500;
        orb.destroy(orb.x, orb.y);
        player.setVelocityY(FLIGHT_BOOST);
        this.canDoubleJump = true;
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 7th 2019
     * @purpose  Logic when a players collides with a tombstone.
    **/
    collideWithTombstone(player, tombstone) {
        tombstone.destroy(tombstone.x, tombstone.y);
        alert('Game Over!');
    }

    /**
     * @author     AdamInTheOculus
     * @date       April 7th 2019
     * @purpose    Returns random integer between [min, max - 1].
     * @reference  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#Getting_a_random_integer_between_two_values
    **/
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
    }
}

export default TestScene;