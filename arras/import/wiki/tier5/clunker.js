const { combineStats } = require("../facilitators.js")

Class.clunker = {
    ...Class.machineGunner,
    LABEL: "Clunker",
    DANGER: 8,
    DMCA_CENSOR_NAME: false,
    DMCA_CENSOR_DESIGN: false,
    GUNS: Class.machineGunner.GUNS.map(gun => ({
        ...gun,
        PROPERTIES: {
            ...gun.PROPERTIES,
            SHOOT_SETTINGS: combineStats([gun.PROPERTIES.SHOOT_SETTINGS, { reload: 0.6, spray: 1.5, damage: 1.1 }])
        }
    }))
}

upgrade(["machineGunner", "jalopy"], "clunker")
