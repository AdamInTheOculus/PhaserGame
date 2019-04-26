/**
 * @author   JonCatalano
 * @date     April 24th 2019
 * @purpose  Contains client-side data and logic for anything related to a projectile.
 **/

export default class Projectile extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.startPosition.x, config.startPosition.y, 'fireball');
        this.scene = config.scene;
        this.scene.add.existing(this);

        this.speed = config.speed;
        this.damage = config.damage;
        this.isAOE = config.isAOE;
        this.radius = config.radius;

        this.scene.physics.world.enable(this);

        this.body.setSize(config.width, config.height);
        //this.body.offset.set(config.width/2, config.height/2);

        this.particles = this.scene.add.particles('dude');
        //this.anims.play('left', true);
        this.particles.createEmitter({

        });
        /*this.on('animationcomplete', () => {
            if (this.anims.currentAnim.key === 'fireExplode') {
                this.setActive(false);
                this.setVisible(false);
            }
        }, this);
        */
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
