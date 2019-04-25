/**
 * @author   JonCatalano
 * @date     April 24th 2019
 * @purpose  Contains client-side data and logic for anything related to a projectile.
 **/

export default class Projectile extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.startPosition.x, config.startPosition.y, 'dude');
        this.scene = config.scene;
        this.scene.add.existing(this);

        this.speed = config.speed;
        this.damage = config.damage;
        this.isAOE = config.isAOE;
        this.radius = config.radius;

        this.scene.physics.world.enable(this);

        this.body.setSize(8, 8);
        this.body.offset.set(12, 12);

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

        for (var player in this.scene.players) {
          if (this.scene.players.hasOwnProperty(player)) {
              this.scene.physics.world.collide(this, player.sprite, () => this.explode());
          }
        }
    }

    explode() {
        this.scene.player.spells['fireball'].projectiles.pop();
        this.setActive(false);
        this.setVisible(false);﻿
        this.body.destroy();
    }
}
