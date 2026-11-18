const { combineStats, makeAuto, makeGuard } = require("../facilitators.js")
const g = require("../gunvals.js")

const frontGun = {
    PARENT: "genericTank",
    DANGER: 4,
    GUNS: [
        {
            POSITION: { LENGTH: 20.5, WIDTH: 14 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]), TYPE: "bullet" }
        }
    ]
}

const rear = {
    GUNS: [
        {
            POSITION: { LENGTH: 20.5, WIDTH: 13 },
            PROPERTIES: { SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]), TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 5, WIDTH: 11, X: 10.5 }
        },
        {
            POSITION: { LENGTH: 3, WIDTH: 14, X: 15.5 }
        },
        {
            POSITION: { LENGTH: 2, WIDTH: 14, ASPECT: 1.3, X: 18 },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                TYPE: "pillbox",
                NO_LIMITATIONS: true,
                SYNCS_SKILLS: true,
                DESTROY_OLDEST_CHILD: true,
                STAT_CALCULATOR: "block",
                MAX_CHILDREN: 4
            }
        }
    ]
}

Class.vanquisher = makeGuard(frontGun, "Vanquisher", { type: rear, danger: 4 })
upgrade(["mechGuard","conqueror","engineer"], "vanquisher")
