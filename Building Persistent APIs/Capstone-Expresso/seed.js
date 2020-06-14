const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Employee'", (error, table) => {
  if (error) {
    throw new Error(error);
  }

  if (table) {
    db.serialize(function() {
      let employeeId;
      db.run("INSERT INTO Employee (name, position, wage) VALUES ('Employee 1', 'Manager', 10)");
      db.run("INSERT INTO Employee (name, position, wage) VALUES ('Employee 2', 'Employee', 15)", function(error) {
        if (error) {
          throw new Error(error);
        }
        employeeId = this.lastID;
      });
      db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Timesheet'", (error, table) => {
        if (error) {
          throw new Error(error);
        }

        if (table) {
          db.run(`INSERT INTO Timesheet (hours, rate, date, employee_id) VALUES (10, 15.5, 1506100907820, ${employeeId})`);
          db.run(`INSERT INTO Timesheet (hours, rate, date, employee_id) VALUES (8, 15.5, 1406100907820, ${employeeId})`);
        }
      });
    });
  }
});

db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Menu'", (error, table) => {
  if (error) {
    throw new Error(error);
  }

  if (table) {
    db.serialize(function() {
      let menuId;
      db.run("INSERT INTO Menu (title) VALUES ('Breakfast')");
      db.run("INSERT INTO Menu (title) VALUES ('Lunch')");
      db.run("INSERT INTO Menu (title) VALUES ('Dinner')", function(error) {
        if (error) {
          throw new Error(error);
        }
        menuId = this.lastID;
      });
      db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='MenuItem'", (error, table) => {
        if (error) {
          throw new Error(error);
        }

        if (table) {
          db.run(`INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ('Pot Pie', 'Ooey Gooey and pairs well with espresso', 10, 6.5, ${menuId})`);
          db.run(`INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ('Cake Pop', 'The classic, not really a dinner entree', 15, 3.5, ${menuId})`);
        }
      });
    });
  }
});

