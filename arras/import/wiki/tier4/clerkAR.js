const { combineStats } = require("../facilitators.js")
const { base } = require("../constants.js")
const g = require("../gunvals.js")

Class.clerkAR = {
    PARENT: "genericHealer",
    LABEL: "Clerk",
    BODY: {
        FOV: base.FOV * 1.15
    },
    GUNS: [
        {
            POSITION: { LENGTH: 19.2, WIDTH: 13, ASPECT: 0.7 }
        },
        {
            POSITION: { LENGTH: 17, WIDTH: 13 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher, g.healer, { speed: 2, maxSpeed: 2 }]),
                TYPE: ["launcherMissile", { HEALER: true }],
                STAT_CALCULATOR: "sustained"
            }
        }
    ]
}

upgrade(["analyzerAR"], "clerkAR")
