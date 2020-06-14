import camelcaseKeys from './camelcase-keys/index';
import 'whatwg-fetch';

const Expresso = {};
const baseUrl = 'http://localhost:4000/api';

Expresso.getEmployees = () => {
  const url = `${baseUrl}/employees`;

  return fetch(url).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve([]));
    }
    return response.json().then(jsonResponse => {
      return jsonResponse.employees.map(employee => camelcaseKeys(employee));
    });
  });
};

Expresso.getEmployee = id => {
  const url = `${baseUrl}/employees/${id}`;
  return fetch(url).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve(null));
    }
    return response.json().then(jsonResponse => {
      return camelcaseKeys(jsonResponse.employee);
    });
  });
};

Expresso.createEmployee = employee => {
  const url = `${baseUrl}/employees`;
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({employee: employee})
  };
  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve(null));
    }
    return response.json().then(jsonResponse => {
      return camelcaseKeys(jsonResponse.employee);
    });
  });
};

Expresso.updateEmployee = employee => {
  const url = `${baseUrl}/employees/${employee.id}`;
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({employee: employee})
  };
  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve(null));
    }
    return response.json().then(jsonResponse => {
      return camelcaseKeys(jsonResponse.employee);
    });
  });
};

Expresso.restoreEmployee = employee => {
  employee.isCurrentEmployee = 1;
  const url = `${baseUrl}/employees/${employee.id}`;
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({employee: employee})
  };
  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve(null));
    }
    return response.json().then(jsonResponse => {
      return camelcaseKeys(jsonResponse.employee);
    });
  });
};

Expresso.deleteEmployee = id => {
  const url = `${baseUrl}/employees/${id}`;
  const fetchOptions = {
    method: 'DELETE'
  };
  return fetch(url, fetchOptions);
};

Expresso.getMenus = () => {
  const url = `${baseUrl}/menus`;

  return fetch(url).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve([]));
    }
    return response.json().then(jsonResponse => {
      return jsonResponse.menus.map(menu => camelcaseKeys(menu));
    });
  });
};

Expresso.getMenu = id => {
  const url = `${baseUrl}/menus/${id}`;
  return fetch(url).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve(null));
    }
    return response.json().then(jsonResponse => {
      return camelcaseKeys(jsonResponse.menu);
    });
  });
};

Expresso.createMenu = menu => {
  const url = `${baseUrl}/menus`;
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({menu: menu})
  };
  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve(null));
    }
    return response.json().then(jsonResponse => {
      return camelcaseKeys(jsonResponse.menu);
    });
  });
};

Expresso.updateMenu = menu => {
  const url = `${baseUrl}/menus/${menu.id}`;
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({menu: menu})
  };
  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve(null));
    }
    return response.json().then(jsonResponse => {
      return camelcaseKeys(jsonResponse.menu);
    });
  });
};

Expresso.deleteMenu = id => {
  const url = `${baseUrl}/menus/${id}`;
  const fetchOptions = {
    method: 'DELETE'
  };
  return fetch(url, fetchOptions);
};

Expresso.getMenuItems = menuId => {
  const url = `${baseUrl}/menus/${menuId}/menu-items`;
  return fetch(url).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve([]));
    }
    return response.json().then(jsonResponse => {
      return jsonResponse.menuItems.map(menuItem => camelcaseKeys(menuItem));
    });
  });
};

Expresso.createMenuItem = (menuItem, menuId) => {
  const url = `${baseUrl}/menus/${menuId}/menu-items`;
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({menuItem: menuItem})
  };
  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve(null));
    }
    return response.json().then(jsonResponse => {
      return camelcaseKeys(jsonResponse.menuItem);
    });
  });
};

Expresso.updateMenuItem = (menuItem, menuId) => {
  const url = `${baseUrl}/menus/${menuId}/menu-items/${menuItem.id}`;
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({menuItem: menuItem})
  };
  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve(null));
    }
    return response.json().then(jsonResponse => {
      return camelcaseKeys(jsonResponse.menuItem);
    });
  });
};

Expresso.deleteMenuItem = (menuItemId, menuId) => {
  const url = `${baseUrl}/menus/${menuId}/menu-items/${menuItemId}`;
  const fetchOptions = {
    method: 'DELETE'
  };
  return fetch(url, fetchOptions);
};

Expresso.getTimesheets = employeeId => {
  const url = `${baseUrl}/employees/${employeeId}/timesheets`;
  return fetch(url).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve([]));
    }
    return response.json().then(jsonResponse => {
      return jsonResponse.timesheets.map(timesheet => camelcaseKeys(timesheet));
    });
  });
};

Expresso.createTimesheet = (timesheet, employeeId) => {
  const url = `${baseUrl}/employees/${employeeId}/timesheets`;
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({timesheet: timesheet})
  };
  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve(null));
    }
    return response.json().then(jsonResponse => {
      return camelcaseKeys(jsonResponse.timesheet);
    });
  });
};

Expresso.updateTimesheet = (timesheet, employeeId) => {
  const url = `${baseUrl}/employees/${employeeId}/timesheets/${timesheet.id}`;
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({timesheet: timesheet})
  };
  return fetch(url, fetchOptions).then(response => {
    if (!response.ok) {
      return new Promise(resolve => resolve(null));
    }
    return response.json().then(jsonResponse => {
      return camelcaseKeys(jsonResponse.timesheet);
    });
  });
};

Expresso.deleteTimesheet = (timesheetId, employeeId) => {
  const url = `${baseUrl}/employees/${employeeId}/timesheets/${timesheetId}`;
  const fetchOptions = {
    method: 'DELETE'
  };
  return fetch(url, fetchOptions);
};

export default Expresso;