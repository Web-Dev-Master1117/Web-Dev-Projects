menu={
  _courses:{
    appetizers: [],
    mains: [],
    desserts: []
  },
  get appetizers(){
      return this._courses.appetizers;
    },
    set appetizers(dish){
      this._courses.appetizers=dish;
    },
    get mains(){
      return this._courses.mains;
    },
    set mains(dish){
      this._courses.mains=dish;
    },
    get desserts(){
      return this._courses.desserts;
    },
    set desserts(dish){
      this._courses.desserts=dish
    },
  get courses(){
    return {
      appetizers: this.appetizers,
      mains: this.mains,
      desserts: this.desserts
    };
  },
  addDishToCourse(courseName, dishName, dishPrice){
    const dish= {
      name: dishName,
      price: dishPrice
    };
    this._courses[courseName].push(dish)
  },
  getRandomDishFromCourse(courseName){
    dishes=this._courses[courseName]
    const randomIndex = Math.floor(Math.random()*dishes.length)
    return dishes[randomIndex]
  },
  generateRandomMeal(){
    const appetizer=this.getRandomDishFromCourse('appetizers')
    const main=this.getRandomDishFromCourse('mains')
    const dessert=this.getRandomDishFromCourse('desserts')
    totalPrice=appetizer.price + main.price + dessert.price;
    console.log(`Menu

    ${appetizer.name} : ${appetizer.price} 
    ${main.name} : ${main.price}
    ${dessert.name} : ${dessert.price}

Total Price of meal is ${totalPrice}`)
  }
}


menu.addDishToCourse('appetizers', 'Ceasar Salad', 4.25)
menu.addDishToCourse('appetizers', 'Soup', 3.2)
menu.addDishToCourse('appetizers', 'Momos', 1.2)
menu.addDishToCourse('appetizers', 'Chicken wings', 2.5)

menu.addDishToCourse('mains', 'Dal Makhni', 2.2)
menu.addDishToCourse('mains', 'Sahi Korma', 4.1)
menu.addDishToCourse('mains', 'Malai Kofta', 2.8)
menu.addDishToCourse('mains', 'Kadai Paneer', 4.5)

menu.addDishToCourse('desserts', 'Gulab Jamun', 0.4)
menu.addDishToCourse('desserts', 'Ice cream', 0.2)
menu.addDishToCourse('desserts', 'Roshogulla', 0.2)
menu.addDishToCourse('desserts', 'Coke', 0.2)

menu.generateRandomMeal();