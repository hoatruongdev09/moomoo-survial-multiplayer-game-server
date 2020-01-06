const itemInfo = {
    getInfoByStringId(id) {
        let returnInf = null
        this.infos.forEach(inf => {
            if (inf.id == id) {
                returnInf = inf
            }
        })
        return returnInf
    },
    getInfoByNumberId(id) {
        let returnInf = null
        this.infos.forEach(inf => {
            if (inf.id == `i${id}`) {
                returnInf = inf
            }
        })
        return returnInf
    },
    getInfoByAge(age) {
        let info = []
        this.infos.forEach(inf => {
            if (inf.age == age) {
                info.push(inf)
            }
        })
        return info
    },
    infos: [{
            id: "i0",
            type: "Pad",
            age: 7,
            name: "Blocker",
            description: "Blocks building in radius",
            cost: {
                wood: 30,
                stone: 25
            },
            health: 400,
            limit: 3,
            size: 5, // radius
            range: 5
        },
        {
            id: "i1",
            type: "Pad",
            age: 4,
            name: "Boost Pad",
            description: "Provides boost when stepped on",
            cost: {
                wood: 5,
                stone: 20
            },
            health: 150,
            limit: 12,
            size: 1, // radius
            range: 0
        },
        {
            id: "i2",
            type: "Wall",
            age: 7,
            name: "Castle Wall",
            description: "Provides provides powerfull protection for your village",
            cost: {
                stone: 35
            },
            health: 1500,
            limit: 30,
            size: 3, // radius
            range: 0,
            previous: "i15"
        },
        {
            id: "i3",
            type: "Windmill",
            age: 5,
            name: "Faster Windmill",
            description: "Generates more gold over time",
            cost: {
                wood: 60,
                stone: 35
            },
            gold: 1.5,
            xp: 1.5,
            health: 500,
            limit: 7,
            size: 3, // radius
            range: 0,
            previous: "i18"
        },
        {
            id: "i4",
            type: "Spike",
            age: 5,
            name: "Greater Spikes",
            damage: 35,
            description: "Damages enemies when they touch them.",
            cost: {
                wood: 30,
                stone: 10
            },
            health: 500,
            limit: 15,
            size: 3, // radius
            range: 0,
        },
        {
            id: "i5",
            type: "Pad",
            age: 7,
            name: "Healing Pad",
            description: "Standing on it will slowly heal you",
            cost: {
                wood: 30,
                food: 10
            },
            health: 400,
            limit: 4,
            size: 3, // radius
            range: 0
        },
        {
            id: "i6",
            type: "Resource",
            age: 4,
            name: "Stone Mine",
            description: "Allow you mine stone",
            cost: {
                wood: 20,
                stone: 100
            },
            health: -1,
            limit: 1,
            size: 3, // radius
            range: 0,
        },
        {
            id: "i7",
            type: "PitTrap",
            age: 1, //4
            name: "Pit Trap",
            description: "Pit that trap enemies if they walk over it",
            cost: {
                wood: 30,
                stone: 30
            },
            health: 500,
            limit: 6,
            size: 0.8, // radius
            range: 0,
        },
        {
            id: "i8",
            type: "Pad",
            age: 7,
            name: "Platform",
            description: "Platform to shoot over walls and cross over water",
            cost: {
                wood: 20
            },
            health: 300,
            limit: 12,
            size: 3, // radius
            range: 0,
        },
        {
            id: "i9",
            type: "Spike",
            age: 9,
            name: "Poison Spikes",
            damage: 35,
            description: "Poisons enemies when they touch them",
            cost: {
                wood: 20,
                stone: 15
            },
            health: 600,
            limit: 15,
            size: 3, // radius
            range: 0,
            previous: "i4"
        },
        {
            id: "i10",
            type: "Windmill",
            age: 8,
            name: "Power Mill",
            description: "Generates more gold over time",
            cost: {
                wood: 100,
                stone: 50
            },
            gold: 2,
            xp: 2,
            health: 800,
            limit: 7,
            size: 3, // radius
            range: 0,
            previous: "i3"
        },
        {
            id: "i11",
            type: "Resource",
            age: 4,
            name: "Sapling",
            description: "Allows you to farm wood",
            cost: {
                wood: 150
            },
            health: -1,
            limit: 7,
            size: 2, // radius
            range: 0,
        },
        {
            id: "i12",
            type: "Pad",
            age: 9,
            name: "Spawn Pad",
            description: "You will spawn here when you die but it will disappear",
            cost: {
                wood: 100,
                stone: 100
            },
            health: 400,
            limit: 1,
            size: 2, // radius
            range: 0,
        },
        {
            id: "i13",
            type: "Spike",
            age: 1,
            name: "Spikes",
            damage: 20,
            description: "Damages enemies when they touch them",
            cost: {
                wood: 20
            },
            health: 375,
            limit: 15,
            size: 2, // radius
            range: 0,
        },
        {
            id: "i14",
            type: "Spike",
            age: 9,
            name: "Spinning Spikes",
            damage: 45,
            description: "Damages enemies when they touch them",
            cost: {
                wood: 30,
                stone: 20
            },
            health: 500,
            limit: 15,
            size: 2, // radius
            range: 0,
            previous: "i4"
        },
        {
            id: "i15",
            type: "Wall",
            age: 3,
            name: "Stone Wall",
            description: "Provies improved protection for your village",
            cost: {
                stone: 25
            },
            health: 900,
            limit: 30,
            size: 2, // radius
            range: 0,
        }, {
            id: "i16",
            type: "Pad",
            age: 7,
            name: "Teleporter",
            description: "Teleports you to a random spot on the map",
            cost: {
                wood: 60,
                stone: 60
            },
            health: 200,
            limit: 2,
            size: 2, // radius
            range: 0,
        },
        {
            id: "i17",
            type: "Turret",
            age: 7,
            name: "Turret",
            description: "Defensive structures that shoot at enemies",
            cost: {
                wood: 200,
                stone: 150
            },
            health: 800,
            limit: 2,
            size: 2, // radius
            range: 0,
        },
        {
            id: "i18",
            type: "Windmill",
            age: 1,
            name: "Windmill",
            description: "Generates gold overtime",
            cost: {
                wood: 50,
                stone: 10
            },
            gold: 1,
            xp: 1,
            health: 400,
            limit: 7,
            size: 2, // radius
            range: 0,
        },
        {
            id: "i19",
            type: "Wall",
            age: 1,
            name: "Wood Wall",
            description: "Provides protection for your village",
            cost: {
                wood: 10
            },
            health: 380,
            limit: 30,
            size: 2, // radius
            range: 0,
        },
        {
            id: "i20",
            type: "Consume",
            age: 1,
            name: "Apple",
            description: "Restores 20 health when consumed",
            restore: 20,
            cost: {
                food: 10
            }
        },
        {
            id: "i21",
            type: "Consume",
            age: 3,
            name: "Cookies",
            description: "Restores 40 health when consumed",
            restore: 40,
            cost: {
                food: 15
            }
        },
    ]

}

module.exports = itemInfo