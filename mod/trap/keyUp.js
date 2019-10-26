function keyUp(e) {
    switch(e.code) {
    /*
    // player 1 controls
    case 'KeyD': env.control.stop(1, 'right'); break;
    case 'KeyA': env.control.stop(1, 'left'); break;
    case 'KeyW': env.control.stop(1, 'jump'); break;
    case 'KeyS': env.control.stop(1, 'block'); break;
    case 'Space': env.control.stop(1, 'kick'); break;
    case 'ShiftLeft': env.control.stop(1, 'punch'); break;
    // player 2 controls
    case 'ArrowRight': env.control.stop(2, 'right'); break;
    case 'ArrowLeft': env.control.stop(2, 'left'); break;
    case 'ArrowUp': env.control.stop(2, 'jump'); break;
    case 'ArrowDown': env.control.stop(2, 'block'); break;
    case 'ShiftRight': env.control.stop(2, 'kick'); break;
    case 'Enter': env.control.stop(2, 'punch'); break;
    */
    case 'KeyO': if (!env.lock) _.paused = false; break;
    case 'F7': case 'Digit7': lab.debug.cast.stopScreencast(); break;
    case 'F6': case 'Digit6': lab.debug.cast.stopGif(); break;
    }

    const p = lab.control.player
    const c = lab.control.mapping.keys[e.code]
    if (c) {
        p.stop(floor(c/100), c % 100)
    }
}
