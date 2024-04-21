import { Chess } from 'chess.js'
import { WebSocket } from 'ws'
import { GAME_OVER, INIT_GAME, MOVE } from './messages'

export class Game {
  public player1: WebSocket
  public player2: WebSocket
  private board: Chess
  private moveCount: number = 0
  private startTime: Date

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1
    this.player2 = player2
    this.board = new Chess()
    this.startTime = new Date()

    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          colors: 'white',
        },
      })
    )

    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          colors: 'black',
        },
      })
    )
  }

  makeMove(
    socket: WebSocket,
    move: {
      from: string
      to: string
    }
  ) {
    console.log(move)
    //validation here
    //is it users move
    //is it a valid move
    if (!(this.moveCount & 1) && socket !== this.player1) return
    if (this.moveCount & 1 && socket !== this.player2) return

    try {
      this.board.move(move)
    } catch (error) {
      console.log('on move \n', error)
      alert('invalid move')
      return
    }
    if (this.board.isGameOver()) {
      // send tghe game over message to both player
      this.player1.send(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() == 'w' ? 'black' : 'white',
          },
        })
      )
    }

    if (this.moveCount & 1) {
      this.player1.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      )
    } else {
      this.player2.send(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      )
    }

    this.moveCount++
    //update the board
    // push the move
    //check id the game is over
    // send the updated board to the player
  }
}
