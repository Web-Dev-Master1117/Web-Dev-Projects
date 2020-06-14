team={
  _players: [
    {
      firstName: 'Deepak',
      lastName: 'Kumar',
      age: 19
    },
    {
      firstName: 'Nihal',
      lastName: 'Ranjan',
      age: 15
    },
    {
      firstName: 'Komal',
      lastName: 'Khopri',
      age: 18
    }
  ],
  _games: [
    {
      opponent: 'Red Bull',
      teamPoints: 42,
      opponentPoints: 27
    },
    {
      opponent: 'Black Panther',
      teamPoints: 23,
      opponentPoints: 26
    },
    {
      opponent: 'American Dogs',
      teamPoints: 34,
      opponentPoints: 12
    }
  ],
  get players(){
    return this._players
  },
  addPlayer(firstName, lastName, age){
    let player={
      firstName, lastName, age 
    }
    this._players.push(player)
  },
  addGame(opponent, teamPoints, opponentPoints){
    let game={
      opponent, teamPoints, opponentPoints
    }
    this._games.push(game)
    console.log(Object.keys(this._games).length)
  }
}

team.addPlayer('Steph', 'Curry', 28)
team.addPlayer('Lisa', 'Leslie', 44)
team.addPlayer('Bugs', 'Bunny', 76)

team.addGame('Delhi Hawk', 100 ,98)
team.addGame('Delhi Daredevils', 121 ,89)
team.addGame('Kings XI Punjab', 30 ,45)