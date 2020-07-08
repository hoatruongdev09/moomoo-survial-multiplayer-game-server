const publicIp = require('public-ip');
const axios = require('axios').default;
const db = require("../models/index")

const serverList = {
    updateServerPasssword: "Dg;=8&gPZ%^e5q%",

    serverList: {
        // local: "localhost:8080",
        asia: "",
        us: "moomoo-server.herokuapp.com",
    },

    getServerList: async function () {
        for (var key in this.serverList) {
            var model = await db.Url.findOne({
                where: {
                    name: key
                }
            }).then(model => {
                // console.dir(model);
                if (model != null) {
                    console.log("model.dataValues.address ", model.dataValues.address)
                    this.serverList[key] = model.dataValues.address + ":8080"
                }
            })
            // console.dir(model);
        }
    },
    // updateServer({
    //     query: {
    //         password: updateServerPasssword,
    //         serverAddress: "54.169.71.33",
    //         serverId: "asia"
    //     }
    // })

    updateServer: function (req, res) {
        console.log(`req.query.password == updateServerPasssword ${req.query.password == this.updateServerPasssword}`);
        const serverId = req.query.serverId
        if (serverId != null && req.query.password == this.updateServerPasssword) {
            // serverList[serverId] = req.query.serverAddress + ":8080";
            console.log(`updated ${this.serverList[req.query.serverId]}`);

            this.updateOrCreate(db.Url, {
                    name: serverId
                }, {
                    address: req.query.serverAddress,
                    name: serverId
                })
                .then(function (result) {
                    serverList.getServerList();
                    result.item; // the model
                    result.created; // bool, if a new item was created.
                });
        }
        res.status(200);
    },

    updateOrCreate: async function (model, where, newItem) {
        // First try to find the record
        const foundItem = await model.findOne({
            where
        });
        if (!foundItem) {
            // Item not found, create a new one
            const item = await model.create(newItem)
            return {
                item,
                created: true
            };
        }
        // Found an item, update it
        const item = await model.update(newItem, {
            where
        });
        return {
            item,
            created: false
        };
    },

    updateIpAdressOnMainServer: async function () {
        console.log(`pulic ip: ${await publicIp.v4()}`)
        let ip = await publicIp.v4()
        let query = {
            serverId: 'asia',
            serverAddress: ip
        }
        console.log(query);

        axios.get('http://moomoo-server.herokuapp.com/update_server', {
            params: {
                serverId: 'asia',
                serverAddress: ip,
                password: "Dg;=8&gPZ%^e5q%"
            }
        }).then(() => {

        }).catch((error) => {
            console.log("error send update server ", error.response);

        })
    }
}
module.exports = serverList;