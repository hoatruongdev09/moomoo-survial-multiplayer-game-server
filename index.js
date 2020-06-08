const Server = require('./class/server')
const ServerConfig = require('./class/serverconfig')

const publicIp = require('public-ip');





const express = require('express')

const path = require('path')
const app = express()
const web = require('http').Server(app)
const PORT = process.env.PORT || 8080

const serverList = {
    local: "localhost:8080",
    asia: "54.151.213.35:8080",
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
console.log("express run on: ", listener.address().port)



async function test() {
    console.log(`pulic ip: ${await publicIp.v4()}`)
}
test()

let server = new Server(ServerConfig, web)