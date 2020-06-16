const Server = require('./class/server')
const ServerConfig = require('./class/serverconfig')

const publicIp = require('public-ip');
const axios = require('axios').default;
const jsonfile = require('jsonfile')
const path = require('path')

const serverListFile = path.join(__dirname, 'serverListFile.json')
const db = require("./models/index")





const express = require('express')


const app = express()
const web = require('http').Server(app)
const PORT = process.env.PORT || 8080

const updateServerPasssword = "Dg;=8&gPZ%^e5q%"

var serverList = {
    local: "localhost:8080",
    asia: "54.169.71.33:8080",
    us: "moomoo-server.herokuapp.com",
}

app.use(express.static(path.join(__dirname, 'Game')));

let listener = web.listen(PORT)

app.get('/', (req, res) => {
    res.status(200).send("OK")
})
app.get('/server_list', (req, res) => {
    res.status(200).send(serverList)
})
app.get('/update_server', (req, res) => {
    updateServer(req, res);
})
console.log("express run on: ", listener.address().port)

function getServerList() {
    for (var key in serverList) {
        db.Url.findAll({
            where: {
                name: key
            }
        }).then(model => {
            console.dir(model)
        })
    }
}

getServerList()

function updateServer(req, res) {
    console.log(`req.query.password == updateServerPasssword ${req.query.password == updateServerPasssword}`);
    const serverId = req.query.serverId
    if (serverId != null && req.query.password == updateServerPasssword) {
        serverList[serverId] = req.query.serverAddress + ":8080";
        console.log(`updated ${serverList[req.query.serverId]}`);
        db.Url.upsert({
                address: req.query.serverAddress,
                where: {
                    name: serverId
                }
            })
            .then(([urlObj, created]) => {
                res.send("done")
            });
    }
    res.status(200);
}

async function updateIpAdressOnMainServer() {
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
// updateIpAdressOnMainServer()

let server = new Server(ServerConfig, web)