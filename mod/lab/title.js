const Z = 32

let msg = ''
let until = 0
let color

function show(m, d, c) {
    msg = m 
    until = env.time + d

    if (c) color = c
    else color = '#ffffff'
}

function draw() {
    if (env.time < until) {
        baseMiddle()
        alignCenter()

        fill(color)
        font(env.style.logoSize*env.scale + 'px boo-city')
        text(msg, rx(.5), ry(.35))
    }
}

