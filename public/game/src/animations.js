/**
 * @author   Adam Sinclair
 * @date     April 2021
 * @purpose  Contains client-side data and logic for game animations.
 **/
 export default function makeAnimations(scene) {
    scene.anims.create({
         key: 'left',
         frames: scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
         frameRate: 10,
         repeat: -1
    });

    scene.anims.create({
         key: 'turn',
         frames: [ { key: 'dude', frame: 4 } ],
         frameRate: 20
    });

    scene.anims.create({
         key: 'right',
         frames: scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
         frameRate: 10,
         repeat: -1
    });
}
