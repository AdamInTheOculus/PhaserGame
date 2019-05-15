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
        this.velocity = {};
        this.collider = {};

        this.lastJumpTime = 0;
        this.canJump = true;
        this.canDoubleJump = false;

        this.cursorPosition = {};
        this.spells = {
            'ice': new Ice_Spell(true),
            'fireball': new Fireball_Spell(true)
        };
    }

    update(time, input) {
        this.time = time;
        let spellsArr = Object.values(this.spells);

        this.scene.guiScene.updateHealthBar(this.hp)
        this.scene.guiScene.updateSpellsInventory(this.spells, time)

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
                // this.sprite.setVelocityX(-160);
                // this.sprite.anims.play('left', true);

                if(this.state !== MOVE_LEFT) {
                    this.state = MOVE_LEFT;
                    this.scene.networkHandler.emitCommand(this.state);
                }
                
            }
            else if (input.right.isDown) {
                // this.sprite.setVelocityX(160);
                // this.sprite.anims.play('right', true);

                if(this.state !== MOVE_RIGHT) {
                    this.state = MOVE_RIGHT;
                    this.scene.networkHandler.emitCommand(this.state);
                }

            } else if(input.gamepad === undefined) {

                // this.sprite.setVelocityX(0);
                // this.sprite.anims.play('turn');

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

            if(input.fire.isDown) {
                if(spellsArr[0]!=undefined){
                    if(time >= (spellsArr[0].lastCastTime+spellsArr[0].initCoolDown)){

                        let data = {
                            index: 0,
                            spritePosition: {
                                x: this.sprite.x,
                                y: this.sprite.y
                            },
                            cursorPosition: worldPosition
                        };

                        // Send data to server that we shot a spell
                        this.scene.networkHandler.emitSpellCast(data);
                        spellsArr[data.index].lastCastTime = time;
                        this.shoot(data);
                    }
                }
            }

            if(input.key_binding_1.isDown) {
                if(spellsArr[0]!=undefined){
                    if(time >= (spellsArr[0].lastCastTime+spellsArr[0].initCoolDown)){

                        let data = {
                            index: 0,
                            spritePosition: {
                                x: this.sprite.x,
                                y: this.sprite.y
                            },
                            cursorPosition: worldPosition
                        };

                        // Send data to server that we shot a spell
                        this.scene.networkHandler.emitSpellCast(data);
                        spellsArr[data.index].lastCastTime = time;
                        this.shoot(data);
                    }
                }
            }

            if(input.key_binding_2.isDown) {
                if(spellsArr[1]!=undefined){
                    if(time >= (spellsArr[1].lastCastTime+spellsArr[1].initCoolDown)){
                        
                        let data = {
                            index: 1,
                            spritePosition: {
                                x: this.sprite.x,
                                y: this.sprite.y
                            },
                            cursorPosition: worldPosition
                        };

                        // Send data to server that we shot a spell
                        this.scene.networkHandler.emitSpellCast(data);
                        spellsArr[data.index].lastCastTime = time;
                        this.shoot(data);
                    }
                }
            }
        } // end of keyboard/mouse input

        for(let i = 0; i<spellsArr.length;i++){
            spellsArr[i].update(this);
        }
    }

    getPosition() {
        return { x:this.sprite.x, y:this.sprite.y };
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
        let spellsArr = Object.values(this.spells);
        if(spellsArr[spellIndex]!=undefined){
            spellsArr[spellIndex].cast(this.scene, spritePosition, cursorPosition);
        }
    }

    shoot(data){

        let spellsArr = Object.values(this.spells);

        // ==========================================================================
        // == NOTE: `this.spells` is not initialized until player picks up powerup ==
        // ==========================================================================
        if(spellsArr[data.index]!=undefined){
            spellsArr[data.index].cast(this.scene, data.spritePosition, data.cursorPosition);
        }

        console.log(spellsArr[data.index].projectiles.length);
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
            case JUMP:
                if(this.velocity.x > 0)      this.sprite.anims.play('right');
                else if(this.velocity.x < 0) this.sprite.anims.play('left');
                else                         this.sprite.anims.play('turn');
                break;
            default: this.sprite.anims.play('turn', true);
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
                this.scene.guiScene.updateSpellsInventory(this.scene.player.spells);
                break;
            case 'ice':
                this.spells[spellKey] = new Ice_Spell(true);
                this.scene.guiScene.updateSpellsInventory(this.scene.player.spells)
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
        this.scene.guiScene.removeSpellsInventory();
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 27th 2019
     * @purpose  Compresses player data that will be sent to server.
    **/
    getCompressedData() {

        let positionArray = new Float32Array(2); // 4 bytes per index
        let velocityArray = new Float32Array(2); // 4 bytes per index
        let state = new Uint8Array(1);           // 1 byte  per index

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
