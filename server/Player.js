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

        this.maxVelocityX = 0.3;
        this.lastSpawn = {x: spawnpoint.x, y: spawnpoint.y};
    }

    update(delta, gravity) {

        switch(this.state) {
            case 1: this.moveLeft(delta); break;
            case 2: this.moveRight(delta); break;
            case 3: this.jump(delta); break;
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
        this.velocity.y = -0.5;
    }

    stopMoving(delta) {
        this.state = 4; 
        this.velocity.x = 0;
    }

    willCollide(map, delta, gravity) {
        let pos = {
            x: this.position.x + ((this.velocity.x + gravity * delta) * delta),
            y: this.position.y + ((this.velocity.y + gravity * delta) * delta)
        };

        let x = Math.floor(pos.x / map.tilewidth);
        let y = Math.floor(pos.y / map.tileheight);
        
        if(map.world[0][y] !== undefined) {

            let value = map.world[0][y][x];

            if(value === 0 || value === undefined) {
                return false;
            } else {
                return true;
            }
        }

        return false;
    }
};
