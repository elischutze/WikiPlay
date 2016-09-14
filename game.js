function Game (name, creator) {
  this.roomname = name
  this.creator = creator
  this.players = [creator]
  this.round = {}
}

Game.prototype.addPlayer = function (player) {
  this.players.push(player)
}

Game.prototype.newRound = function (data) {
  this.round = data
}

module.exports = Game
