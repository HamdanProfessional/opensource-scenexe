const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.sawedOff = {
    PARENT: "genericTank",
    LABEL: "Sawed Off",
    DANGER: 6,
    BODY: Class.shotgun.BODY,
    GUNS: [
        ...Class.shotgun.GUNS,
        { POSITION: { LENGTH: 15, WIDTH: 7, ANGLE: 180 } },
        {
            POSITION: { LENGTH: 3, WIDTH: 7, ASPECT: 1.7, X: 15, ANGLE: 180 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.trap]), TYPE: "trap", STAT_CALCULATOR: "trap" }
        }
    ]
}

upgrade(["shotgun", "trapper"], "sawedOff")
