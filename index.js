const Server = require('./class/server')
const ServerConfig = require('./class/serverconfig')

const publicIp = require('public-ip');
const axios = require('axios').default;





const express = require('express')

const path = require('path')
const app = express()
const web = require('http').Server(app)
const PORT = process.env.PORT || 8080

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
    serverList[req.query.serverId] = req.query.serverAddress + ":8080"
    console.log(`updated ${serverList[req.query.serverId]}`);

    res.status(200);
})
console.log("express run on: ", listener.address().port)



async function test() {
    console.log(`pulic ip: ${await publicIp.v4()}`)
    let ip = await publicIp.v4()
    let query = {
        serverId: 'asia',
        serverAddress: ip
    }
    console.log(query);

    axios.get('moomoo-server.herokuapp.com/update_server', {
        params: {
            serverId: 'asia',
            serverAddress: ip
        }
    }).then(() => {

    }).catch((error) => {
        console.log("error send update server ", error.response);

    })
}
test()

let server = new Server(ServerConfig, web)