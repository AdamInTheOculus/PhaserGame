/**
 * @author   AdamInTheOculus | JonCatalano
 * @date     April 24th 2019
 * @purpose  Contains client-side data and logic for anything related to the player.
 **/

import { MOVE_LEFT, MOVE_RIGHT, IDLE, JUMP } from './helpers/constants.js';
import Fireball_Spell from './spells/fireball.js'

export default class Player {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
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
        this.coolDown = 0;
    }

    update(input) {

        this.cursorPosition = {
            x: input.fire.position.x,
            y: input.fire.position.y
        };

        // ===================================================
        // == Handle input from gamepad if one is connected ==
        // ===================================================
        if(input.gamepad !== undefined) {

            if(gamepad.leftStick.x > 0.2) {
                this.sprite.setVelocityX(160);
                this.sprite.anims.play('right', true);
                this.state = MOVE_RIGHT
            } else if(gamepad.leftStick.x < -0.2) {
                this.sprite.setVelocityX(-160);
                this.sprite.anims.play('left', true);
                this.state = MOVE_LEFT;
            } else {
                this.sprite.setVelocityX(0);
                this.sprite.anims.play('turn');
                this.state = IDLE;
            }
        }

        // ===========================================
        // == Otherwise, handle input from keyboard ==
        // ===========================================
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
            this.shoot('fireball');
            this.coolDown = this.spells['fireball'].coolDown;
        }

        if(input.key_binding_1.isDown) {
            alert('KEY BINDING 1');
        }

        if(input.key_binding_2.isDown) {
            alert('KEY BINDING 2');
        }

        this.coolDown -= 1;
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

    shoot(spellIndex){
        let spritePosition = { x: this.sprite.x, y: this.sprite.y };
        let cursorPosition = { x: this.cursorPosition.x, y: this.cursorPosition.y };
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
