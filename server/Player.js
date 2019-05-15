/**
 * @author   AdamInTheOculus
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
        this.lastSpawn = {x: spawnpoint.x, y: spawnpoint.y};

        this.maxVelocityX = 0.25;
        this.jumpVelocity = -0.325;
        this.velocity = { x:0, y:0 };

        this.timeSinceJump = 0;
        this.jumpTimeDelay = 250; // 250ms delay between jumps
        this.canJump = true;
        this.canDoubleJump = false;

        this.highestTime = 0;

        this.collider = { top:false, bottom:false, left:false, right:false };

        this.hasUpdated = false;
    }

    update(delta, gravity, map) {

        // Calculate next predicted position
        let newX = this.position.x + this.velocity.x * delta;
        let newY = this.position.y + this.velocity.y * delta;

        // Get info of player colliding with world
        this.collider = this.getWorldCollision(map, newX, newY);

        switch(this.state) {
            case 1: this.moveLeft(delta); break;
            case 2: this.moveRight(delta); break;
            case 3: this.jump(delta); break;
            case 4: this.stopMoving(delta); break;
            default: ;
        }

        this.timeSinceJump += delta;

        let shouldUpdatePosition = true;

        if(this.collider.top === true) {
            this.velocity.y = 0;
            shouldUpdatePosition = false;
        }

        if(this.collider.bottom === true) {
            this.velocity.y = 0;
            this.canJump = true;
        }

        if(this.collider.left === true && this.velocity.x < 0) {
            this.velocity.x = 0;
        } else if(this.collider.right === true && this.velocity.x > 0) {
            this.velocity.x = 0;
        }

        if(this.collider.bottom === false) {
            this.velocity.y += gravity * delta;
        }

        if(shouldUpdatePosition) {
            this.position.x = newX;
            this.position.y = newY;
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

        // ===========================================
        // == Initial jump when player is on ground ==
        // ===========================================
        if(this.canJump && this.collider.bottom) {

            // Apply jumping force
            this.velocity.y = this.jumpVelocity;
            this.canJump = false;
            this.canDoubleJump = true;
            this.collider.bottom = false;

            this.timeSinceJump = 0;
        }

        // =============================================
        // == Secondary jump after falling off ground ==
        // =============================================
        else if(this.canJump && this.collider.bottom === false) {

            // Apply jumping force
            this.velocity.y = this.jumpVelocity;
            this.canJump = false;
            this.canDoubleJump = false;
        }

        // ==================================
        // == Secondary jump while mid-air ==
        // ==================================
        else {
            // Prevent double jump from occurring too rapidly. Wait for 100ms between last key press.
            if(this.canDoubleJump && this.timeSinceJump > this.jumpTimeDelay){
                
                // Apply jumping force
                this.velocity.y = this.jumpVelocity;
                this.canDoubleJump = false;
            }
        }
    }

    stopMoving(delta) {
        this.state = 4; 
        this.velocity.x = 0;
    }

    getWorldCollision(map, x, y) {

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
        let divider = 8;
        let interval = this.size.w / divider;

        for(let i=1; i<divider; i++) {
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
        let divider = 8;
        let interval = this.size.w / divider;

        for(let i=1; i<divider; i++) {
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
        let divider = 12;
        let interval = this.size.h / divider;

        // Check along left side of player to see if anything collides.
        for(let i=0; i<divider; i++) {
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
        let divider = 12;
        let interval = this.size.h / divider;

        // Check along right side of player to see if anything collides.
        for(let i=0; i<divider; i++) {
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
