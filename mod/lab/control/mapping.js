const mapping = {

    GAMEPAD_ID_SHIFT: 1,
    KEYBOARD_ID_SHIFT: 5,

    keyboard: [
        [ 'KeyW', 'KeyA', 'KeyS', 'KeyD',
        'KeyF', 'KeyG', 'KeyH', 'KeyJ' ],

        [ 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight',
        'Enter', 'ShiftRight', 'Quote', 'Semicolon' ],

        [ 'Numpad8', 'Numpad4', 'Numpad2', 'Numpad6',
        'Backspace', 'Backslash', 'Equal', 'Minus' ],

        [ 'KeyZ', 'KeyX', 'Space', 'KeyC',
        'KeyN', 'KeyM', 'Comma', 'Period' ],
    ],

    keys: {},

    index: function() {
        for (let c = 0; c < this.keyboard.length; c++) {
            const m = this.keyboard[c]
            for (let k = 0; k < m.length; k++) {
                this.keys[m[k]] = (c+this.KEYBOARD_ID_SHIFT) * 100+(k+1)
            }
        }
    },

    init: function() {
        this.index()
    },
}
