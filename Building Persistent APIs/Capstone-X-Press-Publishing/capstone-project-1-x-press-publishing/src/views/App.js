import React, { Component } from 'react';
import { Link, HashRouter as Router, Route } from 'react-router-dom';

import Artist from './Artist';
import Landing from './Landing';
import Series from './Series';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header>
            <Link to="/" className="logo">
              <img src='public/img/logo.svg' alt="logo" className="desktop" />
              <img src='public/img/logo-mobile.svg' alt="logo" className="mobile" />
            </Link>
          </header>
          <Route exact path="/" component={Landing} />
          <Route path="/artists/:id" component={Artist} />
          <Route path="/series/:id" component={Series} />
        </div>
      </Router>
    );
  }
}

export default App;
