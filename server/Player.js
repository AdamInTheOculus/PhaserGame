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

    update(delta, gravity, map) {

        switch(this.state) {
            case 1: this.moveLeft(delta); break;
            case 2: this.moveRight(delta); break;
            case 3: this.jump(delta); break;
            case 4: this.stopMoving(delta); break;
            default: ;
        }

        // Calculate next predicted position
        let newX = this.position.x + this.velocity.x * delta;
        let newY = this.position.y + this.velocity.y * delta;

        // If player will collide, set falling velocity to 0 and do not move player.
        let collider = this.getCollision(map, newX, newY);
        
        if(collider.bottom === true) {
            this.velocity.y = 0;
        } else if(collider.top === true) {
            this.velocity.y = 0;
        }

        if(collider.left === true && this.velocity.x < 0) {
            this.velocity.x = 0;
        } else if(collider.right === true && this.velocity.x > 0) {
            this.velocity.x = 0;
        }

        if(collider.bottom === false) {
            this.velocity.y += gravity * delta;
        }

        this.position.x = newX;
        this.position.y = newY;
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
        this.velocity.y = -0.3;
    }

    stopMoving(delta) {
        this.state = 4; 
        this.velocity.x = 0;
    }

    getCollision(map, x, y) {

        let collider = { 
            left:   this.isCollidingLeft(map, x, y),
            right:  this.isCollidingRight(map, x, y),
            top:    this.isCollidingUp(map, x, y),
            bottom: this.isCollidingDown(map, x, y)
        };

        return collider;
    }

    isCollidingUp(map, x, y) {

        let point = {};
        let divider = 6;
        let interval = this.size.w / divider;

        for(let i=0; i<divider; i++) {
            point.x = Math.floor(((x - (this.size.w / 2)) + (i * interval)) / map.tilewidth);
            point.y = Math.floor((y - (this.size.h / 2)) / map.tileheight);

            if(map.world['Collidable'][point.y] !== undefined) {
                if(map.world['Collidable'][point.y][point.x]) {
                    return true;
                }
            }
        }

        return false;
    }

    isCollidingDown(map, x, y) {

        let point = {};
        let divider = 6;
        let interval = this.size.w / divider;

        for(let i=0; i<divider; i++) {
            point.x = Math.floor(((x - (this.size.w / 2)) + (i * interval)) / map.tilewidth);
            point.y = Math.floor((y + (this.size.h / 2)) / map.tileheight);

            if(map.world['Collidable'][point.y] !== undefined) {
                if(map.world['Collidable'][point.y][point.x]) {
                    return true;
                }
            }
        }

        return false;
    }

    isCollidingLeft(map, x, y) {

        let point = {};
        let divider = 8;
        let interval = this.size.h / divider;

        // Check along left side of player to see if anything collides.
        for(let i=0; i<divider - 1; i++) {
            point.x = Math.floor((x - (this.size.w / 2)) / map.tilewidth);
            point.y = Math.floor(((y - (this.size.h / 2)) + (i * interval)) / map.tileheight);

            if(map.world['Collidable'][point.y] !== undefined) {
                if(map.world['Collidable'][point.y][point.x]) {
                    return true;
                }
            }
        }

        return false;
    }

    isCollidingRight(map, x, y) {

        let point = {};
        let divider = 8;
        let interval = this.size.h / divider;

        // Check along right side of player to see if anything collides.
        for(let i=0; i<divider - 1; i++) {
            point.x = Math.floor((x + (this.size.w / 2)) / map.tilewidth);
            point.y = Math.floor(((y - (this.size.h / 2)) + (i * interval)) / map.tileheight);

            if(map.world['Collidable'][point.y] !== undefined) {
                if(map.world['Collidable'][point.y][point.x]) {
                    return true;
                }
            }
        }

        return false;
    }
};
