/**
 * @author   AdamInTheOculus | JonCatalano
 * @date     April 24th 2019
 * @purpose  Contains client-side data and logic for anything related to the player.
 **/

import { MOVE_LEFT, MOVE_RIGHT, IDLE, JUMP, GAMEPAD, KEYBOARD } from './helpers/constants.js';
import Fireball_Spell from './spells/fireball.js'
import Ice_Spell from './spells/ice.js'

export default class Player {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.hp = 200;
        this.sprite = data.sprite;
        this.spawnPoint = data.spawn;
        this.scene = data.scene;
        this.state = null;

        this.lastJumpTime = 0;
        this.canJump = true;
        this.canDoubleJump = false;

        this.cursorPosition = {};
        this.spells = {};
        this.spells['fireball'] = new Fireball_Spell(true);
        this.spells['ice'] = new Ice_Spell(true);
        this.coolDown = 0;
    }

    update(time, input) {
        this.spells['fireball'].projectiles.forEach(proj=>{
            proj.update();
        });
        this.spells['ice'].projectiles.forEach(proj=>{
            proj.update();
        });

        this.cursorPosition = {
            x: input.fire.position.x,
            y: input.fire.position.y
        };

        // ===================================================
        // == Handle input from gamepad if one is connected ==
        // ===================================================
        if(input.gamepad !== undefined) {

            if(input.gamepad.leftStick.x > 0.2) {
                this.sprite.setVelocityX(160);
                this.sprite.anims.play('right', true);
                this.state = MOVE_RIGHT
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

            // Handle spell cast with X button
            if(input.gamepad.buttons[13].value && this.coolDown <= 0) {
                this.shoot('fireball', GAMEPAD);
                this.coolDown = this.spells['fireball'].coolDown;
            }
        } // end of gamepad input

        // ===========================================
        // == Otherwise, handle input from keyboard ==
        // ===========================================
        else {
            if(input.left.isDown) {
                this.sprite.setVelocityX(-160);
                this.sprite.anims.play('left', true);
                this.state = MOVE_LEFT;
            }
            else if (input.right.isDown) {
                this.sprite.setVelocityX(160);
                this.sprite.anims.play('right', true);
                this.state = MOVE_RIGHT;
            } else if(input.gamepad === undefined) {
                this.sprite.setVelocityX(0);
                this.sprite.anims.play('turn');
                this.state = IDLE;
            }

            if(input.jump.isDown) {
                this.handleJump(input.jump.timeDown);
                this.lastJumpTime = input.jump.timeDown;
            }

            if(input.fire.isDown&&this.coolDown<=0) {

                // let center = {
                //     x: this.sprite.x,
                //     y: this.sprite.y
                // };

                // let topLeft = {
                //     x: this.sprite.x - (this.sprite.displayWidth / 2),
                //     y: this.sprite.y - (this.sprite.displayHeight / 2)
                // };

                // let topRight = {
                //     x: this.sprite.x + (this.sprite.displayWidth / 2),
                //     y: this.sprite.y - (this.sprite.displayHeight / 2)
                // };

                // let bottomLeft = {
                //     x: this.sprite.x - (this.sprite.displayWidth / 2),
                //     y: this.sprite.y + (this.sprite.displayHeight / 2)
                // };

                // let bottomRight = {
                //     x: this.sprite.x + (this.sprite.displayWidth / 2),
                //     y: this.sprite.y + (this.sprite.displayHeight / 2)
                // };

                // center.coords = {
                //     x:  Math.floor(center.x / 32),
                //     y:  Math.floor(center.y / 32)
                // }

                // topLeft.coords = {
                //     x:  Math.floor(topLeft.x / 32),
                //     y:  Math.floor(topLeft.y / 32)
                // }

                // topRight.coords = {
                //     x:  Math.floor(topRight.x / 32),
                //     y:  Math.floor(topRight.y / 32)
                // }

                // bottomLeft.coords = {
                //     x:  Math.floor(bottomLeft.x / 32),
                //     y:  Math.floor(bottomLeft.y / 32)
                // }

                // bottomRight.coords = {
                //     x:  Math.floor(bottomRight.x / 32),
                //     y:  Math.floor(bottomRight.y / 32)
                // }

                // console.log(topLeft);
                // console.log(topRight);
                // console.log(bottomLeft);
                // console.log(bottomRight);
                // console.log(`Width [${this.sprite.displayWidth}] ---- Height [${this.sprite.displayHeight}]`);

                this.shoot('fireball');
                this.coolDown = this.spells['fireball'].coolDown;
            }

            if(input.key_binding_1.isDown&&this.coolDown<=0) {
                this.shoot('fireball');
                this.coolDown = this.spells['fireball'].coolDown;
            }

            if(input.key_binding_2.isDown&&this.coolDown<=0) {
                this.shoot('ice');
                this.coolDown = this.spells['ice'].coolDown;
            }
        } // end of keyboard/mouse input

        if(this.coolDown > 0) {
            this.coolDown -= 1;
        }
    }

    /**
     * @author   AdamInTheOculus
     * @date     March 18th 2019
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

            // Prevent double jump from occurring too rapidly. Wait for 100ms between last key press.
            if(this.canDoubleJump && inputHeldTime > (this.lastJumpTime + 100)){
                this.canDoubleJump = false;
                this.sprite.body.setVelocityY(-300);
            }
        }
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 24th 2019
     * @purpose  Resets player logic to allow an additional jump.
    **/
    addExtraJump() {
        this.canJump = false;
        this.canDoubleJump = true;
    }

    shoot(spellIndex, inputType){

        let cursorPosition = {};
        let spritePosition = { x: this.sprite.x, y: this.sprite.y };

        switch(inputType) {
            case KEYBOARD:
                cursorPosition = { x: this.cursorPosition.x, y: this.cursorPosition.y };
                break;
            case GAMEPAD:
                cursorPosition = { x: 100, y: 100 };
                break;
            default:
                cursorPosition = { x: this.cursorPosition.x, y: this.cursorPosition.y };
        }

        this.spells[spellIndex].cast(this.scene, spritePosition, cursorPosition);
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 25th 2019
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
            // case JUMP:  NOTE: No jumping animation implemented yet.
            //     break;
            default: this.sprite.anims.play('turn', true);
        }
    }
}
