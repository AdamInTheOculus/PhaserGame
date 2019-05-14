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
        if(this.willCollide(map, newX, newY)) {
            this.velocity.y = 0;
        } else {
            this.position.x = newX;
            this.position.y = newY;
            this.velocity.y += gravity * delta;
        }
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

    willCollide(map, x, y) {

        // Get corner points of player
        let collisionPoints = this.getCollisionPoints(x, y);
        let result = false;
        collisionPoints.forEach(point => {

            point.x = Math.floor(point.x / map.tilewidth);
            point.y = Math.floor(point.y / map.tileheight);

            if(map.world['Collidable'][point.y] !== undefined) {
                let value = map.world['Collidable'][point.y][point.x];

                if(value === 0 || value === undefined) {
                    return;
                } else {
                    result = true;
                    return;
                }
            }
        });
        
        return result;
    }

    getCollisionPoints(x, y) {

        let points = [];
        let halfWidth = this.size.w / 2;
        let halfHeight = this.size.h / 2;

        /**
         *
         *  Below is a representation of the player sprite. The bounding box is a rectangle
         *  with four points (A, B, C, D). 
         *
         *  The player position will ALWAYS be at the center of the bounding box. Therefore,
         *  any collision detection must be done on at least TWO of the corner points below.
         *
         *    A --------- B
         *     |         |
         *     |         |
         *     |         |
         *     |         |
         *     |         |
         *     |         |
         *    D --------- C
        **/

        let a = { x: x - halfWidth, y: y - halfHeight };
        let b = { x: x + halfWidth, y: y - halfHeight };
        let c = { x: x + halfWidth, y: y + halfHeight };
        let d = { x: x - halfWidth, y: y + halfHeight };

        // Player is moving right
        if(this.velocity.x > 0) {
            points.push(b, c);

            // Right downwards
            if(this.velocity.y > 0) {
                points.push(d);

            // Right upwards
            } else if(this.velocity.y < 0) {
                points.push(a);
            }
        }

        // Player is moving left
        else if(this.velocity.x < 0) {
            points.push(a, d);

            // Left downwards
            if(this.velocity.y > 0) {
                points.push(c);

            // Left upwards
            } else if(this.velocity < 0) {
                points.push(b);
            }
        }

        // Player is moving downwards
        else if(this.velocity.y > 0) {
            points.push(c, d);
        }

        // Player is moving upwards
        else if(this.velocity.y < 0) {
            points.push(a, b);
        }

        // Player not moving
        else {
            points.push(c, d);
        }

        return points;
    }
};
