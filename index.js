const Nexus = function (teamID, secretKey) {
  if ((Number.isInteger(teamID) && teamID > 0) || (teamID === 0 && secretKey && secretKey === "mayisgr8")) {

    const express = require('express')
    const app = express()
    const cors = require('cors')
    const url = require('url');
    const bodyParser = require('body-parser');
    const fetch = require('node-fetch');

    const Game = require('./Game.js')
    const config = require("./config.js")
    const validColor = require("./validations/color.js")
    const validPoint = require("./validations/point.js")

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors())

    // CONFIG
    const port = config.HTTPPORT
    const HTTPEndpoint = config.APIENDPOINT
     
    // GLOBAL VARS
    let queue = []

    // game
    const game = new Game(teamID)

    // HELPERS
    function startInterval() {
      setInterval(() => {
        if (queue.length > 0) {
          let nextPoint = queue.shift()
          console.log("SENDING", nextPoint)
          game.setTile(nextPoint.x, nextPoint.y, nextPoint.c, nextPoint.id)
        }
      }, config.INTERVAL)
    }
    startInterval()

    // ROUTES
    app.get('/get-tile', (req, res) => {
      const x = parseInt(req.query.x, 10)
      const y = parseInt(req.query.y, 10)
      if (validPoint(x,y)) {
        let color = game.board[`${x}-${y}`]
        res.send({x,y,color})
      } else {
        res.send({error: `Invalid point. (${x},${y}) not on board`})
      }
    })

    app.get("/board", (req, res) => {
        res.send(game.convertBoard())
    })

    app.post('/set-tile', (req, res) => {
      const x = parseInt(req.body.x)
      const y = parseInt(req.body.y)
      const c = req.body.c

      if (validPoint(x,y)) {
        if (validColor(c)){
          const coordinate = {x, y, c, id: teamID}
          queue.push(coordinate)
          res.send({success: "Successfully queued!", coordinate, position: queue.length})
        } else {
          res.send({error: `${c} is not a valid Hexidecimal color.`})
        }
      } else {
        res.send({error: `Invalid point. (${x},${y}) not on board`})
      }
    })

    app.get('/get-queue', (req, res) => {
      res.send(queue)
    })

    app.delete('/clear-queue', (req, res) => {
      let numItemsRemoved = queue.length
      queue = []
      res.send({message: `Queue successfully cleared. ${numItemsRemoved} items removed.`})
    })



    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
  } else {
    throw new Error("INVALID TEAM ID")
  }
}

module.exports = Nexus
