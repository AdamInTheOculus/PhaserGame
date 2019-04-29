/**
 * @author   JonCatalano
 * @date     April 24th 2019
 * @purpose  Contains client-side data and logic for anything related to an enemy.
 **/

export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.startPosition.x-18, config.startPosition.y-24, config.key);
        this.speed = 20;
        this.scene = config.scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.damage = 5;

        this.direction = "left";

        // Grab image from game cache
        var img = Object.values(this.scene.textures.get(config.key))[2][0].texture.frames[0];

        var width = img.cutWidth*config.scale;
        var height = img.cutHeight*config.scale;

        this.body.setSize(width, height);

        /*this.particles = this.scene.add.particles(config.key)

        this.emitter = this.particles.createEmitter({
            blendMode: 'ADD',
            scale: { start: 0.4, end: 0 },
            speed: { min: -100, max: 100 },
            quantity: 10
        });

        this.emitter.startFollow(this)
        */
        //console.log(`enemy spawned x: ${this.x}, y: ${this.y}`)
    }

    update(){
        this.scene.physics.world.collide(this, this.scene.layers.ground, () => {this.checkCollision(this, this.scene.layers.ground)});

        //console.log(`UPDATE x: ${this.x}, y: ${this.y}`)
        this.walkDirection(this.direction);
    }

    // Check collision of enemy
    checkCollision(enemy, ground){
        if(enemy.body.blocked.left){
            this.direction = "right";
        }else if(enemy.body.blocked.right){
            this.direction = "left";
        }
    }

    walkRight(){
        this.body.setVelocityX(this.speed);
    }

    walkLeft(){
        this.body.setVelocityX(-this.speed);
    }

    walkDirection(direction){
        switch(direction){
            case "left":
                this.walkLeft();
                break;
            case "right":
                this.walkRight();
                break;
        }
    }

    kill(){

    }
}
