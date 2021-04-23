/**
 * @author   AdamInTheOculus
 * @date     April 2021
 * @purpose  Class that handles all gamepad/keyboard/mouse input.
 */

class InputHandler {

    constructor(phaserInput) {
        this.input = phaserInput;
    }

    update() {
        /**
         * In order for Gamepad input to be properly registered, we must manually update input.
         * This is because of an InputPlugin bug -- not having InputPlugin.update() called automatically every frame.
         *
         * @author  AdamInTheOculus
         * @date    April 7th 2019
         * @see     https://github.com/photonstorm/phaser/issues/4414#issuecomment-480515615
        **/

        // Issue is fixed.
        this.input.update();
    }

    getState() {
        return {
            jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W) || 
                  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            fire: this.input.activePointer,
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            gamepad: this.input.gamepad.gamepads[0]
        };
    }
}

export default InputHandler;