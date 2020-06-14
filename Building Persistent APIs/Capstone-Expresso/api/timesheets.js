const express = require('express');
const timesheetsRouter = express.Router({mergeParams: true});

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

timesheetsRouter.param('employeeId', (req, res, next, employeeId) => {
    db.get(`SELECT * FROM Employee WHERE id = ${employeeId}`, (error, employee) => {
        if(error) next(error);
        else {
            if(!employee) return res.sendStatus(404);
            next();
        }
    });      
});

timesheetsRouter.param('timesheetId', (req, res, next, timesheetId) => {
    db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${timesheetId}`, (error, timesheet) => {
        if(error) next(error);
        else {
            if(!timesheet) return res.sendStatus(404);
            next();
        }
    })
})

timesheetsRouter.get('/', (req, res, next) => {
    db.all(`SELECT * FROM Timesheet WHERE Timesheet.employee_id = ${req.params.employeeId}`,(error, timesheets) => {
        if(error) next(error);
        else {
            res.status(200).json({timesheets: timesheets});
        }
    });    
});

timesheetsRouter.post('/', (req, res, next) => {
    let timesheetObject = req.body.timesheet;
    let hours = timesheetObject.hours, rate = timesheetObject.rate, date = timesheetObject.date;
    if(!hours || !rate || !date)
        return res.sendStatus(400);
    const sql = 'INSERT INTO Timesheet (hours, rate, date, employee_id) VALUES ($hours, $rate, $date, $employeeId)';
    const values = {
        $hours: hours,
        $rate: rate,
        $date: date,
        $employeeId: req.params.employeeId
    };
    db.run(sql, values, function(error) {
        if(error) next(error);
        else {
            db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${this.lastID}`, (error, timesheet) => {
                if(error) next(error);
                else {
                    res.status(201).json({timesheet: timesheet})
                }
            });
        }
    });
});

timesheetsRouter.put('/:timesheetId', (req, res, next) => {
    let timesheetObject = req.body.timesheet;
    let hours = timesheetObject.hours, rate = timesheetObject.rate, date = timesheetObject.date;
    if(!hours || !rate || !date)
        return res.sendStatus(400);
    const sql = 'UPDATE Timesheet SET hours = $hours, rate = $rate, date = $date, employee_id = $employeeId WHERE Timesheet.id = $timesheetId';
    const values = {
        $hours: hours,
        $rate: rate,
        $date: date,
        $employeeId: req.params.employeeId,
        $timesheetId: req.params.timesheetId
    };
    db.run(sql, values, (error) => {
        if(error) next(error);
        else {
            db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${req.params.timesheetId}`, (error, updatedTimesheet) => {
                if(error) next(error);
                else {
                    res.status(200).json({timesheet: updatedTimesheet});
                }
            });
        }
    });
});

timesheetsRouter.delete('/:timesheetId', (req, res, next) => {
    db.run(`DELETE FROM Timesheet where Timesheet.id = ${req.params.timesheetId}`, (error) => {
        if(error) next(error);
        else {
            res.sendStatus(204);
        }
    });
});

module.exports = timesheetsRouter;