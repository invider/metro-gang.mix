function init() {
    this.hidden = true
}

function show(stat, time, onFinish) {
    this.stat = stat
    this.time = time
    this.onFinish = onFinish
    this.hidden = false

    console.dir(stat)
}

function hide() {
    this.hidden = true
    if (this.onFinish) this.onFinish()
}

function evo(dt) {
    if (this.hidden) return
    this.time -= dt

    if (this.time < 0) this.hide()
}

function drawStation(station, y) {
    fill(station.gang.color())
    if (station.gang.id > 0 && station.mobs > 0) {
        text(station.name + ' - ' + station.mobs, rx(.5), y)
    } else {
        text(station.name, rx(.5), y)
    }
}

function gangStat(gstat, y) {
    const gang = lab.gang[gstat.id]

    let th = env.style.scoreSize * env.scale
    fill(gang.color())
    font(th + 'px coolville')

    text(lab.gang[gstat.id].name, rx(.3), y)
    text(gstat.mobs, rx(.5), y)
    text('$' + gstat.cash, rx(.7), y)
}

function drawStat(st, diff, summary) {
    let th = env.style.scoreSize * env.scale
    font(th + 'px coolville')
    alignCenter()
    baseMiddle()

    let y = ry(.2)
    let step = ry(.07)

    drawStation(st.station, y)

    if (summary) {
        y += step
        text(summary, rx(.5), y)
    }

    y += 1.3*step
    for (let i = 0; i < st.gang.length; i++) {
        if (st.gang[i].mobs > 0) {
            gangStat(st.gang[i], y)
            y += step
        }
    }
}

function draw() {
    if (this.stat.finish) {
        let summary
        if (this.stat.diff.newOwner >= 0) {
            summary = 'captured by ' + lab.gang[this.stat.diff.newOwner].name
        }
        drawStat(this.stat.finish, this.stat.diff, summary)
    } else {
        drawStat(this.stat.start)
    }
}
