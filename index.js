const Server = require("./class/server");
const ServerConfig = require("./class/serverconfig");

const path = require("path");

const serverList = require("./class/serverList");
const clientInfo = require("./class/clientInfo");

const express = require("express");

const app = express();
const web = require("http").Server(app);
const PORT = process.env.PORT || 8080;
const ip = require("ip");
const firebase = require("./firebase");
const {
    error
} = require("console");

app.use(express.static(path.join(__dirname, "Game")));

let listener = web.listen(PORT);

app.get("/", (req, res) => {
    res.status(200).send("OK");
});
app.get("/server_list", (req, res) => {
    // res.status(200).send(serverList.serverList)
    res.status(200).send({
        asia: `${ip.address()}:8080`, //"localhost:8080"
        us: "moumou-server-test.herokuapp.com",
    });
});
app.get("/update_server", (req, res) => {
    serverList.updateServer(req, res);
});
app.get("/client_version", (req, res) => {
    clientInfo.clientVersion(req, res);
});
console.log("express run on: ", listener.address().port);

// serverList.getServerList(); // only get server list if on main server (heroku)
serverList.updateIpAdressOnMainServer() // Only update current server ip on not main server

let server = new Server(ServerConfig, web);


process.stdin.resume();

function exitHandler(options, exitCode) {
    if (options.cleanup) {
        console.log("before exit: ", exitCode);
        firebase.uploadExit(exitCode);
    }
    if (exitCode || exitCode === 0) {
        console.log("application quit: ", exitCode);
    }
    if (options.exit) {
        process.exit();
    }
}
//do something when app is closing
process.on("exit", exitHandler.bind(null, {
    cleanup: true
}));

//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, {
    exit: true
}));

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null, {
    exit: true
}));
process.on("SIGUSR2", exitHandler.bind(null, {
    exit: true
}));

process.on("uncaughtException", (err) => {
    console.error(err);
    // if (listError.includes(err.message)) {
    //     listError.push(err.message);
    // } else {
    listError.push(err.message);
    firebase.uploadError({
        type: "uncaughtException",
        time: new Date(),
        detail: {
            name: err.name,
            message: err.message,
            stack: err.stack,
        },
        host: ip.address(),
    });
    // }
});