/**
 * @author   JonCatalano
 * @date     April 24th 2019
 * @purpose  Contains client-side data and logic for anything related to a projectile.
 **/

import AOE from './area_effect.js';

export default class Projectile extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.startPosition.x, config.startPosition.y, config.key);
        this.scene = config.scene;
        this.scene.add.existing(this);
        this.key = config.key;
        this.damage = config.damage;
        this.isAOE = config.isAOE;
        //this.aoeDmg = config.aoeDmg;
        this.radius = config.radius;

        this.scene.physics.world.enable(this);

        // Grab image from game cache
        var img = Object.values(this.scene.textures.get(config.key))[2][0].texture.frames[0];

        var width = img.cutWidth*config.scale;
        var height = img.cutHeight*config.scale;

        this.body.setSize(width, height);

        // For spin
        this.body.allowRotation = true;
        this.body.angularVelocity = -10;
        //this.body.offset.set(config.width/2, config.height/2);

        this.anims.play(this.key, true);

        this.particles = this.scene.add.particles(config.key)

        this.emitter = this.particles.createEmitter({
            blendMode: 'ADD',
            scale: { start: 0.4, end: 0 },
            speed: { min: -100, max: 100 },
            quantity: 10
        });

        this.emitter.startFollow(this)

        this.scene.physics.add.collider(this, this.scene.enemies, (obj1, obj2) => { this.applyDamage(obj2); });

        // Decrement Spell Stock
        this.scene.player.spells[this.key].stock -=1;
        this.scene.guiScene.updateSpellsInventory(this.scene.player.spells)
    }

    update(time, delta){
        this.scene.physics.world.collide(this, this.scene.layers.ground, () => this.explode());

        const players = Object.values(this.scene.players)

        for (const player of players) {
            this.scene.physics.world.collide(this, player.sprite, () => this.explode(player.sprite));
        }
    }

    applyDamage(obj){
        console.log(obj.hp)
        obj.hp-=this.damage;
        this.explode();
    }

    explode(){
        if(this.isAOE===true){
            let aoe = new AOE({
                scene: this.scene,
                startPosition: {x: this.x, y: this.y},
                scale: 0.4,
                key: this.key,
                damage: this.damage,
                radius: this.radius
            });
        }

        if(this.scene.player.spells[this.key]!=undefined){
                this.scene.player.spells[this.key].projectiles.pop();

        }
        this.setActive(false);
        this.setVisible(false);﻿
        this.body.destroy();
        this.particles.destroy();
    }
}
