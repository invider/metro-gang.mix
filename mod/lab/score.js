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
    text('mobs: ' + g.mobs, x, y)

    y += th
    text('$' + g.cash, x, y)
}

function showMetro() {
    gangStat(lab.gang[1], rx(0.2), ry(0.01))
    gangStat(lab.gang[2], rx(0.4), ry(0.01))
    gangStat(lab.gang[3], rx(0.6), ry(0.01))
    gangStat(lab.gang[4], rx(0.8), ry(0.01))
}

function showStreet() {
    let th = env.style.scoreSize * env.scale
    font(th + 'px boo-city')

    fill('#ffffff')
    alignCenter()
    baseTop()
    text('' + ceil(lab.fight.timer), rx(.5), ry(.01))
}

function draw() {
    switch (env.state) {
    case 'metro': showMetro(); break;
    case 'street': showStreet(); break;
    }
}
