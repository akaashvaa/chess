import { Chess } from 'chess.js'
import { WebSocket } from 'ws'
import { GAME_OVER, MOVE } from './messages'

export class Game {
  public player1: WebSocket
  public player2: WebSocket
  private board: Chess
  private moves: string[]
  private startTime: Date

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1
    this.player2 = player2
    this.board = new Chess()
    this.moves = []
    this.startTime = new Date()
  }

  makeMove(
    socket: WebSocket,
    move: {
      from: string
      to: string
    }
  ) {
    //validation here
    //is it users move
    //is it a valid move

    try {
      this.board.move({
        from: move.from,
        to: move.to,
      })
    } catch (error) {
      console.log('on move', error)
      return
    }
    if (this.board.isGameOver()) {
      // send tghe game over message to both player
      this.player1.emit(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() == 'w' ? 'black' : 'white',
          },
        })
      )
    }

    if (this.board.moves.length & 1) {
      this.player1.emit(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      )
    } else {
      this.player2.emit(
        JSON.stringify({
          type: MOVE,
          payload: move,
        })
      )
    }

    //update the board
    // push the move
    //check id the game is over
    // send the updated board to the player
  }
}
