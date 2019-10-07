const df = {
    id: 0,
    cash: 0,
    mobs: 1,
    player: 0,
}

let instances = 0
function Gang(st) {
    this.name = 'gang' + instances++
    augment(this, df)
    augment(this, st)
}

Gang.prototype.cashIn = function(cash) {
    if (!cash) return
    this.cash += cash
}

Gang.prototype.color = function() {
    return env.style.gang[this.id]
}

Gang.prototype.lowColor = function() {
    return env.style.gangLow[this.id]
}

Gang.prototype.control = function(df) {
    if (this.player
            && env.control.player[this.player]
            && env.control.player[this.player].active) {
        return env.control.player[this.player]
    } else {
        return df
    }
}
