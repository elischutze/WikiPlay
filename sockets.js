const Game = require('./game')
const players = {}
const games = {}
module.exports = io => {
  io.on('connection', (client) => {
    players[client.id] = { name: null, room: null }

    client.on('disconnect', () => {
      // TODO if (players[client.id].name) {
      //   for (let game = 0; game < Object.keys(games).length; game++) {
      //     const index = games[Object.keys[game]].players.indexOf(players[client.id].name)
      //     if (index >= 0) {
      //       games[game][players].splice(index, 1)
      //     }
      //   }
      // }
      delete players[client.id]
    })
    client.on('setName', name => {
      // TODO if name already exists
      players[client.id].name = name
    })
    client.on('joinNewGame', (name, room) => {
      // check if player exists
      if (client.id in players) {
        if (players[client.id].room === null) {
          // check if gamename exists
          if (!games[room]) {
            const newGame = new Game(room, name)
            games[room] = newGame
            client.join(room)
            io.to(room).emit('userjoin', games[room].players)
            client.emit('made-joined-room', room)
            client.emit('room', room)
          } else {
            client.emit('gameExists')
          }
        } else {
          client.emit('error', 'You are already part of a game!')
        }
      } else {
        players[client.id] = { name, room }
        if (!games[room]) {
          const newGame = new Game(room, name)
          games[room] = newGame
          client.join(room)
          io.to(room).emit('userjoin', games[room].players)
          client.emit('room', room)
        } else {
          client.emit('gameExists')
        }
      }
    }) // end on join new game

    client.on('joinGame', (name, room) => {
      // check game exists
      if (Object.keys(games).indexOf(room) >= 0) {
        games[room].addPlayer(name)
        client.join(room)
        client.emit('room', room)
        io.to(room).emit('userjoin', games[room].players)
      } else {
        client.emit('game-doesnt-exist', 'That game does not exist')
      }
    })

    client.on('getRound', (room) => {
      let round = games[room].round
      client.emit('newRound', round)
    })

    client.on('setNewRound', (round, room) => {
      console.log(games)
      games[room].newRound(round)
      client.broadcast.to(room).emit('newRound', round)
    })
// client.on list end
  })
}
