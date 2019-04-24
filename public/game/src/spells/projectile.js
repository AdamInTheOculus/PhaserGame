/**
 * @author   JonCatalano
 * @date     April 24th 2019
 * @purpose  Contains client-side data and logic for anything related to a projectile.
 **/

export default class Projectile extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.startPosition.x, config.startPosition.y, 'dude')

        this.speed = config.speed;
        this.damage = config.damage;
        this.isAOE = config.isAOE;
        this.radius = config.radius;

        config.scene.physics.world.enable(this);

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
        if (!this.active) {
            return;
        }

        config.scene.physics.world.collide(this, config.scene.groundLayer, () => this.collided());
        config.scene.physics.world.overlap(this, config.scene.enemyGroup, (me, enemy) => {
            me.explode();
        });
    }

    collided() {
        console.log('COLLIDED');

        if (this.body.velocity.x === 0 || this.body.velocity.y === 0) {
            //config.scene.sound.playAudioSprite('sfx', 'smb_bump');
            this.explode();
        }
    }

    explode() {
        this.body.allowGravity = false;
        this.body.velocity.y = 0;
        //this.play('fireExplode');
    }
}
