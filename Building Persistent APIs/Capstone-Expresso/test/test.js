process.env.PORT = 8081;
process.env.TEST_DATABASE = './test/test.sqlite';

const expect = require('chai').expect;
const request = require('supertest');
const sqlite3 = require('sqlite3');

const app = require('../server.js');
const seed = require('./seed.js');

const prodDb = new sqlite3.Database('./database.sqlite');
const testDb = new sqlite3.Database(process.env.TEST_DATABASE);

describe('Employee Table', function() {
  it('should exist', function(done) {
    prodDb.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Employee'", (error, table) => {
      if (error || !table) {
        done(new Error(error || 'Employee table not found'));
      }
      if (table) {
        done();
      }
    });
  });

  it('should have name, position, wage, and is_current_employee columns with appropriate data types', function(done) {
    prodDb.run("INSERT INTO Employee (name, position, wage, is_current_employee) VALUES ('Employee Name', 'Employee', 10.5, 1)", function(error) {
      if (error) {
        done(new Error(error));
      } else {
        prodDb.run(`DELETE FROM Employee WHERE Employee.id = ${this.lastID}`, () => {
          expect(this.lastID).to.exist;
          done();
        });
      }
    });
  });

  it('should have a required name column', function(done) {
    prodDb.run("INSERT INTO Employee (position, wage, is_current_employee) VALUES ('Employee', 10.5, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Employee WHERE Employee.id = ${this.lastID}`, () => {
          done(new Error('Employee without name was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required position column', function(done) {
    prodDb.run("INSERT INTO Employee (name, wage, is_current_employee) VALUES ('Employee Name', 10.5, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Employee WHERE Employee.id = ${this.lastID}`, () => {
          done(new Error('Employee without position was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required wage column', function(done) {
    prodDb.run("INSERT INTO Employee (name, position, is_current_employee) VALUES ('Employee Name', 'Employee', 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Employee WHERE Employee.id = ${this.lastID}`, () => {
          done(new Error('Employee without position was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('is_current_employee should default to 1', function(done) {
    prodDb.run("INSERT INTO Employee (name, position, wage) VALUES ('Employee Name', 'Employee', 10.5)", function(error) {
      if (error) {
        done(new Error(error));
      } else {
        const employeeId = this.lastID;
        prodDb.get(`SELECT * FROM Employee WHERE Employee.id = ${employeeId}`, (error, employee) => {
          prodDb.run(`DELETE FROM Employee WHERE Employee.id = ${employeeId}`, () => {
            expect(employee.is_current_employee).to.equal(1);
            done();
          });
        });
      }
    });
  });
});

describe('Timesheet Table', function() {
  it('should exist', function(done) {
    prodDb.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Timesheet'", (error, table) => {
      if (error || !table) {
        done(new Error(error || 'Timesheet table not found'));
      }
      if (table) {
        done();
      }
    });
  });

  it('should have hours, rate, date, and employee_id with appropriate data types', function(done) {
    prodDb.run("INSERT INTO Timesheet (hours, rate, date, employee_id) VALUES (10, 2.5, 1506112351471, 1)", function(error) {
      if (error) {
        done(new Error(error));
      } else {
        prodDb.run(`DELETE FROM Timesheet WHERE Timesheet.id = ${this.lastID}`, () => {
          expect(this.lastID).to.exist;
          done();
        });
      }
    });
  });

  it('should have a required hours column', function(done) {
    prodDb.run("INSERT INTO Timesheet (rate, date, employee_id) VALUES (2.5, 1506112351471, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Timesheet WHERE Timesheet.id = ${this.lastID}`, () => {
          done(new Error('Timesheet without hours was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required rate column', function(done) {
    prodDb.run("INSERT INTO Timesheet (hours, date, employee_id) VALUES (10, 1506112351471, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Timesheet WHERE Timesheet.id = ${this.lastID}`, () => {
          done(new Error('Timesheet without rate was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required date column', function(done) {
    prodDb.run("INSERT INTO Timesheet (hours, rate, employee_id) VALUES (10, 2.5, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Timesheet WHERE Timesheet.id = ${this.lastID}`, () => {
          done(new Error('Timesheet without date was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required employee_id column', function(done) {
    prodDb.run("INSERT INTO Timesheet (hours, rate, date) VALUES (10, 2.5, 1506112351471)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Timesheet WHERE Timesheet.id = ${this.lastID}`, () => {
          done(new Error('Timesheet without employee_id was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });
});

describe('Menu Table', function() {
  it('should exist', function(done) {
    prodDb.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Menu'", (error, table) => {
      if (error || !table) {
        done(new Error(error || 'Menu table not found'));
      }
      if (table) {
        done();
      }
    });
  });

  it('should have id and title columns with appropriate data types', function(done) {
    prodDb.run("INSERT INTO Menu (title) VALUES ('Menu Title')", function(error) {
      if (error) {
        done(new Error(error));
      } else {
        prodDb.run(`DELETE FROM Menu WHERE Menu.id = ${this.lastID}`, () => {
          expect(this.lastID).to.exist;
          done();
        });
      }
    });
  });

  it('should have a required title column', function(done) {
    prodDb.run("INSERT INTO Menu (title) VALUES (NULL)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Menu WHERE Menu.id = ${this.lastID}`, () => {
          done(new Error('Menu without title was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });
});

describe('MenuItem Table', function() {
  it('should exist', function(done) {
    prodDb.get("SELECT name FROM sqlite_master WHERE type='table' AND name='MenuItem'", (error, table) => {
      if (error || !table) {
        done(new Error(error || 'MenuItem table not found'));
      }
      if (table) {
        done();
      }
    });
  });

  it('should have id, name, description, inventory, price, and menu_id columns with appropriate data types', function(done) {
    prodDb.run("INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ('MenuItem Name', 'MenuItem Description', 10, 1.5, 1)", function(error) {
      if (error) {
        done(new Error(error));
      } else {
        prodDb.run(`DELETE FROM MenuItem WHERE MenuItem.id = ${this.lastID}`, () => {
          expect(this.lastID).to.exist;
          done();
        });
      }
    });
  });

  it('should have a required name column', function(done) {
    prodDb.run("INSERT INTO MenuItem (description, inventory, price, menu_id) VALUES ('MenuItem Description', 10, 1.5, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM MenuItem WHERE MenuItem.id = ${this.lastID}`, () => {
          done(new Error('MenuItem without name was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required inventory column', function(done) {
    prodDb.run("INSERT INTO MenuItem (name, description, price, menu_id) VALUES ('MenuItem Name', 'MenuItem Description', 1.5, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM MenuItem WHERE MenuItem.id = ${this.lastID}`, () => {
          done(new Error('MenuItem without inventory was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required price column', function(done) {
    prodDb.run("INSERT INTO MenuItem (name, description, inventory, menu_id) VALUES ('MenuItem Name', 'MenuItem Description', 10, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM MenuItem WHERE MenuItem.id = ${this.lastID}`, () => {
          done(new Error('MenuItem without price was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required menu_id column', function(done) {
    prodDb.run("INSERT INTO MenuItem (name, description, inventory, price) VALUES ('MenuItem Name', 'MenuItem Description', 10, 1.5)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM MenuItem WHERE MenuItem.id = ${this.lastID}`, () => {
          done(new Error('MenuItem without menu_id was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });
});

describe('GET /api/employees', function() {
  before(function(done) {
    seed.seedEmployeeDatabase(done);
  });

  it('should return all currently-employed employees', function() {
    return request(app)
        .get('/api/employees')
        .then(function(response) {
          const employees = response.body.employees;
          expect(employees.length).to.equal(2);
          expect(employees.find(employee => employee.id === 1)).to.exist;
          expect(employees.find(employee => employee.id === 2)).to.exist;
          expect(employees.find(employee => employee.id === 3)).to.not.exist;
        });
  });

  it('should return a status code of 200', function() {
    return request(app)
        .get('/api/employees')
        .expect(200);
  });
});

describe('GET /api/employees/:id', function() {
  before(function(done) {
    seed.seedEmployeeDatabase(done);
  });

  it('should return the employee with the given ID', function() {
    return request(app)
        .get('/api/employees/2')
        .then(function(response) {
          const employee = response.body.employee;
          expect(employee.id).to.equal(2);
          expect(employee.name).to.equal('Employee 2');
          expect(employee.position).to.equal('Employee');
          expect(employee.wage).to.equal(15);
          expect(employee.is_current_employee).to.equal(1);
        });
  });

  it('should return a 200 status code for valid IDs', function() {
    return request(app)
        .get('/api/employees/2')
        .expect(200);
  });

  it('should return a 404 status code for invalid IDs', function() {
    return request(app)
        .get('/api/employees/999')
        .expect(404);
  });
});

describe('POST /api/employees', function() {
  let newEmployee;

  beforeEach(function(done) {
    seed.seedEmployeeDatabase(done);

    newEmployee = {
      name: 'New Employee',
      position: 'Position',
      wage: 30
    };
  });

  it('should create a valid employee', function() {
    return request(app)
        .post('/api/employees/')
        .send({employee: newEmployee})
        .then(function() {
          testDb.all('SELECT * FROM employee', function(error, result) {
            const employee = result.find(employee => employee.name === newEmployee.name);
            expect(employee).to.exist;
            expect(employee.id).to.exist;
            expect(employee.position).to.equal(newEmployee.position);
            expect(employee.wage).to.equal(newEmployee.wage);
          });
        });
  });

  it('should return a 201 status code after employee creation', function() {
    return request(app)
        .post('/api/employees/')
        .send({employee: newEmployee})
        .expect(201);
  });

  it('should return the newly-created employee after employee creation', function() {
    return request(app)
        .post('/api/employees/')
        .send({employee: newEmployee})
        .then(function(response) {
          const employee = response.body.employee;
          expect(employee).to.exist;
          expect(employee.id).to.exist;
          expect(employee.position).to.equal(newEmployee.position);
          expect(employee.wage).to.equal(newEmployee.wage);
        });
  });

  it('should set new employees as currently-employed by default', function() {
    return request(app)
        .post('/api/employees/')
        .send({employee: newEmployee})
        .then(function(response) {
          const employee = response.body.employee;
          expect(employee.is_current_employee).to.equal(1);
        });
  });

  it('should return a 400 status code for invalid employees', function() {
    newEmployee = {
      position: 'Position',
      wage: 30
    };

    return request(app)
        .post('/api/employees/')
        .send({employee: newEmployee})
        .expect(400);
  });
});


describe('PUT /api/employees/:id', function() {
  let updatedEmployee;

  beforeEach(function(done) {
    seed.seedEmployeeDatabase(done);

    updatedEmployee = {
      name: 'Updated Employee',
      position: 'Updated Position',
      wage: 35
    };
  });

  it('should update the employee with the given ID', function(done) {
    request(app)
        .put('/api/employees/1')
        .send({employee: updatedEmployee})
        .then(function() {
          testDb.get('SELECT * FROM employee WHERE employee.id = 1', function(error, employee) {
            if (error) {
              throw new Error(error);
            }
            expect(employee).to.exist;
            expect(employee.id).to.equal(1);
            expect(employee.name).to.equal(updatedEmployee.name);
            expect(employee.position).to.equal(updatedEmployee.position);
            expect(employee.wage).to.equal(updatedEmployee.wage);
            done();
          });
        }).catch(done);
  });

  it('should return a 200 status code after employee update', function() {
    return request(app)
        .put('/api/employees/1')
        .send({employee: updatedEmployee})
        .expect(200);
  });

  it('should return the updated employee after employee update', function() {
    return request(app)
        .put('/api/employees/1')
        .send({employee: updatedEmployee})
        .then(function(response) {
          const employee = response.body.employee;
          expect(employee).to.exist;
          expect(employee.id).to.equal(1);
          expect(employee.name).to.equal(updatedEmployee.name);
          expect(employee.position).to.equal(updatedEmployee.position);
          expect(employee.wage).to.equal(updatedEmployee.wage);
        });
  });

  it('should return a 400 status code for invalid employee updates', function() {
    updatedEmployee = {
      position: 'Updated Position',
      wage: 35
    };

    return request(app)
        .put('/api/employees/1')
        .send({employee: updatedEmployee})
        .expect(400);
  });
});

describe('DELETE /api/employees/:id', function() {
  beforeEach(function(done) {
    seed.seedEmployeeDatabase(done);
  });

  it('should set the employee with the given ID as not currently-employed', function(done) {
    request(app)
        .del('/api/employees/1')
        .then(function() {
          testDb.get('SELECT * FROM employee WHERE employee.id = 1', function(error, employee) {
            if (error) {
              throw new Error(error);
            }
            expect(employee).to.exist;
            expect(employee.is_current_employee).to.equal(0);
            done();
          });
        }).catch(done);
  });

  it('should return a 200 status code after employee delete', function() {
    return request(app)
        .del('/api/employees/1')
        .expect(200);
  });

  it('should return the deleted employee after employee delete', function() {
    return request(app)
        .del('/api/employees/1')
        .then(function(response) {
          const employee = response.body.employee;
          expect(employee.id).to.equal(1);
          expect(employee.is_current_employee).to.equal(0);
        });
  });
});

describe('GET /api/employees/:employeeId/timesheets', function() {
  before(function(done) {
    seed.seedTimesheetDatabase(done);
  });

  it('should return all timesheets of an existing employee', function() {
    return request(app)
        .get('/api/employees/1/timesheets')
        .then(function(response) {
          const timesheets = response.body.timesheets;
          expect(timesheets.length).to.equal(2);
          expect(timesheets.find(timesheet => timesheet.id === 1)).to.exist;
          expect(timesheets.find(timesheet => timesheet.id === 2)).to.exist;
        });
  });

  it('should return an empty array for existing employees with no timesheets', function() {
    return request(app)
        .get('/api/employees/3/timesheets')
        .then(function(response) {
          const timesheets = response.body.timesheets;
          expect(timesheets.length).to.equal(0);
        });
  });

  it('should return a status code of 200 for valid employees', function() {
    return request(app)
        .get('/api/employees/2/timesheets')
        .expect(200);
  });

  it('should return a status code of 404 for invalid employees', function() {
    return request(app)
        .get('/api/employees/999/timesheets')
        .expect(404);
      });
});

describe('POST /api/employees/:employeeId/timesheets', function() {
  let newTimesheet;

  beforeEach(function(done) {
    newTimesheet = {
      hours: 10,
      rate: 3.5,
      date: 100
    };

    seed.seedTimesheetDatabase(done);
  });

  it('should create a valid timesheet', function() {
    return request(app)
        .post('/api/employees/2/timesheets')
        .send({timesheet: newTimesheet})
        .then(function() {
          testDb.all('SELECT * FROM timesheet', function(error, result) {
            const timesheet = result.find(timesheet => timesheet.date === newTimesheet.date);
            expect(timesheet).to.exist;
            expect(timesheet.id).to.exist;
            expect(timesheet.hours).to.equal(newTimesheet.hours);
            expect(timesheet.rate).to.equal(newTimesheet.rate);
            expect(timesheet.date).to.equal(newTimesheet.date);
            expect(timesheet.employee_id).to.equal(2);
          });
        });
  });

  it('should return a 201 status code after timesheet creation', function() {
    return request(app)
        .post('/api/employees/2/timesheets')
        .send({timesheet: newTimesheet})
        .expect(201);
  });

  it('should return the newly-created timesheet after timesheet creation', function() {
    return request(app)
        .post('/api/employees/2/timesheets')
        .send({timesheet: newTimesheet})
        .then(function(response) {
          const timesheet = response.body.timesheet;
          expect(timesheet).to.exist;
          expect(timesheet.id).to.exist;
          expect(timesheet.hours).to.equal(newTimesheet.hours);
          expect(timesheet.rate).to.equal(newTimesheet.rate);
          expect(timesheet.date).to.equal(newTimesheet.date);
          expect(timesheet.employee_id).to.equal(2);
        });
  });

  it('should return a 400 status code for invalid timesheets', function() {
    newTimesheet = {
      rate: 3.5,
      date: 100
    };

    return request(app)
        .post('/api/employees/2/timesheets')
        .send({timesheet: newTimesheet})
        .expect(400);
  });

  it('should return a 404 status code if an employee with the timesheet\'s employee ID doesn\'t exist', function() {
    return request(app)
        .post('/api/employees/100/timesheets')
        .send({timesheet: newTimesheet})
        .expect(404);
  });
});

describe('PUT /api/employees/:employeeId/timesheets/:timesheetId', function() {
  let updatedTimesheet;

  beforeEach(function(done) {
    updatedTimesheet = {
      hours: 20,
      rate: 3.5,
      date: 100
    };

    seed.seedEmployeeDatabase(done);
  });

  it('should update the timesheet with the given ID', function(done) {
    request(app)
        .put('/api/employees/1/timesheets/2')
        .send({timesheet: updatedTimesheet})
        .then(function() {
          testDb.get('SELECT * FROM timesheet WHERE timesheet.id = 2', function(error, timesheet) {
            if (error) {
              throw new Error(error);
            }
            expect(timesheet).to.exist;
            expect(timesheet.id).to.exist;
            expect(timesheet.hours).to.equal(updatedTimesheet.hours);
            expect(timesheet.rate).to.equal(updatedTimesheet.rate);
            expect(timesheet.date).to.equal(updatedTimesheet.date);
            expect(timesheet.employee_id).to.equal(1);
            done()
          });
        }).catch(done);
  });

  it('should return a 200 status code after timesheet update', function() {
    return request(app)
        .put('/api/employees/1/timesheets/2')
        .send({timesheet: updatedTimesheet})
        .expect(200);
  });

  it('should return the updated timesheet after timesheet update', function() {
    return request(app)
        .put('/api/employees/1/timesheets/2')
        .send({timesheet: updatedTimesheet})
        .then(function(response) {
          const timesheet = response.body.timesheet;
          expect(timesheet).to.exist;
          expect(timesheet.id).to.exist;
          expect(timesheet.hours).to.equal(updatedTimesheet.hours);
          expect(timesheet.rate).to.equal(updatedTimesheet.rate);
          expect(timesheet.date).to.equal(updatedTimesheet.date);
          expect(timesheet.employee_id).to.equal(1);
        });
  });

  it('should return a 404 status code for invalid timesheet IDs', function() {
    updatedTimesheet = {
      rate: 3.5,
      date: 100
    };

    return request(app)
        .put('/api/employees/1/timesheets/999')
        .send({timesheet: updatedTimesheet})
        .expect(404);
  });

  it('should return a 400 status code for invalid timesheet updates', function() {
    updatedTimesheet = {
      rate: 3.5,
      date: 100
    };

    return request(app)
        .put('/api/employees/1/timesheets/2')
        .send({timesheet: updatedTimesheet})
        .expect(400);
  });

  it('should return a 404 status code if an employee with the updated employee ID doesn\'t exist', function() {
    updatedTimesheet = {
      hours: 20,
      rate: 3.5,
      date: 100
    };

    return request(app)
        .put('/api/employees/999/timesheets/1')
        .send({timesheet: updatedTimesheet})
        .expect(404);
  });
});

describe('DELETE /api/employees/:employeeId/timesheets/:timesheetId', function() {
  beforeEach(function(done) {
    seed.seedTimesheetDatabase(done);
  });

  it('should remove the timesheet with the specified ID from the database', function(done) {
    request(app)
        .del('/api/employees/2/timesheets/1')
        .then(function() {
          testDb.get('SELECT * FROM timesheet WHERE timesheet.id = 1', function(error, timesheet) {
            if (error) {
              throw new Error(error);
            }
            expect(timesheet).not.to.exist;
            done();
          });
        }).catch(done);
  });

  it('should return a 204 status code after timesheet delete', function() {
    return request(app)
        .del('/api/employees/2/timesheets/1')
        .expect(204);
  });

  it('should return a 404 status code for invalid timesheet IDs', function() {
    return request(app)
        .del('/api/employees/2/timesheets/999')
        .expect(404);
  });
});

describe('GET /api/menus', function() {
  before(function(done) {
    seed.seedMenuDatabase(done);
  });

  it('should return all menus', function() {
    return request(app)
        .get('/api/menus')
        .then(function(response) {
          const menus = response.body.menus;
          expect(menus.length).to.equal(3);
          expect(menus.find(menus => menus.id === 1)).to.exist;
          expect(menus.find(menus => menus.id === 2)).to.exist;
          expect(menus.find(menus => menus.id === 3)).to.exist;
        });
  });

  it('should return a status code of 200', function() {
    return request(app)
        .get('/api/menus')
        .expect(200);
  });
});

describe('GET /api/menus/:id', function() {
  before(function(done) {
    seed.seedMenuDatabase(done);
  });

  it('should return the menus with the given ID', function() {
    return request(app)
        .get('/api/menus/2')
        .then(function(response) {
          const menu = response.body.menu;
          expect(menu.id).to.equal(2);
          expect(menu.title).to.equal('Lunch');
        });
  });

  it('should return a 200 status code for valid IDs', function() {
    return request(app)
        .get('/api/menus/2')
        .expect(200);
  });

  it('should return a 404 status code for invalid IDs', function() {
    return request(app)
        .get('/api/menus/999')
        .expect(404);
  });
});

describe('POST /api/menus', function() {
  let newMenu;

  beforeEach(function(done) {
    newMenu = {
      title: 'New Menu'
    };

    seed.seedMenuDatabase(done);
  });

  it('should create a valid menu', function() {
    return request(app)
        .post('/api/menus/')
        .send({menu: newMenu})
        .then(function() {
          testDb.all('SELECT * FROM Menu', function(error, result) {
            const menu = result.find(menu => menu.title === newMenu.title);
            expect(menu).to.exist;
            expect(menu.id).to.exist;
            expect(menu.title).to.equal(newMenu.title);
          });
        });
  });

  it('should return a 201 status code after menu creation', function() {
    return request(app)
        .post('/api/menus/')
        .send({menu: newMenu})
        .expect(201);
  });

  it('should return the newly-created menu after menu creation', function() {
    return request(app)
        .post('/api/menus/')
        .send({menu: newMenu})
        .then(function(response) {
          const menu = response.body.menu;
          expect(menu).to.exist;
          expect(menu.id).to.exist;
          expect(menu.title).to.equal(newMenu.title);
        });
  });

  it('should return a 400 status code for invalid menus', function() {
    return request(app)
        .post('/api/menus/')
        .send({menu: {}})
        .expect(400);
  });
});

describe('PUT /api/menus/:id', function() {
  let updatedMenu;

  beforeEach(function(done) {
    updatedMenu = {
      title: 'Updated Menu'
    };

    seed.seedMenuDatabase(done);
  });

  it('should update the menu with the given ID', function(done) {
    request(app)
        .put('/api/menus/2')
        .send({menu: updatedMenu})
        .then(function() {
          testDb.get('SELECT * FROM Menu WHERE Menu.id = 2', function(error, menu) {
            if (error) {
              throw new Error(error);
            }
            expect(menu).to.exist;
            expect(menu.id).to.equal(2);
            expect(menu.title).to.equal(updatedMenu.title);
            done();
          });
        }).catch(done);
  });

  it('should return a 200 status code after menu update', function() {
    return request(app)
        .put('/api/menus/2')
        .send({menu: updatedMenu})
        .expect(200);
  });

  it('should return the updated menu after menu update', function() {
    return request(app)
        .put('/api/menus/2')
        .send({menu: updatedMenu})
        .then(function(response) {
          const menu = response.body.menu;
          expect(menu).to.exist;
          expect(menu.id).to.equal(2);
          expect(menu.title).to.equal(updatedMenu.title);
        });
  });

  it('should return a 400 status code for invalid menu updates', function() {
    return request(app)
        .put('/api/menus/1')
        .send({menu: {}})
        .expect(400);
  });
});

describe('DELETE /api/menus/:id', function() {
  beforeEach(function(done) {
    seed.seedMenuDatabase(() => seed.seedMenuItemDatabase(done));
  });

  it('should remove the menu with the specified ID from the database if that menu has no related menu items', function(done) {
    request(app)
        .del('/api/menus/3')
        .then(function() {
          testDb.get('SELECT * FROM Menu WHERE Menu.id = 3', function(error, menu) {
            if (error) {
              throw new Error(error);
            }
            expect(menu).not.to.exist;
            done();
          });
        }).catch(done);
  });

  it('should return a 204 status code after menu delete', function() {
    return request(app)
        .del('/api/menus/3')
        .expect(204);
  });

  it('should not delete menus with existing related menu items', function(done) {
    request(app)
        .del('/api/menus/2')
        .then(function() {
          testDb.get('SELECT * FROM Menu WHERE Menu.id = 2', function(error, menu) {
            if (error) {
              throw new Error(error);
            }
            expect(menu).to.exist;
            done();
          });
        }).catch(done);
  });

  it('should return a 400 status code if deleted menu has existing related menu items', function() {
    return request(app)
        .del('/api/menus/2')
        .expect(400);
  });
});

describe('GET /api/menus/:menuId/menu-items', function() {
  before(function(done) {
    seed.seedMenuItemDatabase(done);
  });

  it('should return all menu items of an existing menu', function() {
    return request(app)
        .get('/api/menus/1/menu-items')
        .then(function(response) {
          const menuItems = response.body.menuItems;
          expect(menuItems.length).to.equal(2);
          expect(menuItems.find(menuItem => menuItem.id === 1)).to.exist;
          expect(menuItems.find(menuItem => menuItem.id === 2)).to.exist;
        });
  });

  it('should return an empty array for existing menus with no menu items', function() {
    return request(app)
        .get('/api/menus/3/menu-items')
        .then(function(response) {
          const menuItems = response.body.menuItems;
          expect(menuItems.length).to.equal(0);
        });
  });

  it('should return a status code of 200 for valid menus', function() {
    return request(app)
        .get('/api/menus/2/menu-items')
        .expect(200);
  });

  it('should return a status code of 404 for invalid menus', function() {
    return request(app)
        .get('/api/menus/999/menu-items')
        .expect(404);
      });
});

describe('POST /api/menus/:menuId/menu-items', function() {
  let newMenuItem;

  beforeEach(function(done) {
    newMenuItem = {
      name: 'New Menu Item',
      description: 'New Description',
      inventory: 20,
      price: 1.5
    };

    seed.seedMenuItemDatabase(done);
  });

  it('should create a valid menuItem', function() {
    return request(app)
        .post('/api/menus/2/menu-items')
        .send({menuItem: newMenuItem})
        .then(function() {
          testDb.all('SELECT * FROM menuItem', function(error, result) {
            const menuItem = result.find(menuItem => menuItem.name === newMenuItem.name);
            expect(menuItem).to.exist;
            expect(menuItem.id).to.exist;
            expect(menuItem.name).to.equal(newMenuItem.name);
            expect(menuItem.description).to.equal(newMenuItem.description);
            expect(menuItem.inventory).to.equal(newMenuItem.inventory);
            expect(menuItem.price).to.equal(newMenuItem.price);
            expect(menuItem.menu_id).to.equal(2);
          });
        });
  });

  it('should return a 201 status code after menu item creation', function() {
    return request(app)
        .post('/api/menus/2/menu-items')
        .send({menuItem: newMenuItem})
        .expect(201);
  });

  it('should return the newly-created menu item after menu item creation', function() {
    return request(app)
        .post('/api/menus/2/menu-items')
        .send({menuItem: newMenuItem})
        .then(function(response) {
          const menuItem = response.body.menuItem;
          expect(menuItem).to.exist;
          expect(menuItem.id).to.exist;
          expect(menuItem.name).to.equal(newMenuItem.name);
          expect(menuItem.description).to.equal(newMenuItem.description);
          expect(menuItem.inventory).to.equal(newMenuItem.inventory);
          expect(menuItem.price).to.equal(newMenuItem.price);
          expect(menuItem.menu_id).to.equal(2);
        });
  });

  it('should return a 400 status code for invalid menu items', function() {
    newMenuItem = {
      description: 'New Description',
      inventory: 20,
      price: 1.5
    };

    return request(app)
        .post('/api/menus/2/menu-items')
        .send({menuItem: newMenuItem})
        .expect(400);
  });
});

describe('PUT /api/menus/:menuId/menu-items/:menuItemId', function() {
  let updatedMenuItem;

  beforeEach(function(done) {
    updatedMenuItem = {
      name: 'Updated Menu Item',
      description: 'Updated Description',
      inventory: 20,
      price: 1.5
    };

    seed.seedMenuItemDatabase(done);
  });

  it('should update the menu item with the given ID', function(done) {
    request(app)
        .put('/api/menus/1/menu-items/2')
        .send({menuItem: updatedMenuItem})
        .then(function() {
          testDb.get('SELECT * FROM MenuItem WHERE MenuItem.id = 2', function(error, menuItem) {
            if (error) {
              throw new Error(error);
            }
            expect(menuItem).to.exist;
            expect(menuItem.id).to.equal(2);
            expect(menuItem.name).to.equal(updatedMenuItem.name);
            expect(menuItem.description).to.equal(updatedMenuItem.description);
            expect(menuItem.inventory).to.equal(updatedMenuItem.inventory);
            expect(menuItem.price).to.equal(updatedMenuItem.price);
            done();
          });
        }).catch(done);
  });

  it('should return a 200 status code after menuItem update', function() {
    return request(app)
        .put('/api/menus/1/menu-items/2')
        .send({menuItem: updatedMenuItem})
        .expect(200);
  });

  it('should return the updated menu item after menu item update', function() {
    return request(app)
        .put('/api/menus/1/menu-items/2')
        .send({menuItem: updatedMenuItem})
        .then(function(response) {
          const menuItem = response.body.menuItem;
          expect(menuItem).to.exist;
          expect(menuItem.id).to.equal(2);
          expect(menuItem.name).to.equal(updatedMenuItem.name);
          expect(menuItem.description).to.equal(updatedMenuItem.description);
          expect(menuItem.inventory).to.equal(updatedMenuItem.inventory);
          expect(menuItem.price).to.equal(updatedMenuItem.price);
        });
  });

  it('should return a 404 status code for invalid menu item IDs', function() {
    updatedMenuItem = {
      description: 'Updated Description',
      inventory: 20,
      price: 1.5
    };

    return request(app)
        .put('/api/menus/1/menu-items/999')
        .send({menuItem: updatedMenuItem})
        .expect(404);
  });

  it('should return a 400 status code for invalid menu item updates', function() {
    updatedMenuItem = {
      description: 'Updated Description',
      inventory: 20,
      price: 1.5
    };

    return request(app)
        .put('/api/menus/1/menu-items/2')
        .send({menuItem: updatedMenuItem})
        .expect(400);
  });
});

describe('DELETE /api/menus/:menuId/menu-items/:menuItemId', function() {
  beforeEach(function(done) {
    seed.seedMenuItemDatabase(done);
  });

  it('should remove the menu item with the specified ID from the database', function(done) {
    request(app)
        .del('/api/menus/1/menu-items/2')
        .then(function() {
          testDb.get('SELECT * FROM MenuItem WHERE MenuItem.id = 2', function(error, menuItem) {
            if (error) {
              throw new Error(error);
            }
            expect(menuItem).not.to.exist;
            done();
          });
        }).catch(done);
  });

  it('should return a 204 status code after menu item delete', function() {
    return request(app)
        .del('/api/menus/1/menu-items/2')
        .expect(204);
  });

  it('should return a 404 status code for invalid menu item IDs', function() {
    return request(app)
        .del('/api/menus/1/menu-items/999')
        .expect(404);
  });
});