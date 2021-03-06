const Z = 23
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
            s.gang = lab.gang[0]
        }
    })
}

function getStation(l, s) {
    return lines[l].seg[s]
}

function forEachStation(fn) {
    lines.forEach(l => l.stations.forEach(s => fn(s)))
}

function createTrains() {
    const l = lines[0]
    const train = new dna.Train(0, l.seg[0], l.seg[1])
    trains.push(train)
    train.attachSubway(lab.subway)
}

function runTraffic() {
    style = env.style.metro
    buildLines()
    createTrains()

    // populate bad hoods
    // hard-code-capture some stations
    lines[0].stations[1].gang = lab.gang[3]
    lines[0].stations[1].mobs = 3
    lines[0].stations[3].gang = lab.gang[3]
    lines[0].stations[3].mobs = 2
    lines[0].stations[8].gang = lab.gang[3]
    lines[0].stations[8].mobs = 5

    lines[0].stations[9].gang = lab.gang[4]
    lines[0].stations[9].mobs = 15
    lines[0].stations[10].gang = lab.gang[4]
    lines[0].stations[10].mobs = 7
    lines[0].stations[7].gang = lab.gang[4]
    lines[0].stations[7].mobs = 5

    // give them some cash and mobs
    //lab.gang[3].mobs = 10
    //lab.gang[3].cash = 200
    //lab.gang[4].mobs = 15
    //lab.gang[4].cash = 400
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
                if (s.mobs > 0) {
                    suffix = ' - ' + s.mobs
                }
            } else {
                gangColor = env.style.gang[0]
            }

            const r = style.stationR * env.scale
            //fill(gangColor)
            //fill(.75, .1, .4)
            //fill(color)
            //circle(x, y, r)

            stroke(gangColor)
            lineWidth(style.stationW * env.scale)
            circle(x, y, r)

            fill(gangColor)
            font(style.fontSize*env.scale + 'px ' + env.style.font)

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
    font(env.style.logoSize*env.scale + 'px ' + env.style.font)
    text(env.tagline, rx(.5), ry(.25))
}

function draw() {
    save()
    drawLines()
    drawTrains()
    drawStations()
    drawLogo()
    restore()
}

function hide() {
    this.paused = true
    this.hidden = true
    lab.subway.hidden = true
    lab.carriage.paused = true
    env.state = 'street'
}

function show() {
    this.paused = false
    this.hidden = false
    lab.subway.hidden = false
    lab.carriage.paused = false
    env.state = 'metro'
    this.block = env.tune.metro.blockAfterFight
}
