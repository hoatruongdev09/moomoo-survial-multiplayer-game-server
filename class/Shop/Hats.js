const Hats = {
    getHatById(id) {
        for (let i = 0; i < this.infos.length; i++) {
            if (this.infos[i].id == id) {
                return this.infos[i];
            }
        }
        return null;
    },
    getHatsByPrice(price) {
        let data = []
        this.infos.forEach(hat => {
            if (hat.price == price) {
                data.push(hat)
            }
        })
        return data
    },
    getAllInfo() {
        let data = []
        this.infos.forEach(hat => {
            data.push({
                id: hat.id,
                name: hat.name,
                price: hat.price,
                description: hat.description
            })
        })
        return data
    },
    infos: [{
        id: "h0",
        name: "Moo Cap",
        price: 0,
        description: "Coolest mooer around",
        effect(player) {

        },
        remove(player) {
            console.log("removed item")
        }
    },
    {
        id: "h1",
        name: "Apple Cap",
        price: 0,
        description: "Apple farm remembers",
        effect(player) {

        },
        remove(player) {
            console.log("removed item")
        }
    }, {
        id: "h2",
        name: "Moo Head",
        price: 0,
        description: "No effect",
        effect(player) {

        },
        remove(player) {
            console.log("removed item")
        }
    }, {
        id: "h3",
        name: "Pig Head",
        price: 0,
        description: "No effect",
        effect(player) {

        },
        remove(player) {
            console.log("removed item")
        }
    }, {
        id: "h4",
        name: "Fluff Head",
        price: 0,
        description: "No effect",
        effect(player) {

        },
        remove(player) {
            console.log("removed item")
        }
    }, {
        id: "h5",
        name: "Pandou Head",
        price: 0,
        description: "No effect",
        effect(player) {

        },
        remove(player) {
            console.log("removed item")
        }
    }, {
        id: "h6",
        name: "Bear Head",
        price: 0,
        description: "No effect",
        effect(player) {

        },
        remove(player) {
            console.log("removed item")
        }
    },
    {
        id: "h7",
        name: "Monkey Head",
        price: 0,
        description: "No effect",
        effect(player) {

        },
        remove(player) {
            console.log("removed item")
        }
    }, {
        id: "h8",
        name: "Polar Head",
        price: 0,
        description: "No effect",
        effect(player) {

        },
        remove(player) {
            console.log("removed item")
        }
    },
    {
        id: "h9",
        name: "Fez Hat",
        price: 0,
        description: "No effect",
        effect(player) {

        },
        remove(player) {
            console.log("removed item")
        }
    },
    {
        id: "h10",
        name: "Enigma Hat",
        price: 0,
        description: "Join the enigma army",
        effect(player) {

        },
        remove(player) {
            console.log("removed item")
        }
    }, {
        id: "h11",
        name: "Blitz Hat",
        price: 0,
        description: "Hey everybody I'm blitz",
        effect(player) {

        },
        remove(player) {
            console.log("removed item")
        }
    }, {
        id: "h12",
        name: "Bob XIII Hat",
        price: 0,
        description: "Like and subscribe",
        effect(player) {

        },
        remove(player) {
            console.log("removed item")
        }
    }, {
        id: "h13",
        name: "Pumpkin Hat",
        price: 50,
        description: "Spooooky",
        effect(player) {

        },
        remove(player) {
            console.log("removed item")
        }
    }, {
        id: "h14",
        name: "Bummel Hat",
        price: 100,
        description: "no effect",
        effect(player) {

        },
        remove(player) {
            console.log("removed item")
        }
    }, {
        id: "h15",
        name: "Straw Hat",
        price: 500,
        description: "no effect",
        effect(player) {

        },
        remove(player) {
            console.log("removed item")
        }
    }, {
        id: "h16",
        name: "Winter cap",
        price: 600,
        description: "Allows you to move at normal speed in snow",
        effect(player) {
            player.isSnowMoveNormal = true
        },
        remove(player) {
            console.log("removed item")
            player.isSnowMoveNormal = false
        }
    }, {
        id: "h17",
        name: "Cowboy Hat",
        price: 1000,
        description: "No Effect",
        effect(player) {

        },
        remove(player) {
            console.log("removed item")
        }
    }, {
        id: "h18",
        name: "Ranger Hat",
        price: 2000,
        description: "No Effect",
        effect(player) {

        },
        remove(player) {
            console.log("removed item")
        }
    }, {
        id: "h19",
        name: "Explorer Hat",
        price: 2000,
        description: "No Effect",
        effect(player) {

        },
        remove(player) {
            console.log("removed item")
        }
    }, {
        id: "h20",
        name: "Flipper Hat",
        price: 2500,
        description: "Have more control while in water",
        effect(player) {
            player.isWaterMoveNormal = true
        },
        remove(player) {
            console.log("removed item")
            player.isWaterMoveNormal = false
        }
    },
    {
        id: "h21",
        name: "Marksman Hat",
        price: 3000,
        description: "Increases arrow speed and range",
        effect(player) {
            player.projectileSpeedModifier += 0.3
            player.projectileRangeModifier += 0.5
        },
        remove(player) {
            console.log("removed item")
            player.projectileSpeedModifier -= 0.3
            player.projectileRangeModifier -= 0.5
        }
    },
    {
        id: "h22",
        name: "Bush Gear",
        price: 3000,
        description: "Allows you to disguise yourself as a bush",
        effect(player) {

        },
        remove(player) {
            console.log("removed item")
        }
    }, {
        id: "h23",
        name: "Halo",
        price: 3000,
        description: "No Effect",
        effect(player) {

        },
        remove(player) {
            console.log("removed item")
        }
    }, {
        id: "h24",
        name: "Soldier Helmet",
        price: 4000,
        description: "Reduces damage taken but slows movement",
        effect(player) {
            player.damageTakenModifier += 0.2
        },
        remove(player) {
            console.log("removed item")
            player.damageTakenModifier -= 0.2
        }
    }, {
        id: "h25",
        name: "Anti Venom Gear",
        price: 4000,
        description: "Makes you immune to poison",
        effect(player) {
            player.poisonResistant = true
        },
        remove(player) {
            console.log("removed item")
            player.poisonResistant = false
        }
    },
    {
        id: "h26",
        name: "Medic Gear",
        price: 5000,
        description: "You slowly regenerate health	",
        effect(player) {
            let healInterval = setInterval(() => {
                player.takeHP(5)
            }, 800)
            player.effectManger.addEffect({ id: this.id, effect: healInterval })
        }, remove(player) {
            let effect = player.effectManger.getEffect(this.id)
            if (effect != null) {
                clearInterval(effect.effect)
            }
            player.effectManger.removeEffect(this.id)
            console.log("removed item")
        }
    },
    {
        id: "h27",
        name: "Miner Helmet",
        price: 5000,
        description: "Earn 1 extra gold per resource",
        effect(player) {
            player.farmGoldBonus += 1
        },
        remove(player) {
            console.log("removed item")
            player.farmGoldBonus -= 1
        }
    }, {
        id: "h28",
        name: "Musketeer Hat",
        price: 5000,
        description: "Reduces cost of projectiles",
        effect(player) {
            player.projectileCostModifier -= 0.2
        },
        remove(player) {
            console.log("removed item")
            player.projectileCostModifier += 0.2
        }
    }, {
        id: "h29",
        name: "Bull Helmet",
        price: 6000,
        description: "Increases damage done but drains health",
        effect(player) {
            player.damageModifier += 0.3
            player.selfDamage += 0.3
        },
        remove(player) {
            console.log("removed item")
            player.damageModifier -= 0.3
            player.selfDamage -= 0.3
        }
    }, {
        id: "h30",
        name: "Emp Helmet",
        price: 6000,
        description: "Turrets won't attack you but you move slower",
        effect(player) {
            player.turretIgnored = true
        },
        remove(player) {
            console.log("removed item")
            player.turretIgnored = false
        }
    }, {
        id: "h31",
        name: "Booster Hat",
        price: 6000,
        description: "Increases your movement speed",
        effect(player) {
            player.speedModifier += 0.5
        },
        remove(player) {
            console.log("removed item")
            player.speedModifier -= 0.5
        }
    }, {
        id: "h32",
        name: "Barbarian Armor",
        price: 8000,
        description: "Knocks back enemies that attack you",
        effect(player) {
            player.forceReflect += 5
        },
        remove(player) {
            console.log("removed item")
            player.forceReflect -= 5
        }
    }, {
        id: "h33",
        name: "Plague Mask",
        price: 10000,
        description: "Melee attacks deal poison damage",
        effect(player) {
            player.meleeDealPoison = true
        },
        remove(player) {
            console.log("removed item")
            player.meleeDealPoison = false
        }
    }, {
        id: "h34",
        name: "Bull Mask",
        price: 10000,
        description: "Bulls won't target you unless you attack them",
        effect(player) {
            player.bullIgnored = true
        },
        remove(player) {
            console.log("removed item")
            player.bullIgnored = false
        }
    },
    {
        id: "h35",
        name: "Windmill Hat",
        price: 10000,
        description: "Generates points while worn	",
        effect(player) {
            let effect = setInterval(() => {
                player.addGold(5)
            }, 1000)
            player.effectManger.addEffect({ id: this.id, effect: effect })
        },
        remove(player) {
            let effect = player.effectManger.getEffect(this.id)
            if (effect != null) {
                clearInterval(effect.effect)
            }
            player.effectManger.removeEffect(this.id)
            console.log("removed item")
        }
    }, {
        id: "h36",
        name: "Spike Gear",
        price: 10000,
        description: "Deal damage to players that damage you",
        effect(player) {
            player.damageReflect += 0.15
        }, remove(player) {
            console.log("removed item")
            player.damageReflect -= 0.15
        }
    }, {
        id: "h37",
        name: "Turret Gear",
        price: 10000,
        description: "You become a walking turret",
        effect(player) {

        },
        remove(player) {
            console.log("removed item")
        }
    }, {
        id: "h38",
        name: "Samurai Armor",
        price: 12000,
        description: "Increased attack speed and fire rate",
        effect(player) {
            player.attackSpeedModifier += 0.5
        },
        remove(player) {
            console.log("removed item")
            player.attackSpeedModifier -= 0.5
        }
    }, {
        id: "h39",
        name: "Dark Knight",
        price: 12000,
        description: "Restores health when you deal damage",
        effect(player) {
            player.lifeSteal += 0.4
        },
        remove(player) {
            console.log("removed item")
            player.lifeSteal -= 0.4
        }
    }, {
        id: "h40",
        name: "Scavenger Gear",
        price: 15000,
        description: "Earn double points for each kill",
        effect(player) {
            player.killBonusGold += 1
        },
        remove(player) {
            console.log("removed item")
            player.killBonusGold -= 1
        }
    }, {
        id: "h41",
        name: "Tank Gear",
        price: 15000,
        description: "Increased damage to buildings but slower movement",
        effect(player) {
            player.structureDamageModifier += 0.4
        },
        remove(player) {
            console.log("removed item")
            player.structureDamageModifier -= 0.4
        }
    }, {
        id: "h42",
        name: "Thief Gear",
        price: 15000,
        description: "Steal half of a players gold when you kill them.",
        effect(player) {
            player.wearThiefGear = true
        },
        remove(player) {
            console.log("removed item")
            player.wearThiefGear = false
        }
    }, {
        id: "h43",
        name: "Bloodthirster Gear",
        price: 20000,
        description: "Restore Health when dealing damage. And increased damage	",
        effect(player) {
            player.lifeSteal += 0.3
            player.damageModifier += 0.3
        },
        remove(player) {
            console.log("removed item")
            player.lifeSteal -= 0.3
            player.damageModifier -= 0.3
        }
    }, {
        id: "h44",
        name: "Assassin Gear",
        price: 20000,
        description: "Go invisible when not moving or attacking. Can't eat. Increased speed",
        effect(player) {
            player.isInvisible = true
            player.speedModifier += 0.2
        },
        remove(player) {
            console.log("removed item")
            player.isInvisible = false
            player.speedModifier -= 0.2
        }
    },
    ]
}
module.exports = Hats