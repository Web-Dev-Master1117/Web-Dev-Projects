import React from 'react';
import GoldMedalMetrics from '../utils/GoldMedalMetrics';
import { Link } from 'react-router-dom';

class CountryList extends React.Component {
  constructor(props) {
    super(props);
    this.sortBy = this.sortBy.bind(this);
    this.state = {
      countries: [{'name': '-', 'gdp': '-', 'population': '-', 'medals': '-'}]
    };
  }

  componentDidMount() {
    GoldMedalMetrics.getCountries().then(countries => {
      if(countries.length) {
        this.setState({countries: countries});
      }
    });
  }

  sortBy(property, isAscending) {
    GoldMedalMetrics.getCountries(property, isAscending).then(countries => {
      if(countries.length) {
        this.setState({countries: countries});
      }
    });
  }

  renderCountryRows() {
    if (!this.state.countries.length) {
      return null;
    }

    return this.state.countries.map((country, index) => {
      return (
        <tr key={index}><td className="country-link"><Link to={`/country/${country.name}`}>{country.name}</Link></td>
        <td>{country.gdp}</td>
        <td>{country.population}</td>
        <td>{country.medals}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <table className="country-table">
        <tbody><tr className="table-header country-header">
          <th>
            COUNTRY
            <img className="sort" alt="Sort Ascending" src="img/up.svg" onClick={() => this.sortBy('name', true)}/>
            <img className="sort" alt="Sort Descending" src="img/down.svg" onClick={() => this.sortBy('name', false)} />
          </th>
          <th>GDP
            <img className="sort" alt="Sort Ascending" src="img/up.svg" onClick={() => this.sortBy('gdp', true)}/>
            <img className="sort" alt="Sort Descending" src="img/down.svg" onClick={() => this.sortBy('gdp', false)}/>
          </th>
          <th>POPULATION
            <img className="sort" alt="Sort Ascending" src="img/up.svg" onClick={() => this.sortBy('population', true)}/>
            <img className="sort" alt="Sort Descending" src="img/down.svg" onClick={() => this.sortBy('population', false)}/>
          </th>
          <th># OF GOLD MEDALS
            <img className="sort" alt="Sort Ascending" src="img/up.svg" onClick={() => this.sortBy('medalNumber', true)}/>
            <img className="sort" alt="Sort Descending" src="img/down.svg" onClick={() => this.sortBy('medalNumber', false)}/>
          </th>
        </tr>
        {this.renderCountryRows()}
        </tbody>
      </table>
    );
  }
}

export default CountryList;
