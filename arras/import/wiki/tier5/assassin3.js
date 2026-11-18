const { makeRadialAuto } = require("../facilitators.js")

Class.assassin3 = makeRadialAuto("assassin", {
    turretIdentifier: "assassin3gun",
    label: "Assassin-3",
    danger: 8,
    size: 13,
    extraStats: [{ speed: 1.1, maxSpeed: 1.1 }],
    body: { SPEED: Class.sniper3.BODY.SPEED, FOV: Class.sniper3.BODY.FOV * 1.1 }
})
upgrade(["sniper3"], "assassin3")
