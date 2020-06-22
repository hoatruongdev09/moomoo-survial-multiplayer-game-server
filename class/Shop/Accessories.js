const accessoryInfos = {
    getAccessoryById(id) {
        for (let i = 0; i < this.infos.length; i++) {
            if (this.infos[i].id == id) {
                return this.infos[i]
            }
        }
        return null
    },
    getAccessoriesByPrice(price) {
        let data = []
        this.infos.forEach(acc => {
            if (acc.price == price) {
                data.push(price)
            }
        })
        return data
    },
    getAllInfo() {
        let data = []
        this.infos.forEach(acc => {
            data.push({
                id: acc.id,
                name: acc.name,
                price: acc.price,
                description: acc.description
            })
        })
        return data
    },
    infos: [{
        id: "a0",
        name: "Snowball",
        price: 1000,
        description: "No effect",
        effect(player) {

        }, remove(player) {
            console.log("removed item")
        }
    }, {
        id: "a1",
        name: "Tree Cape",
        price: 1000,
        description: "No effect",
        effect(player) {

        }, remove(player) {
            console.log("removed item")
        }
    }, {
        id: "a2",
        name: "Stone Cape",
        price: 1000,
        description: "No effect",
        effect(player) {

        }, remove(player) {
            console.log("removed item")
        }
    }, {
        id: "a3",
        name: "Cookie Cape",
        price: 1500,
        description: "No effect",
        effect(player) {

        }, remove(player) {
            console.log("removed item")
        }
    },
    {
        id: "a4",
        name: "Cow Cape",
        price: 2000,
        description: "No effect",
        effect(player) {

        }, remove(player) {
            console.log("removed item")
        }
    }, {
        id: "a5",
        name: "Monkey Tail",
        price: 2000,
        description: "Increase Movement speed by 35% but Melee damage is decreased by 80%",
        effect(player) {
            player.speedModifier += 0.35
            player.damageModifier -= 0.8
        },
        remove(player) {
            console.log("removed item")
            player.speedModifier -= 0.35
            player.damageModifier += 0.8
        }
    }, {
        id: "a6",
        name: "Apple Basket",
        price: 3000,
        description: "Heals 1 HP per second	",
        effect(player) {

        }, remove(player) {
            console.log("removed item")
        }
    }, {
        id: "a7",
        name: "Winter Cape",
        price: 3000,
        description: "No Effect",
        effect(player) {

        }, remove(player) {
            console.log("removed item")
        }
    }, {
        id: "a8",
        name: "Skull Cape",
        price: 4000,
        description: "No Effect",
        effect(player) {

        }, remove(player) {
            console.log("removed item")
        }
    }, {
        id: "a9",
        name: "Dash Cape",
        price: 5000,
        description: "No Effect",
        effect(player) {

        }, remove(player) {
            console.log("removed item")
        }
    }, {
        id: "a10",
        name: "Dragon Cape",
        price: 6000,
        description: "No Effect",
        effect(player) {

        }, remove(player) {
            console.log("removed item")
        }
    }, {
        id: "a11",
        name: "Super Cape",
        price: 8000,
        description: "No Effect",
        effect(player) {

        }, remove(player) {
            console.log("removed item")
        }
    }, {
        id: "a12",
        name: "Troll Cape",
        price: 8000,
        description: "No Effect",
        effect(player) {

        }, remove(player) {
            console.log("removed item")
        }
    },
    {
        id: "a13",
        name: "Thorns",
        price: 10000,
        description: "No Effect",
        effect(player) {

        }, remove(player) {
            console.log("removed item")
        }
    },
    {
        id: "a14",
        name: "Blockades",
        price: 10000,
        description: "No Effect",
        effect(player) {

        }, remove(player) {
            console.log("removed item")
        }
    }, {
        id: "a15",
        name: "Devils Tail",
        price: 10000,
        description: "No Effect",
        effect(player) {

        }, remove(player) {
            console.log("removed item")
        }
    }, {
        id: "a16",
        name: "Sawblade",
        price: 12000,
        description: "Deal damage to players that damage you",
        effect(player) {
            player.damageReflect += 0.3
        }, remove(player) {
            console.log("removed item")
            player.damageReflect -= 0.3
        }
    },
    {
        id: "a17",
        name: "Angel Wings",
        price: 15000,
        description: "Slowly regenerates health over time",
        effect(player) {

        }, remove(player) {
            console.log("removed item")
        }
    },
    {
        id: "a18",
        name: "Shadow Wings",
        price: 15000,
        description: "Increases movement speed",
        effect(player) {
            player.speedModifier += 0.35
        },
        remove(player) {
            console.log("removed item")
            player.speedModifier -= 0.35
        }
    },
    {
        id: "a19",
        name: "Blood Wings",
        price: 20000,
        description: "Restores health when you deal damage	",
        effect(player) {
            player.lifeSteal += 0.3
        },
        remove(player) {
            console.log("removed item")
            player.lifeSteal -= 0.3
        }
    },
    {
        id: "a20",
        name: "Corrupt X Wings",
        price: 15000,
        description: "Deal damage to players that damage you",
        effect(player) {
            player.damageReflect += 0.35
        },
        remove(player) {
            console.log("removed item")
            player.damageReflect -= 0.35
        }
    },
    ]
}

module.exports = accessoryInfos