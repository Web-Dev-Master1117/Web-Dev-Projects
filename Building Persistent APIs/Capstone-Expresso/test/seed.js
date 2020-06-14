const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./test/test.sqlite');

function seedEmployeeDatabase(done) {
  db.serialize(function() {
    db.run('DROP TABLE IF EXISTS Employee');
    db.run('CREATE TABLE IF NOT EXISTS `Employee` ( ' +
               '`id` INTEGER NOT NULL, ' +
               '`name` TEXT NOT NULL, ' +
               '`position` TEXT NOT NULL, ' +
               '`wage` INTEGER NOT NULL, ' +
               '`is_current_employee` INTEGER NOT NULL DEFAULT 1, ' +
               'PRIMARY KEY(`id`) )');
    db.run("INSERT INTO Employee (id, name, position, wage) VALUES (1, 'Employee 1', 'Manager', 10)");
    db.run("INSERT INTO Employee (id, name, position, wage) VALUES (2, 'Employee 2', 'Employee', 15)");
    db.run("INSERT INTO Employee (id, name, position, wage, is_current_employee) VALUES (3, 'Employee 3', 'Employee', 20, 0)", done);
  });
}

function seedTimesheetDatabase(done) {
  db.serialize(function() {
    db.run('DROP TABLE IF EXISTS Timesheet');
    db.run('CREATE TABLE IF NOT EXISTS `Timesheet` ( ' +
               '`id` INTEGER NOT NULL, ' +
               '`hours` INTEGER NOT NULL, ' +
               '`rate` INTEGER NOT NULL, ' +
               '`date` INTEGER NOT NULL, ' +
               '`employee_id` INTEGER NOT NULL, ' +
               'PRIMARY KEY(`id`), ' +
               'FOREIGN KEY(`employee_id`) REFERENCES `Employee`(`id`) )');
    db.run("INSERT INTO Timesheet (id, hours, rate, date, employee_id) VALUES (1, 10, 15.5, 1506100907820, 1)");
    db.run("INSERT INTO Timesheet (id, hours, rate, date, employee_id) VALUES (2, 20, 15.5, 1506100907821, 1)");
    db.run("INSERT INTO Timesheet (id, hours, rate, date, employee_id) VALUES (3, 10, 15.5, 1506100907823, 2)", done);
  });
}

function seedMenuDatabase(done) {
  db.serialize(function() {
    db.run('DROP TABLE IF EXISTS Menu');
    db.run('CREATE TABLE IF NOT EXISTS `Menu` ( ' +
               '`id` INTEGER NOT NULL, ' +
               '`title` TEXT NOT NULL, ' +
               'PRIMARY KEY(`id`) )');
    db.run("INSERT INTO Menu (id, title) VALUES (1, 'Breakfast')");
    db.run("INSERT INTO Menu (id, title) VALUES (2, 'Lunch')");
    db.run("INSERT INTO Menu (id, title) VALUES (3, 'Dinner')", done);
  });
}

function seedMenuItemDatabase(done) {
  db.serialize(function() {
    db.run('DROP TABLE IF EXISTS MenuItem');
    db.run('CREATE TABLE IF NOT EXISTS `MenuItem` ( ' +
               '`id` INTEGER NOT NULL, ' +
               '`name` TEXT NOT NULL, ' +
               '`description` TEXT, ' +
               '`inventory` INTEGER NOT NULL, ' +
               '`price` INTEGER NOT NULL, ' +
               '`menu_id` INTEGER NOT NULL, ' +
               'PRIMARY KEY(`id`), ' +
               'FOREIGN KEY(`menu_id`) REFERENCES `Menu`(`id`) )');
    db.run("INSERT INTO MenuItem (id, name, description, inventory, price, menu_id) VALUES (1, 'Menu 1 Item 1 Name', 'Menu 1 Item 1 Description', 10, 2.5, 1)");
    db.run("INSERT INTO MenuItem (id, name, description, inventory, price, menu_id) VALUES (2, 'Menu 1 Item 2 Name', 'Menu 1 Item 2 Description', 20, 3, 1)");
    db.run("INSERT INTO MenuItem (id, name, description, inventory, price, menu_id) VALUES (3, 'Menu 2 Item 1 Name', 'Menu 2 Item 1 Description', 5, 1.5, 2)", done);
  });
}

// seedEmployeeDatabase(() => {})
// seedTimesheetsDatabase(() => {})
// seedMenuDatabase(() => {})
// seedMenuItemDatabase(() => {})

module.exports = {
  seedEmployeeDatabase: seedEmployeeDatabase,
  seedTimesheetDatabase: seedTimesheetDatabase,
  seedMenuDatabase: seedMenuDatabase,
  seedMenuItemDatabase: seedMenuItemDatabase
};