const launcher = angle => [
    { ...Class.bushwhacker.GUNS[1], POSITION: { ...Class.bushwhacker.GUNS[1].POSITION, ANGLE: angle } },
    { ...Class.bushwhacker.GUNS[2], POSITION: { ...Class.bushwhacker.GUNS[2].POSITION, ANGLE: angle } }
]

Class.triBushwacker = {
    PARENT: "genericTank",
    LABEL: "Tri-Bushwacker",
    DANGER: 7,
    BODY: Class.bushwhacker.BODY,
    GUNS: [
        Class.bushwhacker.GUNS[0],
        ...launcher(180),
        ...launcher(90),
        ...launcher(-90)
    ]
}
upgrade(["bushwhacker"], "triBushwacker")
