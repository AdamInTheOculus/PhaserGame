/**
 * @author   JonCatalano
 * @date     April 24th 2019
 * @purpose  Contains client-side data and logic for anything related to a projectile.
 **/

export default class Projectile extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.startPosition.x, config.startPosition.y, );
        this.scene = config.scene;
        this.scene.add.existing(this);

        this.damage = config.damage;
        this.isAOE = config.isAOE;
        this.radius = config.radius;

        this.scene.physics.world.enable(this);

        // Grab image from game cache
        var img = Object.values(this.scene.textures.get('fireball'))[2][0].texture.frames[0];

        var width = img.cutWidth*config.scale;
        var height = img.cutHeight*config.scale;

        this.body.setSize(width, height);

        // For spin
        this.body.allowRotation = true;
        this.body.angularVelocity = -10;
        //this.body.offset.set(config.width/2, config.height/2);

        this.anims.play('fireball', true);

        const emitter = this.scene.add.particles('dude').createEmitter({
            blendMode: 'SCREEN',
            scale: { start: 0.2, end: 0 },
            speed: { min: -100, max: 100 },
            quantity: 50
        });

        emitter.startFollow(this)
    }

    update(time, delta){
        this.scene.physics.world.collide(this, this.scene.layers.ground, () => this.explode());

        const players = Object.values(this.scene.players)

        for (const player of players) {
            this.scene.physics.world.collide(this, player.sprite, () => this.explode());
        }
    }

    explode() {
        this.scene.player.spells['fireball'].projectiles.pop();
        this.setActive(false);
        this.setVisible(false);﻿
        this.body.destroy();
    }
}
