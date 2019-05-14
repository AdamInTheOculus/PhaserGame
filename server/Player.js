/**
 * @author   JonCatalano
 * @date     April 16th 2019
 * @purpose  Player class for server update information
**/

module.exports = class Player {
    constructor(id, spawnpoint) {
        this.id = id;
        this.hp = 100;
        this.size = { w:0, h:0 };
        this.state = -1;
        this.position = spawnpoint;
        this.velocity = { x:0, y:0 };
        this.hasUpdated = false;

        this.maxVelocityX = 0.25;
    }

    update(delta, gravity) {

        switch(this.state) {
            case 1: this.moveLeft(delta); break;
            case 2: this.moveRight(delta); break;
            case 3: break;
            case 4: this.stopMoving(delta); break;
            default: ;
        }

        this.velocity.y += gravity * delta;
        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;
    }

    moveLeft(delta) {
        this.state = 1;

        if(this.velocity.x > -this.maxVelocityX) {
            this.velocity.x -= 0.01 * delta;
        } else {
            this.velocity.x = -this.maxVelocityX;
        }
    }

    moveRight(delta) {
        this.state = 2;

        if(this.velocity.x < this.maxVelocityX) {
            this.velocity.x += 0.01 * delta;
        } else {
            this.velocity.x = this.maxVelocityX;
        }
    }

    jump(delta) {
        this.state = 3;
        // this.velocity.y = -20;
    }

    stopMoving(delta) {
        this.state = 4; 
        this.velocity.x = 0;
    }

    willCollide(map, delta, gravity) {

        let newVelocity = {
            x: this.velocity.x,
            y: this.velocity.y + (this.velocity.y + gravity * delta)
        };

        let newPosition = {
            x: this.position.x + (newVelocity.x * delta),
            y: this.position.y + (newVelocity.y * delta)
        };

        return true;
    }
};
