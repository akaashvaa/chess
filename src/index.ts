import { WebSocketServer } from 'ws'
import { GameManager } from './GameManager'

const wss = new WebSocketServer({ port: 8080 })

const gameManager = new GameManager()

wss.on('connection', function connection(ws) {
  // On connection we should create user
  gameManager.addUser(ws)
  console.log('web socket is working')
  // removing user when disconnecting
  ws.on('disconnect', () => gameManager.removeUser(ws))
})
