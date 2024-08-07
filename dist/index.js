"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const gameManager = new GameManager_1.GameManager();
wss.on('connection', function connection(ws) {
    // On connection we should create user
    gameManager.addUser(ws);
    console.log('web socket is working');
    // removing user when disconnecting
    ws.on('disconnect', () => gameManager.removeUser(ws));
});
