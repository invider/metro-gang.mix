
function Walker() {}

Walker.prototype.init = function(bro) {
    this.bro = bro
    this.action = 0
    this.timeout = 0
    this.control = {}
}

Walker.prototype.idle = function() {
    const c = this.control
    c.left = false
    c.right = false
    c.jump = false
    c.block = false
    c.punch = false
}

Walker.prototype.follow = function() {
    this.idle()

    const c = this.control
    switch(this.action) {
    case 1: break;
    case 2: c.left= true; break;
    case 3: c.right = true; break;
    case 4: c.down = true; break;
    case 5: c.punch = true; break;
    case 6: c.jump = true; break;
    case 7: c.jump = true; c.left = true; break;
    case 8: c.jump = true; c.right = true; break;
    case 9: c.punch= true; c.left = true; break;
    case 10: c.punch= true; c.right= true; break;
    }
}

Walker.prototype.evo = function(dt) {

    if (this.action) {
        this.follow() 
        this.timeout -= dt
        if (this.timeout < 0) this.action = 0

        // TODO evaluate situation and maybe change cur action
        //
    } else {
        // select next one
        this.action = RND(1, 3)
        switch(this.action) {
            case 0: this.timeout = rnd(1, 3); break;
            default: this.timeout = rnd(0.2, 0.7); break;
        }
    }
}
