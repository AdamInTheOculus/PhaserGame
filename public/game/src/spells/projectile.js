/**
 * @author   JonCatalano
 * @date     April 24th 2019
 * @purpose  Contains client-side data and logic for anything related to a projectile.
 **/

export default class Projectile extends Phaser.GameObjects.Sprite {
    constructor(speed, damage, isAOE, radius, name) {
        this.speed = speed;
        this.damage = damage;
        this.isAOE = isAOE;
        this.radius = radius;
        this.name = name;
        //this.sprite = constants.fireball.sprite or something
    }

    shoot(x, y, pointerX, pointerY) {
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

    update(time, delta){
        if (!this.active) {
            return;
        }
        /* collision
        this.scene.physics.world.collide(this, this.scene.groundLayer, () => this.collided());
        this.scene.physics.world.overlap(this, this.scene.enemyGroup, (me, enemy) => {
            me.explode();
            enemy.starKilled();
        });
        */
    }

    collided() {
        console.log('COLLIDED');

        if (this.body.velocity.x === 0 || this.body.velocity.y === 0) {
            //this.scene.sound.playAudioSprite('sfx', 'smb_bump');
            this.explode();
        }
    }

    explode() {
        this.body.allowGravity = false;
        this.body.velocity.y = 0;
        //this.play('fireExplode');
    }
}
