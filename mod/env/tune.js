const tune = {
    gangs: 4,
    readyTime: 5,
    roundTime: 30,
    finishStatTime: 6,
    cashUnit: 0.25,
    base: .08, // base=[bro width] relative to the screen width
    gravity: 18,
    friction: 10,
    airDrag: 5,
    forceFeedback: 1.5,
    blockFeedback: 0.5,
    streetFence: 0.3, // base
    broCorner: 0.2,   // area to recruit bro's
    hitsToBro: 7,
    bro: {
        acceleration: 20,// in bases
        maxSpeed: 5,     // in bases
        dashLock: 4,     // seconds to wait between dashes
        dashTimeout: 1,
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
        playerOutTime: 2,
        botOutTime: 4,
        takeInTime: 0.6,
    },
    metro: {
        blink: .33,
        transitTime: 10,
        doorsMoveTime: 0.7,
        exitWaiting: 1,
        stationWaiting: 4,
        fadeWaiting: 1,
        hopOutThreshold: 0.95, // screen area for exit
        blockAfterFight: .5,
    },
    fadeTime: 0.7,
    transitionTime: 2,

    control: {
        startBotTimeout: 15000, // in ms
        touchMinTimeout: 90000,
        touchVarTimeout: 15000,
    },
}
