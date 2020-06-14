const Server = require('./class/server')
const ServerConfig = require('./class/serverconfig')

const publicIp = require('public-ip');
const axios = require('axios').default;





const express = require('express')

const path = require('path')
const app = express()
const web = require('http').Server(app)
const PORT = process.env.PORT || 8080

const updateServerPasssword = "Dg;=8&gPZ%^e5q%"

var serverList = {
    local: "localhost:8080",
    asia: "",
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
    console.log(`req.query.password == updateServerPasssword ${req.query.password == updateServerPasssword}`);

    if (req.query.serverId != null && req.query.password == updateServerPasssword) {
        serverList[req.query.serverId] = req.query.serverAddress + ":8080"
        console.log(`updated ${serverList[req.query.serverId]}`);
    }
    res.status(200);
})
console.log("express run on: ", listener.address().port)



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
updateIpAdressOnMainServer()

let server = new Server(ServerConfig, web)