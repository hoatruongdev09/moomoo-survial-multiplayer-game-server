const Hats = {
    getHatById(id) {
        for (let i = 0; i < this.infos.length; i++) {
            if (this.infos[i].id == id) {
                return this.infos[i];
            }
        }
        return null;
    },
    infos: [{
            id: "h0",
            name: "Moo Cap",
            price: 0,
        },
        {
            id: "h1",
            name: "Apple Cap",
            price: 0,
        }, {
            id: "h2",
            name: "Moo Head",
            price: 0,
        }, {
            id: "h3",
            name: "Pig Head",
            price: 0,
        }, {
            id: "h4",
            name: "Fluff Head",
            price: 0,
        }, {
            id: "h5",
            name: "Pandou Head",
            price: 0,
        }, {
            id: "h6",
            name: "Bear Head",
            price: 0,
        },
        {
            id: "h7",
            name: "Monkey Head",
            price: 0,
        }, {
            id: "h8",
            name: "Polar Head",
            price: 0,
        },
        {
            id: "h9",
            name: "Fez Hat",
            price: 0,
        },
        {
            id: "h10",
            name: "Enigma Hat",
            price: 0,
        }, {
            id: "h11",
            name: "Blitz Hat",
            price: 0,
        }, {
            id: "h12",
            name: "Bob XIII Hat",
            price: 0,
        }, {
            id: "h13",
            name: "Pumpkin Hat",
            price: 50,
        }, {
            id: "h14",
            name: "Bummel Hat",
            price: 100,
        }, {
            id: "h15",
            name: "Straw Hat",
            price: 500,
        }, {
            id: "h16",
            name: "Winter cap",
            price: 600,
            effect(player) {

            }
        }, {
            id: "h17",
            name: "Cowboy Hat",
            price: 1000,
        }, {
            id: "h18",
            name: "Ranger Hat",
            price: 2000,
        }, {
            id: "h19",
            name: "Explorer Hat",
            price: 2000,
        }, {
            id: "h20",
            name: "Flipper Hat",
            price: 2500,
            effect(player) {

            }
        },
        {
            id: "h21",
            name: "Marksman Hat",
            price: 3000,
            effect(player) {

            }
        },
        {
            id: "h22",
            name: "Bush Gear",
            price: 3000,
            effect(player) {

            }
        }, {
            id: "h23",
            name: "Halo",
            price: 3000
        }, {
            id: "h24",
            name: "Soldier Helmet",
            price: 4000,
            effect(player) {

            }
        }, {
            id: "h25",
            name: "Anti Venom Gear",
            price: 4000,
            effect(player) {

            }
        },
        {
            id: "h26",
            name: "Medic Gear",
            price: 5000,
            effect(player) {

            }
        },
        {
            id: "h27",
            name: "Miner Helmet",
            price: 5000,
            effect(player) {

            }
        }, {
            id: "h28",
            name: "Musketeer Hat",
            price: 5000,
            effect(player) {

            }
        }, {
            id: "h29",
            name: "Bull Helmet",
            price: 6000,
            effect(player) {

            }
        }, {
            id: "h30",
            name: "Emp Helmet",
            price: 6000,
            effect(player) {

            }
        }, {
            id: "h31",
            name: "Booster Hat",
            price: 6000,
            effect(player) {

            }
        }, {
            id: "h32",
            name: "Barbarian Armor",
            price: 8000,
            effect(player) {

            }
        }, {
            id: "h33",
            name: "Plague Mask",
            price: 10000,
            effect(player) {

            }
        }, {
            id: "h34",
            name: "Bull Mask",
            price: 10000,
            effect(player) {

            }
        },
        {
            id: "h35",
            name: "Windmill Hat",
            price: 10000,
            effect(player) {

            }
        }, {
            id: "h36",
            name: "Spike Gear",
            price: 10000,
            effect(player) {

            }
        }, {
            id: "h37",
            name: "Turret Gear",
            price: 10000,
            effect(player) {

            }
        }, {
            id: "h38",
            name: "Samurai Armor",
            price: 12000,
            effect(player) {

            }
        }, {
            id: "h39",
            name: "Dark Knight",
            price: 12000,
            effect(player) {

            }
        }, {
            id: "h40",
            name: "Scavenger Gear",
            price: 15000,
            effect(player) {

            }
        }, {
            id: "h41",
            name: "Tank Gear",
            price: 15000,
            effect(player) {

            }
        }, {
            id: "h42",
            name: "Thief Gear",
            price: 15000,
            effect(player) {

            }
        }, {
            id: "h43",
            name: "Bloodthirster Gear",
            price: 20000,
            effect(player) {

            }
        }, {
            id: "h44",
            name: "Assassin Gear",
            price: 20000,
            effect(player) {

            }
        },
    ]
}
module.exports = Hats