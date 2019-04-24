/**
 * @author   JonCatalano
 * @date     April 24th 2019
 * @purpose  Contains client-side data and logic for anything related to a fireball spell.
 **/

class Fireball {
    constructor(isAOE, isProjectile, damage) {
        this.isAOE = isAOE;
        this.isProjectile = isProjectile;
        this.speed = 0;
        this.damage = 0; // (x<0,heal) (x==0,none) (x>0,dmg)
        this.radius = 0;
        this.name = 'fireball';
    }
}

export default Fireball;
