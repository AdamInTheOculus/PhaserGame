/**
 * @author   JonCatalano
 * @date     April 24th 2019
 * @purpose  Contains client-side data and logic for anything related to a fireball spell.
 **/

import Spell from './spell.js';
import Projectile from './projectile.js';

export default class Ice_Spell extends Spell {
    constructor(isAOE) {
        super(isAOE);
        this.key = 'ice';
        this.speed = 1000;
        this.damage = 10;
        this.radius = 10;
        this.coolDown = 100;
        this.projectiles = [];
    }

    /**
    * @author   JonCatalano
    * @date     April 26th 2019
    * @purpose  Casts the Ice_Spell
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
        let angle = Phaser.Math.Angle.Between(startPosition.x, startPosition.y, projectile.scene.cameras.main.scrollX+pointerPosition.x, projectile.scene.cameras.main.scrollY+pointerPosition.y)
        projectile.body.velocity.x =  this.speed*Math.cos(angle);
        projectile.body.velocity.y = this.speed*Math.sin(angle);

        //this.play('potionGreen');

        //this.scene.sound.playAudioSprite('sfx', 'smb_fireball');

        // ====================================================================================================
        // == TODO: Add collision here. What will occur if the fireball collides with a player/wall/nothing? ==
        // ====================================================================================================

        // Reminder: You have access to `scene`.
        this.projectiles.push(projectile);
    }

    effect(){

    }
}
