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
    font(th + 'px boo-city')

    alignCenter()
    baseTop()
    text(g.name + ': ' + g.mobs, x, y)

    y += th
    text('$' + g.cash, x, y)
}

function showMetro() {
    gangStat(lab.gang[1], rx(0.2), ry(0.01))
    gangStat(lab.gang[2], rx(0.4), ry(0.01))
    gangStat(lab.gang[3], rx(0.6), ry(0.01))
    gangStat(lab.gang[4], rx(0.8), ry(0.01))
}

function streetStat() {
    let stat = [0, 0, 0, 0, 0]

    lab.street._ls.filter(e => e.bro && !e.bro.dead).forEach(bro => {
        stat[bro.gang] += bro.cash
    })

    return stat
}

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

function showStreet() {
    const winner = findWinner()

    let th = env.style.timerSize * env.scale
    font(th + 'px boo-city')

    let y = ry(.01)
    fill(winner.gang.color())
    alignCenter()
    baseTop()
    text('' + ceil(lab.fight.timer), rx(.5), y)

    //th = env.style.scoreSize * env.scale
    font(th*0.7 + 'px boo-city')
    y =+ th
    text('+$' + floor((winner.sum-winner.secondSum) * 100)/100, rx(.5), y)
}

function draw() {
    switch (env.state) {
    case 'metro': showMetro(); break;
    case 'street': showStreet(); break;
    }
}
