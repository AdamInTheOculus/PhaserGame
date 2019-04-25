/**
 * @author   JonCatalano
 * @date     April 24th 2019
 * @purpose  Contains client-side data and logic for anything related to a fireball spell.
 **/

import Spell from './spell.js';
import Projectile from './projectile.js';

export default class Fireball_Spell extends Spell {
    constructor(isAOE) {
        super(isAOE);
        this.width = 20;
        this.height = 20;
        this.speed = 10;
        this.damage = 10;
        this.radius = 10;
        this.coolDown = 100;
        this.projectiles = [];
    }

    cast(scene, startPosition, pointerPosition) {
        let projectile = new Projectile({
            scene: scene,
            width: this.width,
            height: this.height,
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
        projectile.body.velocity.x =  300*Math.cos(angle);
        projectile.body.velocity.y = 300*Math.sin(angle);

        //this.play('potionGreen');

        //this.scene.sound.playAudioSprite('sfx', 'smb_fireball');

        // ====================================================================================================
        // == TODO: Add collision here. What will occur if the fireball collides with a player/wall/nothing? ==
        // ====================================================================================================

        // Reminder: You have access to `scene`.
        this.projectiles.push(projectile);
    }
}
