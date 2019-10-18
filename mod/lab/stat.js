function init() {
    this.hidden = true
}

function show(stat, time, onFinish) {
    this.stat = stat
    this.time = time
    this.onFinish = onFinish
    this.hidden = false
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

function drawStation(y, station) {
    fill(station.gang.color())
    if (station.gang.id > 0 && station.mobs > 0) {
        text(station.name + ' - ' + station.mobs, rx(.5), y)
    } else {
        text(station.name, rx(.5), y)
    }
}

function gangStat(y, gstat, gdiff) {
    const gang = lab.gang[gstat.id]

    let th = env.style.scoreSize * env.scale
    fill(gang.color())
    font(th + 'px ' + env.style.font)

    let mobs = '' + gstat.mobs
    let cash = '$' + gstat.cash
    if (gdiff) {
        if (gdiff.mobs > 0) mobs += ' [+' + gdiff.mobs + ']'
        else if (gdiff.mobs < 0) mobs += ' [' + gdiff.mobs + ']'
        if (gdiff.cash > 0) cash += ' [+' + gdiff.cash + ']'
        else if (gdiff.cash < 0) cash += ' [' + gdiff.cash + ']'
    }
    text(lab.gang[gstat.id].name, rx(.25), y)
    text(mobs, rx(.5), y)
    text(cash, rx(.65), y)
}

function drawStat(st, diff, summary) {
    let th = env.style.scoreSize * env.scale
    font(th + 'px ' + env.style.font)
    alignCenter()
    baseMiddle()

    let y = ry(.2)
    let step = ry(.07)

    drawStation(y, st.station)

    if (summary) {
        y += step
        text(summary, rx(.5), y)
    }

    alignLeft()
    y += 1.3*step
    for (let i = 0; i < st.gang.length; i++) {
        if (st.gang[i].mobs > 0
                || (diff && diff.gang[i].cash !== 0)) {
            if (diff) gangStat(y, st.gang[i], diff.gang[i])
            else gangStat(y, st.gang[i])
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
