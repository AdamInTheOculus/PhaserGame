/**
 * @author   JonCatalano
 * @date     April 24th 2019
 * @purpose  Contains client-side data and logic for anything related to a projectile.
 **/

class Projectile {
    constructor(speed, damage, isAOE, radius, name) {
        this.speed = speed;
        this.damage = damage;
        this.isAOE = isAOE;
        this.radius = radius;
        this.name = name;
        //this.sprite = constants.fireball.sprite or something
    }

    update(){

    }
}

export default Projectile;
