const Game = require('./game')

let players = {}
let games = {}

module.exports = io => {
  io.on('connection', (client) => {
    console.log('User connected');
    players[client.id] = { name: null, room: null }
    console.log('players:', players);

    client.on('disconnect', () => {
      delete players[client.id]
      console.log('Removed \n players:', players);
    })

    client.on('setName', name => {
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
          if (!games[name]) {
            const newGame = new Game(room, name)
            console.log('new game created:', newGame, '\n');
            games[name] = newGame
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
        if (!games[name]) {
          const newGame = new Game(room, name)
          games[room] = newGame
          client.join(room)
        } else {
          client.emit('gameExists')
        }
      }
    })
  })
};
