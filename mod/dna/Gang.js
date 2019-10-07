const df = {
    id: 0,
    cash: 0,
    mobs: 1,
    player: 0,
}

function Gang(st) {
    augment(this, df)
    augment(this, st)
}

Gang.prototype.color = function() {
    return env.style.gang[this.id]
}

Gang.prototype.lowColor = function() {
    return env.style.gangLow[this.id]
}
