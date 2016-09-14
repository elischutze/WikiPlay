function Game (name, creator) {
  this.roomname = name
  this.creator = creator
  this.players = {}
  this.players[creator] = 0
  this.round = {}
}

Game.prototype.addPlayer = function (player) {
  this.players[player] = 0
}

Game.prototype.newRound = function (data) {
  this.round = data
}

Game.prototype.clicked = function (name) {
  console.log('before', JSON.stringify(this.players))
  this.players[name] = this.players[name] + 1
  console.log('after', JSON.stringify(this.players))
}

module.exports = Game
