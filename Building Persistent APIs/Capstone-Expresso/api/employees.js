const express = require('express');
const employeesRouter = express.Router();

const timesheetsRouter = require('./timesheets');

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

employeesRouter.param('employeeId', (req, res, next, employeeId) => {
    db.get(`SELECT * FROM Employee WHERE id = ${employeeId}`, (error, employee) => {
        if(error) next(error);
        else {
            if(!employee){
                return res.sendStatus(404);
            }
            req.employee = employee;
            next();
        }
    });
});

employeesRouter.use('/:employeeId/timesheets', timesheetsRouter);

employeesRouter.get('/', (req, res, next) => {
    const sql = 'SELECT * FROM `Employee` WHERE is_current_employee = 1';
    db.all(sql, (error, employees) => {
        if(error) next(error);
        else {
            res.status(200).json({employees: employees});
        }
    });
});

employeesRouter.post('/', (req, res, next) => {
    let employeesObject = req.body.employee;
    let name = employeesObject.name;
    let position = employeesObject.position;
    let wage = employeesObject.wage;
    if(!name || !position || !wage)
        return res.sendStatus(400);
    const insertSQL = 'INSERT INTO `Employee` (name, position, wage) ' +
    'VALUES ($name, $position, $wage)';
    const values = {
        $name: name,
        $position: position,
        $wage: wage
    };
    db.run(insertSQL, values, function(error) {
        if(error) next(error);
        else {
            db.get(`SELECT * FROM Employee WHERE id = ${this.lastID}`, (error, newEmployee) => {
                if(error) next(error);
                else {
                    res.status(201).json({employee: newEmployee});
                }
            });
        }
    });
});

employeesRouter.get('/:employeeId', (req, res, next) => {
    res.json({employee: req.employee});
});

employeesRouter.put('/:employeeId', (req, res, next) => {
    let employeesObject = req.body.employee;
    let name = employeesObject.name;
    let position = employeesObject.position;
    let wage = employeesObject.wage;
    let isCurrentEmployee = employeesObject.isCurrentEmployee === 0?0:1;
    if(!name || !position || !wage)
        return res.sendStatus(400);
    const updateSQL = 'UPDATE Employee SET name = $name, position = $position, wage = $wage, is_current_employee = $isCurrentEmployee WHERE Employee.id = $employeeId';
    const values = {
        $name: name,
        $position: position,
        $wage: wage,
        $isCurrentEmployee: isCurrentEmployee,
        $employeeId: req.params.employeeId
    };
    db.run(updateSQL, values, (error) => {
        if(error) next(error);
        else {
            db.get(`SELECT * FROM Employee WHERE id = ${req.params.employeeId}`, (error, updatedEmployee) => {
                if(error) next(error);
                else {
                    res.status(200).json({employee: updatedEmployee});
                }
            });
        }
    });
});

employeesRouter.delete('/:employeeId', (req, res, next) => {
    let sql = `UPDATE Employee SET is_current_employee = 0 WHERE Employee.id = ${req.params.employeeId}`;
    db.run(sql, function(error) {
        if(error) next(error);
        else {
            db.get(`SELECT * FROM Employee WHERE id = ${req.params.employeeId}`, (error, unEmployee) => {
                if(error) next(error);
                else {
                    res.status(200).json({employee: unEmployee});
                }
            });
        }
    })
})

module.exports = employeesRouter;