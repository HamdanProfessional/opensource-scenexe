const { combineStats } = require("../facilitators.js")
const { base, statnames } = require("../constants.js")
const g = require("../gunvals.js")

Class.medicareAR = {
    PARENT: "genericHealer",
    LABEL: "Medicare",
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: 1.1 * base.FOV
    },
    GUNS: [
        {
            POSITION: { LENGTH: 4.5, WIDTH: 8, X: 10.5 }
        },
        {
            POSITION: { LENGTH: 1, WIDTH: 10, X: 15 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.minion, g.healer, { speed: 2, maxSpeed: 2 }]),
                TYPE: [
                    "minion",
                    {
                        HEALER: true,
                        GUNS: [
                            {
                                POSITION: { LENGTH: 17, WIDTH: 9 },
                                PROPERTIES: {
                                    SHOOT_SETTINGS: combineStats([g.basic, g.minionGun, g.healer]),
                                    WAIT_TO_CYCLE: true,
                                    TYPE: "healerBullet"
                                }
                            }
                        ]
                    }
                ],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
                MAX_CHILDREN: 4
            }
        },
        {
            POSITION: { LENGTH: 3.5, WIDTH: 10, X: 8 }
        }
    ]
}

upgrade(["sootherAR"], "medicareAR")
