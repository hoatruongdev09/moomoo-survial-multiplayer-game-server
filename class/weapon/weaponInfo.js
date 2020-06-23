const weaponInfo = {
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
            if (inf.id == `w${id}`) {
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
        id: "w0",
        main: true,
        age: 1,
        type: "Melee",
        name: "Tool Hammer",
        description: "Tool for gathering all resources",
        cost: {},
        size: {
            x: 3,
            y: 5
        },
        range: 2,
        damage: 25,
        structureDamage: 25,
        attackSpeed: 300, // milisecond
        movement: 1, // float percent
        gatherRate: 1,
        goldGatherRate: 5
    },
    {
        id: "w1",
        main: true,
        age: 2,
        name: "Hand Axe",
        type: "Melee",
        description: "Gathers resources at a higher rate",
        cost: {},
        size: {
            x: 3.2,
            y: 5
        },
        range: 2,
        damage: 30,
        structureDamage: 30,
        attackSpeed: 400, // milisecond
        movement: 1, // float percent
        gatherRate: 2,
        goldGatherRate: 6
    },
    {
        id: "w2",
        main: true,
        age: 2,
        name: "Stick",
        type: "Melee",
        description: "Great for gathering but very weak",
        cost: {},
        size: {
            x: 3.2,
            y: 5
        },
        range: 2,
        damage: 1,
        structureDamage: 1,
        attackSpeed: 400, // milisecond
        movement: 1, // float percent
        gatherRate: 7,
        goldGatherRate: 11
    }, {
        id: "w3",
        main: true,
        age: 2,
        type: "Melee",
        name: "Short Sword",
        description: "Increased attack power but slower move speed",
        cost: {},
        size: {
            x: 4,
            y: 5
        },
        range: 2,
        damage: 35,
        structureDamage: 35,
        attackSpeed: 300, // milisecond
        movement: 0.85, // float percent
        gatherRate: 4,
        goldGatherRate: 4
    },
    {
        id: "w4",
        main: true,
        age: 2,
        name: "Dagger",
        type: "Melee",
        description: "Really fast melee weapon",
        cost: {},
        size: {
            x: 3.5,
            y: 5
        },
        range: 2,
        damage: 2,
        structureDamage: 1,
        attackSpeed: 170, // milisecond
        movement: 1.13, // float percent
        gatherRate: 1.2,
        goldGatherRate: 1
    },
    {
        id: "w5",
        main: true,
        age: 2,
        name: "Polearm",
        type: "Melee",
        description: "Long range melee weapon",
        cost: {},
        size: {
            x: 5,
            y: 5
        },
        range: 2,
        damage: 45,
        structureDamage: 45,
        attackSpeed: 700, // milisecond
        movement: 0.82, // float percent
        gatherRate: 1,
        goldGatherRate: 5
    },
    {
        id: "w6",
        main: true,
        age: 2,
        name: "Bat",
        type: "Melee",
        description: "Fast long range melee weapon",
        cost: {},
        size: {
            x: 4.4,
            y: 5
        },
        range: 2,
        damage: 20,
        structureDamage: 20,
        attackSpeed: 300, // milisecond
        movement: 1, // float percent
        gatherRate: 1,
        goldGatherRate: 5
    },
    {
        id: "w7",
        main: true,
        age: 8,
        name: "Great Axe",
        type: "Melee",
        description: "Deal more damage and gather more resource",
        cost: {},
        size: {
            x: 3.2,
            y: 5
        },
        range: 2,
        damage: 35,
        structureDamage: 25,
        attackSpeed: 400, // milisecond
        movement: 1, // float percent
        gatherRate: 4,
        goldGatherRate: 8,
        previous: "w1",
    },
    {
        id: "w8",
        main: false,
        age: 8,
        type: "Ranged",
        name: "Crossbow",
        description: "Deals more damage and has greater range",
        cost: {
            Wood: 5
        },
        range: 35,
        damage: 35,
        bulletSpeed: 35,
        structureDamage: 0,
        attackSpeed: 700, // milisecond
        movement: 0.7, // float percent
        previous: "w11",
    },
    {
        id: "w9",
        main: false,
        age: 9,
        type: "Ranged",
        name: "Repeater Crossbow",
        description: "High Firerate crossbow with reduced damage",
        cost: {
            Wood: 10
        },
        range: 35,
        damage: 30,
        bulletSpeed: 35,
        attackSpeed: 230, // milisecond
        movement: 0.7, // float percent
        previous: "w8",
    },
    {
        id: "w10",
        main: false,
        age: 6,
        type: "Melee",
        name: "Great Hammer",
        description: "Hammer used for destroying structures",
        cost: {},
        size: {
            x: 3,
            y: 5
        },
        range: 2,
        damage: 10,
        structureDamage: 75,
        attackSpeed: 400, // milisecond
        movement: 0.88, // float percent
        gatherRate: 1,
        goldGatherRate: 5,
    },
    {
        id: "w11",
        main: false,
        age: 6,
        type: "Ranged",
        name: "Hunting Bow",
        description: "Bow used for ranged combat and hunting",
        cost: {
            Wood: 4
        },
        range: 25,
        damage: 25,
        bulletSpeed: 30,
        attackSpeed: 600, // milisecond
        movement: 0.75, // float percent
    }, {
        id: "w13",
        main: false,
        age: 6,
        type: "Melee",
        name: "Mc Grabby",
        description: "Steal resources from enemies",
        stealCost: {
            Wood: 100,
            Stone: 100,
            Food: 100,
            Gold: 100
        },
        cost: {},
        size: {
            x: 4,
            y: 5
        },
        range: 2,
        damage: 0,
        structureDamage: 0,
        attackSpeed: 700, // milisecond
        movement: 1.05, // float percent
        gatherRate: 4,
        goldGatherRate: 4,
    },
    // {
    //     id: "w14",
    //     main: false,
    //     age: 6,
    //     type: "Shield",
    //     name: "Wooden Shield",
    //     description: "Blocks projectiles and reduces melee damage",
    //     size: {
    //         x: 3,
    //         y: 5
    //     },
    //     range: 3,
    //     movement: 0.7, // float percent
    //     gatherRate: 0,
    // },
    {
        id: "w15",
        main: true,
        age: 8,
        type: "Melee",
        name: "Katana",
        description: "Greater range and damage",
        cost: {},
        size: {
            x: 4,
            y: 5
        },
        range: 2,
        damage: 40,
        structureDamage: 40,
        attackSpeed: 300, // milisecond
        movement: 0.8, // float percent
        gatherRate: 1,
        goldGatherRate: 5,
        previous: "w3",
    },

    ]
}
module.exports = weaponInfo