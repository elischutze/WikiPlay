const Game = require('./game')

const players = {}
const games = {}

module.exports = io => {
  io.on('connection', (client) => {
    console.log('User connected');
    players[client.id] = { name: null, room: null }
    console.log('players:\n', players);

    client.on('disconnect', () => {
      // if (players[client.id].name) {
      //   for (let game = 0; game < Object.keys(games).length; game++) {
      //     const index = games[Object.keys[game]].players.indexOf(players[client.id].name)
      //     if (index >= 0) {
      //       games[game][players].splice(index, 1)
      //     }
      //   }
      // }
      delete players[client.id]
      console.log('Removed \n players:', players);
    })

    client.on('setName', name => {
      // TODO if name already exists
      players[client.id].name = name
      console.log('Added Name! \n players:', players);
    })

    client.on('joinNewGame', (name, room) => {
      console.log('join new game:');
      console.log('Game name:', room);
      console.log('name:', name);
      // check if player exists
      if (client.id in players) {
        console.log('player exists!');
        if (players[client.id].room === null) {
          // check if gamename exists
          if (!games[room]) {
            const newGame = new Game(room, name)
            console.log('new game created:', newGame, '\n');
            games[room] = newGame
            console.log('current games', games, '\n');
            client.join(room)
          } else {
            client.emit('gameExists')
          }
        } else {
          client.emit('error', 'You are already part of a game!')
        }
      } else {
        players[client.id] = { name, room }
        console.log('players:', players);
        if (!games[room]) {
          const newGame = new Game(room, name)
          games[room] = newGame
          client.join(room)
        } else {
          client.emit('gameExists')
        }
      }
    }) // end on join new game

    client.on('joinGame', (name, room) => {
      console.log('current games:', Object.keys(games), room.toString());
      // check game exists
      if (Object.keys(games).indexOf(room) >= 0) {
        games[room].addPlayer(name)
      } else {
        client.emit('error', 'That game does not exist')
      }
    })
  })
};
