const Server = require('./class/server')
const ServerConfig = require('./class/serverconfig')

const path = require('path')

const serverList = require('./class/serverList')
const clientInfo = require('./class/clientInfo');

const express = require('express')


const app = express()
const web = require('http').Server(app)
const PORT = process.env.PORT || 8080


app.use(express.static(path.join(__dirname, 'Game')));

let listener = web.listen(PORT)

app.get('/', (req, res) => {
    res.status(200).send("OK")
})
app.get('/server_list', (req, res) => {
    res.status(200).send(serverList.serverList)
    // res.status(200).send({
    //     us: "moumou-server-test.herokuapp.com",
    // })
})
app.get('/update_server', (req, res) => {
    serverList.updateServer(req, res);
})
app.get('/client_version', (req, res) => {
    clientInfo.clientVersion(req, res);
})
console.log("express run on: ", listener.address().port)

serverList.getServerList(); // only get server list if on main server (heroku)
// serverList.updateIpAdressOnMainServer() // Only update current server ip on not main server

let server = new Server(ServerConfig, web)