function finish(e) {
    env.state = 'stat'
    const station = e.station
    const res = e.result
    console.dir(res)

    env.control.resetAll()


    lab.stat.show(res, env.tune.finishStatTime, () => {
        lab.fight.markAllDead()
        lab.metro.show()
    })
}
