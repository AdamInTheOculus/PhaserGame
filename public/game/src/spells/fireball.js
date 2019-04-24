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
    }

    cast(physics, startPosition, pointerPosition) {
        let projectile = new Projectile({
            physics: physics,
            startPosition: startPosition,
            pointerPosition: pointerPosition,
            speed: this.speed,
            damage: this.damage,
            isAOE: this.isAOE,
            radius: this.radius});
        this.setActive(true);
        this.setVisible(true);

        this.body.allowGravity = true;

        this.setPosition(x, y);
        this.angle = Phaser.Math.Angle.Between(x, y, this.scene.cameras.main.scrollX+pointerX, this.scene.cameras.main.scrollY+pointerY)
        this.body.velocity.x =  300*Math.cos(this.angle);
        this.body.velocity.y = 300*Math.sin(this.angle);
        //this.play('potionGreen');

        //this.scene.sound.playAudioSprite('sfx', 'smb_fireball');
        console.log(this.scene.physics.world.collide);
    }
}
