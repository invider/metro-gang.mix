const Z = 31

function gangStat(g, x, y) {
    const th = env.style.scoreSize * env.scale

    fill(g.color())
    font(th + 'px boo-city')

    alignCenter()
    baseTop()
    text('mobs: ' + g.mobs, x, y)

    y += th
    text('$' + g.cash, x, y)
}

function draw() {
    gangStat(lab.gang[1], rx(0.2), ry(0.01))
    gangStat(lab.gang[2], rx(0.4), ry(0.01))
    gangStat(lab.gang[3], rx(0.6), ry(0.01))
    gangStat(lab.gang[4], rx(0.8), ry(0.01))
}

