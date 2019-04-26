/**
 * @author   JonCatalano
 * @date     April 24th 2019
 * @purpose  Contains client-side data and logic for game animations.
 **/
 export default function makeAnimations(scene) {
     // =============================
     // == Setup player animations ==
     // =============================
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

     scene.anims.create({
         key: 'fireball',
         frames: scene.anims.generateFrameNumbers('fireball', { start: 0, end: 23 }),
         frameRate: 20,
         repeat: -1
     });

     scene.anims.create({
         key: 'ice',
         frames: scene.anims.generateFrameNumbers('ice', { start: 0, end: 19 }),
         frameRate: 10,
         repeat: -1
     });
}
