class Media {
  constructor(title){
    this._title = title
    this._isCheckedOut = false
    this._ratings = []
  }

  get title() {
    return this._title
  }
  get isCheckedOut() {
    return this._isCheckedOut
  }
  get ratings() {
    return this._ratings
  }

  set isCheckedOut(is) {
    this._isCheckedOut = is
  }

  getAverageRating() {
    const average = this._ratings.reduce((accumulator, value) => accumulator + value)
    return Math.round(average/this._ratings.length)
  }
  toggleCheckOutStatus() {
    if(this._isCheckedOut) this._isCheckedOut = false
    else this._isCheckedOut = true
  }
  addRating(rating) {
    this._ratings.push(rating)
  }
}

class Book extends Media {
  constructor(author, title, pages) {
    super(title)
    this._author = author
    this._pages = pages
  }
  get author() {
    return this._author
  }
  get pages() {
    return this._pages
  }
}

class Movie extends Media {
  constructor(title, director, runTime) {
    super(title)
    this._direcotr = director
    this._runTime = runTime
  }
  get director () {
    return this._director
  }
  get runTime() {
    return this._runTime
  }
}

const historyOfEverything = new Book('Bill Bryson', 'A Short History of Nearly Everything', 544)
historyOfEverything.toggleCheckOutStatus()
console.log(historyOfEverything.isCheckedOut)
historyOfEverything.addRating(4)
historyOfEverything.addRating(5)
historyOfEverything.addRating(5)
console.log(historyOfEverything.getAverageRating())

const speed = new Movie('Jan de Bont', 'Speed', 116)
speed.toggleCheckOutStatus()
console.log(speed.isCheckedOut)
speed.addRating(1,1,5)
console.log(speed.getAverageRating())