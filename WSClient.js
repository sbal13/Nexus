const WebSocket = require('ws')
const config = require("./config.js")
const socketURI = config.APIWSENDPOINT

class WSClient {
    constructor(board, writeTile, game, timeout=2000) {

      this.game = game

      // INITIALIZER DISPATCH
      this.dispatch = {
        "writeTile": writeTile,
      }
      this.timeout = timeout

      this.board = board

      // BIND CONTEXT 
      this.handleMsg = this.handleMsg.bind(this)

      // INITIALIZE WS CONNECTION & ATTACH LISTENERS
      this.wsConn = new WebSocket(socketURI)
      this.wsConn.on('open', () => {
        console.log("SOCKET SUCCESSFULLY CONNECTED")
        this.timeout=2000
      })
      
      this.wsConn.on('message', this.handleMsg)
      this.wsConn.on('close', () => {
        console.log(`Socket connection closed. Retrying connection in ${this.refreshTimeout()/1000} seconds...`)
        if(this.refreshTimeout() < 10000) {
          setTimeout(() => {
            this.game.reconnectWS(this.refreshTimeout())
          }, this.refreshTimeout())
        } else {
          throw new Error("Web Socket connection failed. Please close this server and wait for instructions")
        }
      })

      this.wsConn.on('error', ()=> "")
        
    }

    refreshTimeout(){
      return this.timeout
    }

    handleMsg(msg){
      let data = JSON.parse(msg)
      // console.log(data)
      const {action, payload} = data

      if (action && payload)
        this.dispatch[action](payload)

    }



  }

module.exports = WSClient
