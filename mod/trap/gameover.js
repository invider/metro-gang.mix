
function gameover(gangId) {
    const gang = lab.gang[gangId]
    const gangName = gang.name
    log(`gameover! ${gangName} win`)
    env.tagline = env.msg.win.replace('[gang]', gangName)
}

