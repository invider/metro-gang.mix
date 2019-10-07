const Z = 21
const W = 100

let style

let block = 0

const lines = []
const trains = []

function init() {
    this.block = 0
}

function buildLines() {
    let l = 0
    lines[0] = {
        color: hsl(.13, .9, .3),
        seg: [],
        stations: [],
    }

    // build metro lines
    env.seg.forEach(s => {
        s.line = lines[l]
        // translate coords to 0..1 screen space
        s.x = s.x/W
        s.y = s.y/W

        lines[l].seg.push(s)
        s.id = lines[l].seg.length - 1

        if (s.name != 'next') {
            s.station = true
            lines[l].stations.push(s)
            s.sid = lines[l].stations.length - 1
            s.mobs = 0
        }
    })
}

function createTrains() {
    const l = lines[0]
    trains.push(new dna.Train(0, l.seg[0], l.seg[1], lab.gang[0]))
    trains.push(new dna.Train(0, l.seg[3], l.seg[4], lab.gang[1]))
    trains.push(new dna.Train(0, l.seg[6], l.seg[5], lab.gang[2]))
    trains.push(new dna.Train(0, l.seg[10], l.seg[9], lab.gang[3]))
}

function runTraffic() {
    style = env.style.metro
    buildLines()
    createTrains()

    /*
    // capture some stations
    lines[0].stations[4].gang = lab.gang[2]
    lines[0].stations[4].mobs = 10
    lines[0].stations[5].gang = lab.gang[4]
    lines[0].stations[5].mobs = 4
    */
}

function nextSegment(src, dest) {
    let next = 0
    let ln = dest.line

    if (src.id < dest.id) {
        next = dest.id + 1
        if (next >= ln.seg.length) next = dest.id - 1 // terminal
    } else {
        next = dest.id - 1
        if (next < 0) next = dest.id + 1 // terminal
    }

    return ln.seg[next]
}

function evo(dt) {
    this.block -= dt
    trains.forEach(t => t.evo(dt))
}

function drawTrains() {
    trains.forEach(t => t.draw())
}

function drawLines() {
    ctx.lineCap = 'round'
    lines.forEach(l => {
        const color = l.color

        let lx = 0
        let ly = 0
        l.seg.forEach(s => {
            const x = rx(s.x)
            const y = ry(s.y)

            stroke(color)
            lineWidth(style.lineWidth * env.scale)
            if (lx || ly) line(lx, ly, x, y)

            lx = x
            ly = y
        })
    })
}

function drawStations() {
    lines.forEach(l => {
        const color = l.color

        l.stations.forEach(s => {
            const x = rx(s.x)
            const y = ry(s.y)

            let suffix = ''
            let gangColor
            if (s.gang) {
                gangColor = s.gang.color()
                if (s.gang.mobs > 0) {
                    suffix = ' - ' + s.gang.mobs
                }
            } else {
                gangColor = env.style.gang[0]
            }

            stroke(gangColor)
            const r = style.stationR * env.scale
            lineWidth(style.stationW * env.scale)
            circle(x, y, r)

            fill(gangColor)
            font(style.fontSize*env.scale + 'px boo-city')

            const R = r * 1.5
            let sx = 0
            let sy = R

            switch(s.label) {
            case 1:
                sx = -R; sy = 0; baseMiddle(); alignRight();
                break;
            case 2:
                sx = R; sy = 0; baseMiddle(); alignLeft();
                break;
            case 3:
                sy = -R; baseBottom(); alignCenter();
                break;
            case 5:
                sx = R; sy = R; baseMiddle(); alignLeft();
                break;
            case 6:
                sx = -R; sy = -R; baseMiddle(); alignRight();
                break;

            case 4:
            default:
                baseTop()
                alignCenter()
            }
            text(s.name + suffix, x+sx, y+sy)
        })
    })
}

function drawLogo() {
    baseMiddle()
    alignCenter()

    fill(env.style.logoColor)
    font(env.style.logoSize*env.scale + 'px boo-city')
    text(env.style.logo, rx(.5), ry(.25))
}

function draw() {
    save()
    drawLines()
    drawStations()
    drawTrains()
    drawLogo()
    restore()
}

function hide() {
    this.paused = true
    this.hidden = true
    env.state = 'street'
}

function show() {
    this.paused = false
    this.hidden = false
    env.state = 'metro'
    this.block = env.tune.metro.blockAfterFight
}
