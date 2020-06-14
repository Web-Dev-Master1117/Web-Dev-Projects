import React from 'react';
import { Redirect } from 'react-router';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {country: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      country: event.target.value,
      fireRedirect: false
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({fireRedirect: true});
  }

  render() {
    const { from } = '/';
    const { fireRedirect, country } = this.state;

    return (
        <div id="search">
          <form onSubmit={this.handleSubmit}>
            <div id="country-search">
              <img id="magnifying-glass" alt="Search" src='img/magnify.svg' />
              <input type="text" id="country-search-input" placeholder="Search for a country" value={this.state.value} onChange={this.handleChange} />
            </div>
            <input type="submit" value="SEARCH" id="country-search-button" />
          </form>
          {fireRedirect && (
            <Redirect to={from || `/country/${country}`}/>
          )}
        </div>
    );
  }
};

export default Search;
