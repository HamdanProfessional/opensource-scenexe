const { combineStats } = require("../facilitators.js")
const g = require("../gunvals.js")

Class.machgun = {
    PARENT: "genericTank",
    LABEL: "Machgun",
    DANGER: 7,
    BODY: Class.railgun.BODY,
    GUNS: Class.minigun.GUNS.map((gun, i) => ({
        ...gun,
        POSITION: { ...gun.POSITION, LENGTH: gun.POSITION.LENGTH + 4, WIDTH: 5 },
        PROPERTIES: {
            ...gun.PROPERTIES,
            SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.railgun, { size: 0.7, damage: 1.2, reload: 0.6 }])
        }
    }))
}
upgrade(["railgun", "minigun"], "machgun")
