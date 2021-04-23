/**
 * @author   Adam Sinclair
 * @date     April 2021
 * @purpose  Contains client-side data and logic for game animations.
 **/

class AnimationHandler {

    constructor(scene) {
        this.scene = scene;
    }

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
    }
}

export default AnimationHandler;
