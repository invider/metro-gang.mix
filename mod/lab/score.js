const Z = 31

function evo(dt){
    env.time += dt
}

function gangStat(g, x, y) {
    let th = env.style.scoreSize * env.scale

    if (g.player && env.control.any(g.player)) {
        th *= env.style.selectedScoreScale
    }

    fill(g.color())
    font(th + 'px ' + env.style.font)

    alignCenter()
    baseTop()

    const doers = lab.carriage.countDoers(g.id)
    text(g.name + ': ' + (g.mobs-doers), x, y)

    y += th
    text('$' + g.cash, x, y)
}

function showMetro() {
    let x = rx(.2)
    let step = rx(.2)

    for (let i = 1; i < lab.gang.length; i++) {
        gangStat(lab.gang[i], x, ry(0.01))
        x += step
    }
}

function streetStat() {
    let stat = [0, 0, 0, 0, 0]

    lab.street._ls.filter(e => e.bro && !e.bro.dead).forEach(bro => {
        stat[bro.gang] += bro.cash
    })

    return stat
}

/*
function findWinner() {
    const stat = streetStat()
    let winner = 0
    let val = 0

    let second = 0
    let sval = 0

    for (let i = 0; i < stat.length; i++) {
        if (stat[i] > val) {
            winner = i
            val = stat[i]
        }
        if (stat[i] < val && stat[i] > sval) {
            second = i
            sval = stat[i]
        }
    }

    return {
        id: winner,
        gang: lab.gang[winner],
        sum: val,
        sid: second,
        second: lab.gang[second],
        secondSum: sval,
    }
}
*/

function showStreet() {
    const stat = lab.fight.calculateStat()
    const winner = lab.gang[stat.score[0].id]
    const ahead = lib.util.normalizeCash(stat.score[0].cash
        - stat.score[1].cash)

    let th = env.style.timerSize * env.scale
    font(th + 'px ' + env.style.font)

    let y = ry(.01)
    fill(winner.color())
    alignCenter()
    baseTop()
    text('' + ceil(lab.fight.timer), rx(.5), y)

    if (ahead > 0) {
        //th = env.style.scoreSize * env.scale
        font(th*0.7 + 'px ' + env.style.font)
        y =+ th
        text('+$' + ahead, rx(.5), y)
    }
}

function draw() {
    switch (env.state) {
    case 'metro': showMetro(); break;
    case 'street': showStreet(); break;
    }
}
