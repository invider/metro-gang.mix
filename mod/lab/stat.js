const Z = 1001

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

let splitAction = 0
function evo(dt) {
    if (this.hidden) return
    this.time -= dt

    if (this.time < 0) this.hide()

    // split
    if (this.stat.finish && this.stat.finish.split) {
        const p = lab.control.player
        const f = this.stat.finish

        if (p.getAction(f.owner.player, p.LEFT)) {
            if (splitAction != p.LEFT) {
                splitAction = p.LEFT
                if (f.split < f.gang[f.owner.id].mobs - 1) {
                    f.split ++
                }
            }
        } else if (p.getAction(f.owner.player, p.RIGHT)) {
            if (splitAction != p.RIGHT) {
                splitAction = p.RIGHT
                if (f.split > 1) {
                    f.split --
                }
            }
        } else {
            splitAction = 0
        }
    }
}

function drawStation(y, station, st) {
    let mobs = station.mobs
    if (st.split) {
        mobs = '' + st.split + ':' + (st.gang[station.gang.id].mobs - st.split)
    }

    fill(station.gang.color())
    if (station.gang.id > 0 && station.mobs > 0) {
        text(station.name + ' - ' + mobs, rx(.5), y)
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
        if (gdiff.cash > 0) cash += ' [+$' + gdiff.cash + ']'
        else if (gdiff.cash < 0) cash += ' [-$' + (-1 * gdiff.cash) + ']'
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

    drawStation(y, st.station, st)

    if (summary) {
        y += step
        text(summary, rx(.5), y)
    }

    alignLeft()
    y += 1.3*step
    for (let i = 0; i < st.score.length; i++) {
        const gid = st.score[i].id
        if (st.score[i].mobs > 0
                || (diff && diff.gang[gid].cash !== 0)) {
            if (diff) gangStat(y, st.score[i], diff.gang[gid])
            else gangStat(y, st.score[i])
            y += step
        }
    }
}

function draw() {
    if (this.stat.finish) {
        let summary
        if (this.stat.diff.newOwner >= 0) {
            const gangName = lab.gang[this.stat.diff.newOwner].name
            summary = env.msg.capturedBy.replace('[gang]', gangName)
        }
        drawStat(this.stat.finish, this.stat.diff, summary)
    } else {
        drawStat(this.stat.start)
    }
}
