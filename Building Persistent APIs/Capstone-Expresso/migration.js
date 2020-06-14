const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

db.serialize(() => {
    //Employee Table
    db.run(`CREATE TABLE IF NOT EXISTS Employee (id INTEGER NOT NULL PRIMARY KEY, name TEXT NOT NULL, position TEXT NOT NULL, wage INTEGER NOT NULL, is_current_employee INTEGER NOT NULL DEFAULT 1)`);
    
    //Menu Table
    db.run('CREATE TABLE `Menu` ( ' + 
    '`id` INTEGER NOT NULL PRIMARY KEY, ' + 
    '`title` TEXT NOT NULL )');
    
    //Timesheet Table
    db.run('CREATE TABLE `Timesheet` ( ' +
    '`id` INTEGER NOT NULL, ' +
    '`hours` INTEGER NOT NULL, ' +
    '`rate` INTEGER NOT NULL, ' + 
    '`date` INTEGER NOT NULL, ' + 
    '`employee_id` INTEGER NOT NULL, ' +
    'PRIMARY KEY(`id`), ' +
    'FOREIGN KEY(`employee_id`) REFERENCES `Employee`(`id`) )');
    
    //MenuItem Table
    db.run('CREATE TABLE `MenuItem` ( ' + 
    '`id` INTEGER NOT NULL, ' + 
    '`name` TEXT NOT NULL, ' + 
    '`description` TEXT, ' +
    'inventory INTEGER NOT NULL, ' +
    '`price` INTEGER NOT NULL, ' +
    '`menu_id` INTEGER NOT NULL, ' +
    'PRIMARY KEY(`id`), ' +
    'FOREIGN KEY(`menu_id`) REFERENCES `Menu`(`id`) )');
});