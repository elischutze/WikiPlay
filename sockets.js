const Game = require('./game')
const players = {}
const games = {}
module.exports = io => {
  io.on('connection', (client) => {
    players[client.id] = { name: null, room: null }
    client.on('disconnect', () => {
      delete players[client.id]
    })

    client.on('setName', name => {
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
        // client.emit('current scores',games[room].players)
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
      games[room].newRound(round)
      client.broadcast.to(room).emit('newRound', round)
    })

    client.on('increment counter', (num, room) => {
      console.log('server received increment counter, game:', games[room])
      games[room].clicked(players[client.id].name)
      client.broadcast.to(room).emit('increment', players[client.id].name, num)
    })
// client.on list end
  }) }
