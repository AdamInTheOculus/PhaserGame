/**
 * @author   JonCatalano
 * @date     April 24th 2019
 * @purpose  Contains client-side data and logic for anything related to a fireball spell.
 **/

import Spell from './spell.js';

export default class Fireball extends Spell {
    constructor(scene, isAOE, isProjectile, damage) {
        super(scene, isAOE, isProjectile, damage);
        this.id = scene.ids.fireball;
        alert(this.id)

        this.scene.physics.world.enable(this);

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
}
