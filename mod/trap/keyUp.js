function keyUp(e) {
    switch(e.code) {
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
    }
}