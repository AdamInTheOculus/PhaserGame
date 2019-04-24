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
        this.speed = 10;
        this.damage = 10;
        this.radius = 10;
        this.coolDown = 100;
    }

    cast(scene, startPosition, pointerPosition) {
        let projectile = new Projectile({
            scene: scene,
            startPosition: startPosition,
            pointerPosition: pointerPosition,
            speed: this.speed,
            damage: this.damage,
            isAOE: this.isAOE,
            radius: this.radius});

        projectile.setActive(true);
        projectile.setVisible(true);

        projectile.body.allowGravity = true;

        projectile.setPosition(startPosition.x, startPosition.y);
        let angle = Phaser.Math.Angle.Between(startPosition.x, startPosition.y, projectile.scene.cameras.main.scrollX+pointerPosition.x, projectile.scene.cameras.main.scrollY+pointerPosition.y)
        console.log(angle)
        projectile.body.velocity.x =  300*Math.cos(angle);
        projectile.body.velocity.y = 300*Math.sin(angle);

        //this.play('potionGreen');

        //this.scene.sound.playAudioSprite('sfx', 'smb_fireball');
    }
}
