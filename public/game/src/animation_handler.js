/**
 * @author   JonCatalano
 * @date     April 24th 2019
 * @purpose  Contains client-side data and logic for game animations.
 **/

class AnimationHandler {

    constructor(scene) {
        this.scene = scene;
    }

    /**
     * @author   JonCatalano
     * @date     April 24th 2019
     * @purpose  Create all animations for the game.
     **/
    setupAnimations() {
        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'fireball',
            frames: this.scene.anims.generateFrameNumbers('fireball', { start: 0, end: 23 }),
            frameRate: 20,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'ice',
            frames: this.scene.anims.generateFrameNumbers('ice', { start: 0, end: 19 }),
            frameRate: 10,
            repeat: -1
        });
    }
}

export default AnimationHandler;
