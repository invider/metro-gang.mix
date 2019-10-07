const W = 100

let style

const lines = []

function init() {
    style = env.style.metro

    let l = 0
    lines[0] = {
        color: hsl(.17, .9, .3),
        seg: [],
        stations: [],
    }

    // build metro lines
    env.seg.forEach(s => {
        // translate coords to 0..1 screen space
        s.x = s.x/W
        s.y = s.y/W

        lines[l].seg.push(s)
        if (s.name != 'next') {
            s.station = true
            lines[l].stations.push(s)
        }
    })
}

function evo(dt) {

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

            let gangColor
            if (s.gang) {
                gangColor = env.style.gang[s.gang.id]
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
            text(s.name, x+sx, y+sy)
        })
    })
}

function draw() {
    save()
    drawLines()
    drawStations()
    restore()
}
