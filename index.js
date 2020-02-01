const Server = require('./class/server')
const ServerConfig = require('./class/serverconfig')





const express = require('express')

const path = require('path')
const app = express()
const web = require('http').Server(app)
const PORT = process.env.PORT || 8080
app.use(express.static(path.join(__dirname, 'Game')));

let listener = web.listen(PORT)

app.get('/', (req, res) => {
    res.status(200).send("OK")
})
app.get('/connectstring', (req, res) => {
    res.status(200).send("moomoo-server.herokuapp.com")
})
console.log("express run on: ", listener.address().port)

let server = new Server(ServerConfig, web)