/**
 * @author   JonCatalano
 * @date     April 24th 2019
 * @purpose  Contains client-side data and logic for anything related to a fireball spell.
 **/

import Spell from './spell.js';
import Projectile from './projectile.js';

export default class Fireball_Spell extends Spell {
    constructor(isAOE, time) {
        super(isAOE);
        this.key = 'fireball';
        this.icon = 'fireball_spell_icon';
        this.stock = this.initStock = 3;
        this.speed = 250;
        this.damage = 10;
        this.radius = 10;
        this.lastCastTime = 0;
        this.initCoolDown = 100;
        this.isAOE = true;
        this.projectiles = [];
    }

    /**
     * @author   JonCatalano
     * @date     April 24th 2019
     * @purpose  Casts the Fire Spell
     **/

    cast(scene, startPosition, pointerPosition) {
        let projectile = new Projectile({
            scene: scene,
            scale: 0.4,
            key: this.key,
            startPosition: startPosition,
            pointerPosition: pointerPosition,
            speed: this.speed,
            damage: this.damage,
            isAOE: this.isAOE,
            radius: this.radius
        });

        projectile.setActive(true);
        projectile.setVisible(true);

        projectile.body.allowGravity = true;

        projectile.setPosition(startPosition.x, startPosition.y);
        let angle = Phaser.Math.Angle.Between(startPosition.x, startPosition.y, pointerPosition.x, pointerPosition.y);
        projectile.body.velocity.x =  this.speed*Math.cos(angle);
        projectile.body.velocity.y = this.speed*Math.sin(angle);

        this.projectiles.push(projectile);
    }

    update(){
        this.projectiles.forEach(proj=>{
            proj.update();
        });
    }

    effect(){

    }
}
