import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

import CountryDetail from './Components/CountryDetail';
import CountryList from './Components/CountryList';
import Sports from './Components/Sports';
import GoldMedalList from './Components/GoldMedalList';
import Search from './Components/Search';


class App extends Component {
  render() {
    return (
      <Router>
        <div id="container">
        <Search />
        <Route path="/country/:countryName" component={ props => (
        <div>
          <CountryDetail {...props}/>
          <GoldMedalList {...props}/>
          <Sports {...props}/>
        </div>
        )} />
        <Route exact path="/" component={ props => (
          <div>
          <CountryList {...props}/>
          </div>
        )} />
      </div>
      </Router>
    );
  }
}

export default App;
