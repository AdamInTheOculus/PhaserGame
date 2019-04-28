/**
 * @author   JonCatalano | AdamInTheOculus
 * @date     April 16th 2019
 * @purpose  Entry point for Phaser 3 multiplayer game.
 */

import Player from '../player.js';
import Enemy from '../enemies/enemy.js'
import GUIScene from './GUIScene.js';
import * as constants from '../helpers/constants.js';

import InputHandler from '../input_handler.js';
import NetworkHandler from '../network_handler.js';
import AnimationHandler from '../animation_handler.js';

class MultiplayerGameScene extends Phaser.Scene {

    constructor() {
        super({
            key: 'MultiplayerGameScene'
        });
        this.ids = constants.ids;
    }

    create() {

        this.inputHandler = new InputHandler(this.input);
        this.networkHandler = new NetworkHandler(this);
        this.animationsHandler = new AnimationHandler(this);

        this.player = undefined;
        this.players = {};
        this.enemies = [];

        // ===================================================================
        // == Build world with background image, tilemaps, and game objects ==
        // ===================================================================
        let map = this.make.tilemap({key: 'map_1'});
        let tileset = map.addTilesetImage('tiles', 'game_tiles');
        let tilesetData = this.getTileMetadata(map.tilesets);
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.layers = {};
        this.groups = {};

        // Set up layers
        this.layers.ground = map.createStaticLayer(0, tileset, 0, 0);
        this.layers.spawnPoints = map.getObjectLayer('SpawnPoints')['objects'];
        this.layers.endPoints = map.getObjectLayer('EndPoints')['objects'];
        this.layers.collectables = map.getObjectLayer('Collectables')['objects'];

        // Set up groups
        this.groups.endPoints = this.physics.add.staticGroup();
        this.groups.collectables = this.physics.add.staticGroup();

        this.scene.bringToTop('GUIScene');
        this.guiScene = this.scene.get('GUIScene');

        this.networkHandler.registerSocketListeners();

        // Set up flight orb triggerables
        this.layers.collectables.forEach(collectable => {
            let type = tilesetData[collectable.gid][0][1].type;
            let orb = this.groups.collectables.create(collectable.x-(collectable.width/2), collectable.y-(collectable.height/2), 'map_atlas', `${type}_collectable`);
            orb.body.width = collectable.width;
            orb.body.height = collectable.height;
            orb.key = type;
            orb.particles = this.add.particles(orb.key)
            orb.emitter = orb.particles.createEmitter({
                blendMode: 'ADD',
                scale: { start: 0, end: 0.05 },
                speed: { min: -25, max: 25 },
                quantity: 5
            });
            orb.emitter.startFollow(orb)


            // spawn enemies
            let enemy = new Enemy({
                scene: this,
                key: 'enemy',
                startPosition: {x: collectable.x, y: collectable.y}
            });

            enemy.setActive(true);
            enemy.setVisible(true);

            enemy.body.setGravityY(300);

            this.enemies.push(enemy);
        });

        // Set up endpoint (tombstone) triggerables
        this.layers.endPoints.forEach(endpoint => {
            let tombstone = this.groups.endPoints.create(endpoint.x, endpoint.y, 'tombstone');
            tombstone.body.width = endpoint.width;
            tombstone.body.height = endpoint.height;
        });

        this.animationsHandler.setupAnimations();

        // ===================================
        // == Set up collisions and physics ==
        // ===================================
        this.layers.ground.setCollisionByProperty({ collidable: true });

        // ========================================
        // == Bind camera within game boundaries ==
        // ========================================
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    }

    update(time, delta) {

        if(this.player === undefined) {
            return;
        }

        this.player.update(time, this.inputHandler.getState());


        this.enemies.forEach(enemy => {
            enemy.update();
        });



        // ===================================================
        // == Reset player position after falling off world ==
        // ===================================================
        if(this.player.sprite.y > 1375) {

            // Shake camera when player reaches out-of-bounds.
            this.cameras.main.shake(1000, 0.02, null, (camera, progress) => {
                if(progress >= 1) {
                    let spawnPoint = this.getRandomSpawnPoint();
                    this.player.sprite.setVelocityY(0);
                    this.player.sprite.setVelocityX(0);
                    this.player.sprite.x = spawnPoint.x;
                    this.player.sprite.y = spawnPoint.y;
                }
            });
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

    /**
     * @author   AdamInTheOculus
     * @date     April 7th 2019
     * @purpose  Logic when a player collides with a blue flight orb.
    **/
    collideWithCollectable(id, player, orb) {
        let key = orb.key;
        orb.particles.destroy();
        orb.destroy(orb.x, orb.y);

        if(id === this.player.id) {
            this.player.addExtraJump();
            this.player.collectSpell(key);
            this.player.updateSpellStock(key);
            this.guiScene.updateSpellsInventory(this.player.spells)
        }
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 7th 2019
     * @purpose  Logic when a players collides with a tombstone.
    **/
    collideWithTombstone(id, player, tombstone) {
        tombstone.destroy(tombstone.x, tombstone.y);

        if(id === this.player.id) {
            alert('You touched the tombstone!');
        } else {
            alert(`${this.players[id].name} touched the tombstone!`);
        }

        location.reload();
    }

    /**
     * @author   JonCatalano
     * @date     April 28th 2019
     * @purpose  Logic when a player collides with an enemy
    **/
    collideWithEnemy(id, player, enemy) {
        alert("YOU ARE DEAD :'(")
        player.body.setVelocityY(-200);
        location.reload();
    }

    /**
     * @author           AdamInTheOculus
     * @date             April 26th 2019
     * @purpose          Returns an object. Mapped by unique tile ID. Each property contains tile metadata.
     * @param  tilesets  Array containing all tileset objects associated with layer.
    **/
    getTileMetadata(tilesets) {

        let metadata = {};

        tilesets.forEach(tileset => {

            // ======================================================
            // == Skip iteration if no tiles exist within tileset. ==
            // ======================================================
            if(tileset.tileData === undefined) {
                return;
            }

            // ===========================================================================
            // == Iterate over each tile and add to metadata object, mapped by Tile ID. ==
            // ===========================================================================
            Object.keys(tileset.tileData).map(function(key) {
              return [Number(key), tileset.tileData[key]];
            }).forEach(tile => {
                // This link explains the `offsetId` - https://stackoverflow.com/questions/25414596/why-property-ids-not-match-to-correct-tile-ids
                let offsetId = tile[0] + tileset.firstgid;

                // ===========================================================
                // == Add tile object to metadata, mapped by offset tile ID ==
                // ===========================================================
                if(metadata[offsetId] === undefined) {
                    metadata[offsetId] = [tile];
                } else {
                    throw new Error(`TiledMap - getTileMetadata - Duplicate tile ID found [${offsetId}]`);
                }
            });
        });

        return metadata;
    }
}

export default MultiplayerGameScene;
