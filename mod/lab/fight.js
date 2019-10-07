
function init() {
    this.timer = 0
}

function evo(dt) {
    if (env.state !== 'street') return
    this.timer -= dt

    if (this.timer < 0) {
        trap('finish', {
            station: this.station,
            gang: this.gang,
        })
    }
}

function begin(station, gang) {
    this.station = station
    this.gang = gang
    this.timer = env.tune.roundTime
}
