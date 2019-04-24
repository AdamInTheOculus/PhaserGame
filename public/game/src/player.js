/**
 * @author   AdamInTheOculus | JonCatalano
 * @date     April 24th 2019
 * @purpose  Contains client-side data and logic for anything related to the player.
 **/
import Fireball_Spell from './spells/fireball.js'

export default class Player {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.sprite = data.sprite;
        this.spawnPoint = data.spawn;
        this.scene = data.scene;

        this.lastJumpTime = 0;
        this.canJump = true;
        this.canDoubleJump = false;
        this.spells = {};
        this.spells['fireball'] = new Fireball_Spell(true);
    }

    update(input) {

        // ===================================================
        // == Handle input from gamepad if one is connected ==
        // ===================================================
        if(input.gamepad !== undefined) {

            if(gamepad.leftStick.x > 0.2) {
                this.sprite.setVelocityX(160);
                this.sprite.anims.play('right', true);
            } else if(gamepad.leftStick.x < -0.2) {
                this.sprite.setVelocityX(-160);
                this.sprite.anims.play('left', true);
            } else {
                this.sprite.setVelocityX(0);
                this.sprite.anims.play('turn');
            }
        }

        // ===========================================
        // == Otherwise, handle input from keyboard ==
        // ===========================================
        if(input.left.isDown) {
            this.sprite.setVelocityX(-160);
            this.sprite.anims.play('left', true);
        }
        else if (input.right.isDown) {
            this.sprite.setVelocityX(160);
            this.sprite.anims.play('right', true);
        } else if(input.gamepad === undefined) {
            this.sprite.setVelocityX(0);
            this.sprite.anims.play('turn');
        }

        if(input.jump.isDown) {
            this.handleJump(input.jump.timeDown);
            this.lastJumpTime = input.jump.timeDown;
        }

        if(input.fire.isDown) {
            alert(input.fire.isDown)
            this.shoot('fireball')
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

                console.log('Is about to double jump!');

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
        alert('shooting')
        this.spells[spellIndex].cast(this.scene, {x: this.sprite.x, y: this.sprite.y}, {x: 100, y: 100});
    }
}
