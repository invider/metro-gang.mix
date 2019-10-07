const tune = {
    base: .08, // base=[bro width] relative to the screen width
    gravity: 18,
    friction: 10,
    forceFeedback: 1.5,
    blockFeedback: 0.5,
    streetFence: 0.3, // base
    bro: {
        acceleration: 20,// in bases
        maxSpeed: 5,     // in bases
        dashLock: 4,     // seconds to wait between dashes
        dashThreshold: 5, // speed needed for dash
        dashAcceleration: 25,
        maxDashSpeed: 7,
        dashRecharge: 0.2,
        jump: 9,        // in bro height
        outHits: 2,     // hits to knock-out
        healRate: 0.5,  // points/second
        punchCharge: 0.3,
        punchRecharge: 0.4,
        punchSpeed: 2,
        jumpRecharge: 0.1,
        hitForce: 0.01,     // force/hits rate
        hitBlock: 0.0025,   // force/hits in block
    },
}