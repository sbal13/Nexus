const fetch = require('node-fetch')

const config = require('./config.js') 
const HTTPEndpoint = config.APIENDPOINT

class HTTPConn {
  constructor(prepareBoard, teamID){
    this.prepareBoard = prepareBoard
    this.teamID = teamID
  }
  getBoard() {
    const route = `/board?id=${0}`
    return fetch(HTTPEndpoint + route)
    .then(response => response.arrayBuffer())
    .then(bufferData => {
      const pixelArray = Array.prototype.slice.call(new Uint8ClampedArray(bufferData))
      this.prepareBoard(pixelArray)
    })
    .catch((error) => console.log("Server failure!"))

  }

  setTile(x, y, c) {
      fetch(HTTPEndpoint + `/tile?x=${x}&y=${y}&c=${c}&id=${this.teamID}`, {
        method: 'Post',
        mode: 'no-cors',
      })
      .then(response => response)
  }
}

module.exports = HTTPConn