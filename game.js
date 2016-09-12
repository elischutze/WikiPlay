function Game(name, creator) {
  this.roomname = name
  this.creator = creator
  this.players = [creator]
}

Game.prototype.addPlayer = (player) => {
  this.players.push(player)
};

module.exports = Game
