/**
 * @author   AdamInTheOculus | JonCatalano
 * @date     April 24th 2019
 * @purpose  Contains client-side data and logic for anything related to the player.
 **/

import { MOVE_LEFT, MOVE_RIGHT, IDLE, JUMP, GAMEPAD, KEYBOARD } from './helpers/constants.js';

export default class Player {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.hp = 200;
        this.sprite = data.sprite;
        this.spawnPoint = data.spawn;
        this.scene = data.scene;
        this.state = null;
        this.velocity = {};
        this.collider = {};

        this.lastJumpTime = 0;
        this.canJump = true;
        this.canDoubleJump = false;

        this.cursorPosition = {};
    }

    update(time, input) {
        this.time = time;

        this.scene.guiScene.updateHealthBar(this.hp)

        this.cursorPosition = {
            x: input.fire.position.x,
            y: input.fire.position.y
        };

        let worldPosition = this.scene.cameras.main.getWorldPoint(this.cursorPosition.x, this.cursorPosition.y);
        this.cursorPosition = worldPosition;

        // ===================================================
        // == Handle input from gamepad if one is connected ==
        // ===================================================
        if(input.gamepad !== undefined) {

            if(input.gamepad.leftStick.x > 0.2) {
                this.sprite.setVelocityX(160);
                this.sprite.anims.play('right', true);
                this.state = MOVE_RIGHT;
            } else if(input.gamepad.leftStick.x < -0.2) {
                this.sprite.setVelocityX(-160);
                this.sprite.anims.play('left', true);
                this.state = MOVE_LEFT;
            } else {
                this.sprite.setVelocityX(0);
                this.sprite.anims.play('turn');
                this.state = IDLE;
            }

            // Handle JUMP with A button
            if(input.gamepad.buttons[11].value) {
                this.handleJump(time);
                this.lastJumpTime = time;
            }
        } // end of gamepad input

        // ===========================================
        // == Otherwise, handle input from keyboard ==
        // ===========================================
        else {
            if(input.left.isDown) {
                if(this.state !== MOVE_LEFT) {
                    this.state = MOVE_LEFT;
                    this.scene.networkHandler.emitCommand(this.state);
                }
            }
            else if (input.right.isDown) {
                if(this.state !== MOVE_RIGHT) {
                    this.state = MOVE_RIGHT;
                    this.scene.networkHandler.emitCommand(this.state);
                }
            } else if(input.gamepad === undefined) {
                if(this.state !== IDLE) {
                    this.state = IDLE;
                    this.scene.networkHandler.emitCommand(this.state);
                }
            }

            if(input.jump.isDown) {
                if(this.state !== JUMP) {
                    this.state = JUMP;
                    this.scene.networkHandler.emitCommand(this.state);
                }
            }
        } // end of keyboard/mouse input
    }

    getPosition() {
        return { x : this.sprite.x, y : this.sprite.y };
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 2021
     * @purpose  Handles single and double jump logic.
    **/
    handleJump(inputHeldTime) {

        // ===========================================
        // == Initial jump when player is on ground ==
        // ===========================================
        if(this.canJump && this.sprite.body.blocked.down) {

            // Apply jumping force
            this.sprite.body.setVelocityY(-300);
            this.canJump = false;
            this.canDoubleJump = true;
        }

        // =============================================
        // == Secondary jump after falling off ground ==
        // =============================================
        else if(this.canJump && this.sprite.body.blocked.down === false) {

            // Apply jumping force
            this.sprite.body.setVelocityY(-300);
            this.canJump = false;
            this.canDoubleJump = false;
        }

        // ==================================
        // == Secondary jump while mid-air ==
        // ==================================
        else {
            // Prevent double jump from occurring too rapidly. Wait 100ms between last key press.
            if(this.canDoubleJump && inputHeldTime > (this.lastJumpTime + 100)){
                this.canDoubleJump = false;
                this.sprite.body.setVelocityY(-300);
            }
        }
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 2021
     * @purpose  Resets player logic to allow an additional jump.
    **/
    addExtraJump() {
        this.canJump = false;
        this.canDoubleJump = true;
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 2021
     * @purpose  Changes player animation based on current player state.
    **/
    updatePlayerAnimation() {
        switch(this.state) {
            case MOVE_LEFT:
                this.sprite.anims.play('left', true);
                break;
            case MOVE_RIGHT:
                this.sprite.anims.play('right', true);
                break;
            case IDLE:
                this.sprite.anims.play('turn', true);
                break;
            default: this.sprite.anims.play('turn', true);
        }
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 2021
     * @purpose  Compresses player data that will be sent to server.
    **/
    getCompressedData() {
        const positionArray = new Float32Array(2); // 4 bytes per index
        const velocityArray = new Float32Array(2); // 4 bytes per index
        const state = new Uint8Array(1);           // 1 byte  per index

        positionArray[0] = this.sprite.x;
        positionArray[1] = this.sprite.y;
        velocityArray[0] = this.sprite.body.velocity.x;
        velocityArray[1] = this.sprite.body.velocity.y;
        state[0] = this.state;

        return {
            position: positionArray,
            velocity: velocityArray,
            state: state
        };
    }
}
