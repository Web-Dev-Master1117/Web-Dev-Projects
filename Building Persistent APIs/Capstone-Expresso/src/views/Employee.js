import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

import Expresso from '../utils/Expresso';

class Employee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employee: null,
      timesheets: []
    };

    this.updateEmployeeName = this.updateEmployeeName.bind(this);
    this.updateEmployeePosition = this.updateEmployeePosition.bind(this);
    this.updateEmployeeWage = this.updateEmployeeWage.bind(this);
    this.updateTimesheetHours = this.updateTimesheetHours.bind(this);
    this.updateTimesheetRate = this.updateTimesheetRate.bind(this);
    this.saveEmployee = this.saveEmployee.bind(this);
    this.cancelEmployeeEdit = this.cancelEmployeeEdit.bind(this);
    this.deleteEmployee = this.deleteEmployee.bind(this);
    this.restoreEmployee = this.restoreEmployee.bind(this);
    this.addTimesheet = this.addTimesheet.bind(this);
    this.saveTimesheet = this.saveTimesheet.bind(this);
    this.cancelTimesheetEdit = this.cancelTimesheetEdit.bind(this);
    this.deleteTimesheet = this.deleteTimesheet.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params.id === 'new') {
      const newEmployee = {
        name: '',
        position: '',
        wage: 0,
        isCurrentEmployee: 1
      };

      this.setState({
        employee: newEmployee,
        savedEmployee: JSON.parse(JSON.stringify(newEmployee))
      });
      return;
    }

    Expresso.getEmployee(this.props.match.params.id).then(employee => {
      if (employee) {
        this.setState({
          employee: employee,
          savedEmployee: JSON.parse(JSON.stringify(employee))
        });
      }
    });

    Expresso.getTimesheets(this.props.match.params.id).then(timesheets => {
      const sortedTimesheets = this.sortTimesheets(timesheets);
      this.setState({
        timesheets: sortedTimesheets,
        savedTimesheets: JSON.parse(JSON.stringify(sortedTimesheets))
      });
    });
  }

  sortTimesheets(timesheets) {
    return timesheets.sort((timesheet1, timesheet2) => {
      if (timesheet1.date > timesheet2.date) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  employeeHasChanges() {
    const employee = this.state.employee;
    const savedEmployee = this.state.savedEmployee;
    if (!savedEmployee) {
      return false;
    }

    if (employee.name === savedEmployee.name &&
        employee.position === savedEmployee.position &&
        employee.wage === savedEmployee.wage) {
      return false;
    }

    return true;
  }

  employeeHasAllRequiredFields() {
    return !!this.state.employee.name && !!this.state.employee.position &&
        !!this.state.employee.wage;
  }

  timesheetHasChanges(timesheet, timesheetIndex) {
    const savedTimesheet = this.state.savedTimesheets[timesheetIndex];

    if (!timesheet.id) {
      return true;
    }

    if (!savedTimesheet) {
      return false;
    }

    if (timesheet.hours === savedTimesheet.hours &&
        timesheet.rate === savedTimesheet.rate) {
      return false;
    }

    return true;
  }

  timesheetHasAllRequiredFields(timesheet) {
    return !!timesheet.hours && !!timesheet.rate;
  }

  updateEmployeeName(event) {
    const employee = JSON.parse(JSON.stringify(this.state.employee));
    employee.name = event.target.value;
    this.setState({employee: employee});
  }

  updateEmployeePosition(event) {
    const employee = JSON.parse(JSON.stringify(this.state.employee));
    employee.position = event.target.value;
    this.setState({employee: employee});
  }

  updateEmployeeWage(event) {
    const employee = JSON.parse(JSON.stringify(this.state.employee));
    employee.wage = event.target.value;
    this.setState({employee: employee});
  }

  updateTimesheetHours(event, timesheetIndex) {
    const timesheets = JSON.parse(JSON.stringify(this.state.timesheets));
    timesheets[timesheetIndex].hours = event.target.value;
    this.setState({timesheets: timesheets});
  }

  updateTimesheetRate(event, timesheetIndex) {
    const timesheets = JSON.parse(JSON.stringify(this.state.timesheets));
    timesheets[timesheetIndex].rate = event.target.value;
    this.setState({timesheets: timesheets});
  }

  saveEmployee() {
    if (this.state.employee.id) {
      Expresso.updateEmployee(this.state.employee).then(employee => {
        this.setState({
          employee: employee,
          savedEmployee: JSON.parse(JSON.stringify(employee))
        });
      });
    } else {
      Expresso.createEmployee(this.state.employee).then(employee => {
        this.props.history.push(`/employees/${employee.id}`);
        this.setState({
          employee: employee,
          savedEmployee: JSON.parse(JSON.stringify(employee))
        });
        Expresso.getTimesheets(this.props.match.params.id).then(timesheets => {
          const sortedTimesheets = this.sortTimesheets(timesheets);
          this.setState({
            timesheets: sortedTimesheets,
            savedTimesheets: JSON.parse(JSON.stringify(sortedTimesheets))
          });
        });
      });
    }
  }

  cancelEmployeeEdit() {
    this.setState({
      employee: JSON.parse(JSON.stringify(this.state.savedEmployee))
    });
  }

  deleteEmployee() {
    Expresso.deleteEmployee(this.state.employee.id).then(() => {
      this.props.history.push('/');
    });
  }

  restoreEmployee() {
    Expresso.restoreEmployee(this.state.savedEmployee).then(employee => {
      const stateEmployee = JSON.parse(JSON.stringify(this.state.employee));
      stateEmployee.isCurrentEmployee = employee.isCurrentEmployee;
      this.setState({
        employee: stateEmployee,
        savedEmployee: employee
      });
    });
  }

  addTimesheet() {
    const newtimesheet = {
      hours: 0,
      rate: this.state.employee.wage,
      date: Date.now(),
      employeeId: this.state.employee.id
    };

    const timesheets = JSON.parse(JSON.stringify(this.state.timesheets));
    timesheets.unshift(newtimesheet);
    this.setState({timesheets: timesheets});
  }

  saveTimesheet(timesheetIndex) {
    if (this.state.timesheets[timesheetIndex].id) {
      Expresso.updateTimesheet(this.state.timesheets[timesheetIndex], this.state.employee.id)
        .then(timesheet => {
          let timesheets = JSON.parse(JSON.stringify(this.state.timesheets));
          timesheets.splice(timesheetIndex, 1, timesheet);
          let savedTimesheets = JSON.parse(JSON.stringify(this.state.savedTimesheets));
          savedTimesheets.splice(timesheetIndex, 1, timesheet);
          timesheets = this.sortTimesheets(timesheets);
          savedTimesheets = this.sortTimesheets(savedTimesheets);
          this.setState({
            timesheets: timesheets,
            savedTimesheets: JSON.parse(JSON.stringify(timesheets))
          });
        });
    } else {
      Expresso.createTimesheet(this.state.timesheets[timesheetIndex], this.state.employee.id)
        .then(timesheet => {
          let timesheets = JSON.parse(JSON.stringify(this.state.timesheets));
          timesheets.splice(timesheetIndex, 1, timesheet);
          let savedTimesheets = JSON.parse(JSON.stringify(this.state.savedTimesheets));
          savedTimesheets.splice(timesheetIndex, 1, timesheet);
          timesheets = this.sortTimesheets(timesheets);
          savedTimesheets = this.sortTimesheets(savedTimesheets);
          this.setState({
            timesheets: timesheets,
            savedTimesheets: savedTimesheets
          });
      });
    }
  }

  cancelTimesheetEdit(timesheetIndex) {
    const timesheets = JSON.parse(JSON.stringify(this.state.timesheets));
    const timesheet = timesheets[timesheetIndex];
    if (!timesheet.id) {
      this.deleteTimesheet(timesheet, timesheetIndex);
    } else {
      timesheets[timesheetIndex] = JSON.parse(JSON.stringify(this.state.savedTimesheets[timesheetIndex]));
      this.setState({
        timesheets: timesheets
      });
    }
  }

  deleteTimesheet(timesheet, timesheetIndex) {
    Expresso.deleteTimesheet(timesheet.id, this.state.employee.id).then(() => {
      const timesheets = JSON.parse(JSON.stringify(this.state.timesheets));
      timesheets.splice(timesheetIndex, 1);
      const savedTimesheets = JSON.parse(JSON.stringify(this.state.savedTimesheets));
      savedTimesheets.splice(timesheetIndex, 1);
      this.setState({
        timesheets: timesheets,
        savedTimesheets: savedTimesheets
      });
    });
  }

  renderEmployment() {
    if (!this.state.employee.isCurrentEmployee) {
      return <h3 className="strong">Retired</h3>;
    }
    return '';
  }

  renderEmployeeButtons() {
    const employee = this.state.employee;
    let saveButton, cancelButton, deleteButton;

    if (this.employeeHasChanges() && this.employeeHasAllRequiredFields()) {
      saveButton =<a className={'button'} onClick={this.saveEmployee}>Save</a>;
    } else {
      saveButton = <a className='button inactive'>Save</a>;
    }

    if (this.employeeHasChanges()) {
      cancelButton =<a className={'button'} onClick={this.cancelEmployeeEdit}>Cancel</a>
    } else {
      cancelButton = <a className='button inactive'>Cancel</a>;
    }

    if (employee.isCurrentEmployee && employee.id) {
      deleteButton = <a className='button delete' onClick={this.deleteEmployee}>Delete</a>;
    } else if (employee.id) {
      deleteButton = <a className='button' onClick={this.restoreEmployee}>Restore</a>
    } else {
      deleteButton = '';
    }

    return (
      <div className="buttons">
        {saveButton}
        {cancelButton}
        {deleteButton}
      </div>
    )
  }

  renderTimesheetButtons(timesheet, timesheetIndex) {
    let saveButton, cancelButton, deleteButton;

    if (this.timesheetHasChanges(timesheet, timesheetIndex) && this.timesheetHasAllRequiredFields(timesheet)) {
      saveButton =<a className={'button'} onClick={this.saveTimesheet.bind(this, timesheetIndex)}>Save</a>;
    } else {
      saveButton = <a className='button inactive'>Save</a>;
    }

    if (this.timesheetHasChanges(timesheet, timesheetIndex)) {
      cancelButton =<a className={'button'} onClick={this.cancelTimesheetEdit.bind(this, timesheetIndex)}>Cancel</a>
    } else {
      cancelButton = <a className='button inactive'>Cancel</a>;
    }

    deleteButton = <a className='button delete' onClick={this.deleteTimesheet.bind(this, timesheet, timesheetIndex)}>Delete</a>;

    return (
      <div className="buttons">
        {saveButton}
        {cancelButton}
        {deleteButton}
      </div>
    )
  }

  renderTimesheets() {
    if (this.props.match.params.id === 'new') {
      return '';
    }
    const timesheets = this.state.timesheets.map((timesheet, timesheetIndex) => {
      return (
        <div className="timesheet box" key={timesheet.id}>
          <p className="strong">Date: {new Date(timesheet.date).toDateString()}</p>
          <p>Hours: <input onChange={(e) => this.updateTimesheetHours(e, timesheetIndex)} value={timesheet.hours} type="number" /></p>
          <p>Rate: $<input onChange={(e) => this.updateTimesheetRate(e, timesheetIndex)} value={timesheet.rate} type="number" /> / hour</p>
          <p>Total: ${timesheet.hours * timesheet.rate}</p>
          {this.renderTimesheetButtons(timesheet, timesheetIndex)}
        </div>
      );
    });

    return (
      <div>
        <h2>Timesheets</h2>
        <div className="timesheet-container">
          {timesheets}
        </div>
        <a className="button add" onClick={this.addTimesheet}>Add Timesheet</a>
      </div>
    );
  }

  render() {
    if (!this.state.employee) {
      return <div className="Employee"></div>
    }
    const employee = this.state.employee;
    return (
      <div className="Employee">
        <h2>Employee</h2>
        <div className="employee box">
          {this.renderEmployment()}
          <p className="strong">Name: <input onChange={this.updateEmployeeName} value={employee.name} /></p>
          <p>Position: <input onChange={this.updateEmployeePosition} value={employee.position} /></p>
          <p>Wage: $ <input onChange={this.updateEmployeeWage} value={employee.wage} type="number" /> / hour</p>
          {this.renderEmployeeButtons()}
        </div>
        {this.renderTimesheets()}
      </div>
    );
  }
}

export default withRouter(Employee);
