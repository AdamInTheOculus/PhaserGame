/**
 * @author   JonCatalano
 * @date     April 24th 2019
 * @purpose  Contains client-side data and logic for anything related to a projectile.
 **/

export default class AOE extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.startPosition.x, config.startPosition.y, config.key);
        this.scene = config.scene;
        this.scene.add.existing(this);
        this.key = config.key;
        this.damage = config.damage;
        this.radius = config.radius;

        this.scene.physics.world.enable(this);

        // Grab image from game cache
        var img = Object.values(this.scene.textures.get(config.key))[2][0].texture.frames[0];

        var width = img.cutWidth*config.scale;
        var height = img.cutHeight*config.scale;

        this.body.setSize(width, height);

        this.anims.play(this.key, true);

        this.particles = this.scene.add.particles(config.key)

        this.emitter = this.particles.createEmitter({
            blendMode: 'ADD',
            scale: { start: 0.4, end: 0 },
            speed: { min: -100, max: 100 },
            quantity: 10
        });

        this.emitter.startFollow(this)

        // This is weird
        let _this = this;
        setTimeout(function(){
            _this.explode();
        }, 2000);
    }

    update(time, delta){
        const players = Object.values(this.scene.players)

        for (const player of players) {
            this.scene.physics.world.collide(this, player.sprite, () => this.applyDamage(player.sprite));
        }
    }

    applyDamage(){

    }

    explode(){
        this.setActive(false);
        this.setVisible(false);﻿
        this.body.destroy();
        this.particles.destroy();
    }
}
