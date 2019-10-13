let shots = 0

function keyDown(e) {
    if (e.repeat) return

    switch(e.code) {
    // player 1 controls
    case 'KeyD': env.control.move(1, 'right'); break;
    case 'KeyA': env.control.move(1, 'left'); break;
    case 'KeyW': env.control.move(1, 'jump'); break;
    case 'KeyS': env.control.move(1, 'block'); break;
    case 'Space': env.control.move(1, 'kick'); break;
    case 'ShiftLeft': env.control.move(1, 'punch'); break;
    // player 2 controls
    case 'ArrowRight': env.control.move(2, 'right'); break;
    case 'ArrowLeft': env.control.move(2, 'left'); break;
    case 'ArrowUp': env.control.move(2, 'jump'); break;
    case 'ArrowDown': env.control.move(2, 'block'); break;
    case 'ShiftRight': env.control.move(2, 'kick'); break;
    case 'Enter': env.control.move(2, 'punch'); break;

    case 'KeyP':
            if (!env.lock) _.paused = !_.paused
            break;
    case 'KeyH':
            if (!_.paused && !env.lock) _.paused = true
            break;

    case 'F4':
            if (env.lock) _.paused = false
            else _.paused = true
            env.lock = !env.lock
            break;
            
    case 'F8': case 'Digit8':
            lib.img.screenshot('metro-gang' + (++shots));
            break;

    case 'F7': case 'Digit7': lab.debug.cast.startScreencast(); break;
    case 'F6': case 'Digit6': lab.debug.cast.startGif(); break;
    }

    lab.debug.cheat.key(e.key)
}
