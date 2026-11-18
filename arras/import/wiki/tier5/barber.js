const big = Class.rimfire.GUNS[0].PROPERTIES.SHOOT_SETTINGS
const thin = Class.rimfire.GUNS[2].PROPERTIES.SHOOT_SETTINGS

Class.barber = {
    PARENT: "genericTank",
    LABEL: "Barber",
    DANGER: 8,
    BODY: Class.buttbuttin.BODY,
    GUNS: [
        Class.buttbuttin.GUNS[0],
        Class.buttbuttin.GUNS[1],
        {
            POSITION: { LENGTH: 12, WIDTH: 7, Y: 5, ANGLE: 180, DELAY: 0.25 },
            PROPERTIES: { SHOOT_SETTINGS: big, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 12, WIDTH: 7, Y: -5, ANGLE: 180, DELAY: 0.75 },
            PROPERTIES: { SHOOT_SETTINGS: big, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 18, WIDTH: 2, X: 2, Y: -2.5, ANGLE: 180 },
            PROPERTIES: { SHOOT_SETTINGS: thin, TYPE: "bullet" }
        },
        {
            POSITION: { LENGTH: 18, WIDTH: 2, X: 2, Y: 2.5, ANGLE: 180, DELAY: 0.5 },
            PROPERTIES: { SHOOT_SETTINGS: thin, TYPE: "bullet" }
        },
        Class.buttbuttin.GUNS[4]
    ]
}
upgrade(["buttbuttin", "rimfire"], "barber")
