const accessoryInfos = {
    getAccessoryById(id) {
        for (let i = 0; i < this.info.length; i++) {
            if (this.info[i].id == id) {
                return this.info[i]
            }
        }
        return null
    },
    info: [{
            id: "a0",
            name: "Snowball",
            price: 1000
        }, {
            id: "a1",
            name: "Tree Cape",
            price: 1000
        }, {
            id: "a2",
            name: "Stone Cape",
            price: 1000
        }, {
            id: "a3",
            name: "Cookie Cape",
            price: 1500
        },
        {
            id: "a4",
            name: "Cow Cape",
            price: 2000
        }, {
            id: "a5",
            name: "Mokey Tail",
            price: 2000,
            effect(player) {

            }
        }, {
            id: "a6",
            name: "Apple Basket",
            price: 3000,
            effect(player) {

            }
        }, {
            id: "a7",
            name: "Winter Cape",
            price: 3000,
        }, {
            id: "a8",
            name: "Skull Cape",
            price: 4000,
        }, {
            id: "a9",
            name: "Dash Cape",
            price: 5000,
        }, {
            id: "a10",
            name: "Dragon Cape",
            price: 6000,
        }, {
            id: "a11",
            name: "Super Cape",
            price: 8000,
        }, {
            id: "a12",
            name: "Troll Cape",
            price: 8000,
        },
        {
            id: "a13",
            name: "Thorns",
            price: 10000,
        },
        {
            id: "a14",
            name: "Blockades",
            price: 10000,
        }, {
            id: "a15",
            name: "Devils Tail",
            price: 10000,
        }, {
            id: "a16",
            name: "Sawblade",
            price: 12000,
        },
        {
            id: "a17",
            name: "Angel Wings",
            price: 15000,
            effect(player) {

            }
        },
        {
            id: "a18",
            name: "Shadow Wings",
            price: 15000,
            effect(player) {

            }
        },
        {
            id: "a19",
            name: "Blood Wings",
            price: 20000,
            effect(player) {

            }
        },
        {
            id: "a20",
            name: "Corupt X Wings",
            price: 15000,
            effect(player) {

            }
        },
    ]
}

module.exports = accessoryInfos