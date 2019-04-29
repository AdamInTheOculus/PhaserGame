/**
 * @author   AdamInTheOculus | JonCatalano
 * @date     April 24th 2019
 * @purpose  Contains client-side data and logic for anything related to the player.
 **/

import { MOVE_LEFT, MOVE_RIGHT, IDLE, JUMP, GAMEPAD, KEYBOARD } from './helpers/constants.js';
import Fireball_Spell from './spells/fireball.js'
import Ice_Spell from './spells/ice.js'

export default class Player extends Phaser.GameObjects.Sprite {
    constructor(data) {
        super(data.scene, data.spawnPoint.x, data.spawnPoint.y, data.key);
        this.scene = data.scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.id = data.id;
        this.name = data.name;
        this.hp = 400;
        this.spawnPoint = data.spawn;
        this.state = null;

        this.lastJumpTime = 0;
        this.canJump = true;
        this.canDoubleJump = false;

        this.cursorPosition = {};
        this.spells = {};

        // Grab image from game cache
        var img = Object.values(this.scene.textures.get(data.key))[2][0].texture.frames[0];

        var width = img.cutWidth;
        var height = img.cutHeight;

        this.body.setSize(width, height);
    }

    update(time, input) {
        if(this.hp<=0){
            this.kill();
        }
        
        this.time = time;
        let spellsArr = Object.values(this.spells);

        this.scene.guiScene.updateHealthBar(this.hp)
        this.scene.guiScene.updateSpellsInventory(this.spells, time)

        this.cursorPosition = {
            x: input.fire.position.x,
            y: input.fire.position.y
        };

        // ===================================================
        // == Handle input from gamepad if one is connected ==
        // ===================================================
        if(input.gamepad !== undefined) {

            if(input.gamepad.leftStick.x > 0.2) {
                this.body.setVelocityX(160);
                this.anims.play('right', true);
                this.state = MOVE_RIGHT
            } else if(input.gamepad.leftStick.x < -0.2) {
                this.body.setVelocityX(-160);
                this.anims.play('left', true);
                this.state = MOVE_LEFT;
            } else {
                this.body.setVelocityX(0);
                this.anims.play('turn');
                this.state = IDLE;
            }

            // Handle JUMP with A button
            if(input.gamepad.buttons[11].value) {
                this.handleJump(time);
                this.lastJumpTime = time;
            }

            // Handle spell cast with X button
            if(input.gamepad.buttons[13].value && this.coolDown <= 0) {
                this.shoot(0, GAMEPAD);
                this.coolDown = this.spells['fireball'].coolDown;
            }
        } // end of gamepad input

        // ===========================================
        // == Otherwise, handle input from keyboard ==
        // ===========================================
        else {
            if(input.left.isDown) {
                this.body.setVelocityX(-160);
                this.anims.play('left', true);
                this.state = MOVE_LEFT;
            }
            else if (input.right.isDown) {
                this.body.setVelocityX(160);
                this.anims.play('right', true);
                this.state = MOVE_RIGHT;
            } else if(input.gamepad === undefined) {
                this.body.setVelocityX(0);
                this.anims.play('turn');
                this.state = IDLE;
            }

            if(input.jump.isDown) {
                this.handleJump(input.jump.timeDown);
                this.lastJumpTime = input.jump.timeDown;
            }

            if(input.fire.isDown) {
                if(spellsArr[0]!=undefined){
                    if(time >= (spellsArr[0].lastCastTime+spellsArr[0].initCoolDown)){
                        spellsArr[0].lastCastTime = time;
                        this.shoot(0);
                    }
                }
            }

            if(input.key_binding_1.isDown) {
                if(spellsArr[0]!=undefined){
                    if(time >= (spellsArr[0].lastCastTime+spellsArr[0].initCoolDown)){
                        spellsArr[0].lastCastTime = time;
                        this.shoot(0);
                    }
                }
            }

            if(input.key_binding_2.isDown) {
                if(spellsArr[1]!=undefined){
                    if(time >= (spellsArr[1].lastCastTime+spellsArr[1].initCoolDown)){
                        spellsArr[1].lastCastTime = time;
                        this.shoot(1);
                    }
                }
            }
        } // end of keyboard/mouse input

        for(let i = 0; i<spellsArr.length;i++){
            spellsArr[i].update(this);
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
        if(this.canJump && this.body.blocked.down) {

            // Apply jumping force
            this.body.setVelocityY(-300);
            this.canJump = false;
            this.canDoubleJump = true;
        }

        // =============================================
        // == Secondary jump after falling off ground ==
        // =============================================
        else if(this.canJump && this.body.blocked.down === false) {

            // Apply jumping force
            this.body.setVelocityY(-300);
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
                this.body.setVelocityY(-300);
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
        let spritePosition = { x: this.x, y: this.y };

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
        let spellsArr = Object.values(this.spells);
        if(spellsArr[spellIndex]!=undefined){
            spellsArr[spellIndex].cast(this.scene, spritePosition, cursorPosition);
        }
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 25th 2019
     * @purpose  Changes player animation based on current player state.
    **/
    updatePlayerAnimation() {
        switch(this.state) {
            case MOVE_LEFT:
                this.anims.play('left', true);
                break;
            case MOVE_RIGHT:
                this.anims.play('right', true);
                break;
            case IDLE:
                this.anims.play('turn', true);
                break;
            // case JUMP:  NOTE: No jumping animation implemented yet.
            //     break;
            default: this.anims.play('turn', true);
        }
    }

    /**
     * @author   JonCatalano
     * @date     April 26th 2019
     * @purpose  Resets spells stock
    **/
    updateSpellStock(spellKey) {
        this.spells[spellKey].stock = this.spells[spellKey].initStock;
    }

    /**
     * @author   JonCatalano
     * @date     April 26th 2019
     * @purpose  Resets spells stock
    **/
    collectSpell(spellKey) {
        switch(spellKey){
            case 'fireball':
                this.spells[spellKey] = new Fireball_Spell(true);
                break;
            case 'iceball':
                this.spells[spellKey] = new Ice_Spell(true);
                break;
        }
    }

    /**
     * @author   JonCatalano
     * @date     April 26th 2019
     * @purpose  Deletes spell from player spell inventory
    **/
    removeSpell(spellKey) {
        delete this.spells[spellKey];
        this.scene.guiScene.removeSpellsInventory()
    }

    kill(){
        alert("YOU ARE DEAD :'(")
        this.body.setVelocityY(-200);
        location.reload();
    }
}
