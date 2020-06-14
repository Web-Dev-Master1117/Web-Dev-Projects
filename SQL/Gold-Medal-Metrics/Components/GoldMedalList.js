import React from 'react';
import GoldMedalMetrics from '../utils/GoldMedalMetrics';

class GoldMedalList extends React.Component {
  constructor(props) {
    super(props);
    this.sortBy = this.sortBy.bind(this);
    this.state = {
      countryName: props.match.params.countryName,
      medals: [{'year': '-', 'season': '-', 'city': '-', 'name': '-', 'event': '-'}],
    };
  }

  componentDidMount() {
    GoldMedalMetrics.getGoldMedals(this.state.countryName).then(medals => {
      if(medals.length) {
        this.setState({medals: medals});
      }
    });
  }

  sortBy(property, isAscending) {
    GoldMedalMetrics.getGoldMedals(this.state.countryName, property, isAscending).then(medals => {
      if(medals.length) {
        this.setState({medals: medals});
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const newCountryName = nextProps.match.params.countryName;
    this.setState({countryName: nextProps.match.params.countryName});
    GoldMedalMetrics.getGoldMedals(newCountryName).then(medals => {
      if(medals.length) {
        this.setState({medals: medals});
      }
    });
  }

  renderMedalRows() {
    if (!this.state.medals.length) {
      return '';
    }

    return this.state.medals.map((medal, index) => {
      return (
        <tr key={index}>
        <td>{medal.year}</td>
        <td>{medal.season}</td>
        <td>{medal.city}</td>
        <td>{medal.name}</td>
        <td>{medal.event}</td>
        </tr>
      );
    });
  }

  render() {
    return (
    <div>
      <h2 className="subheader">GOLD MEDAL LIST</h2>
      <table className="gold-medal-table">
        <tbody>
        <tr className="table-header country-header">
          <th>YEAR WON
            <img className="sort" alt="Sort Ascending" src="img/up.svg" onClick={() => this.sortBy('year', true)}/>
            <img className="sort" alt="Sort Descending" src="img/down.svg" onClick={() => this.sortBy('year', false)} />
          </th>
          <th>SEASON
            <img className="sort" alt="Sort Ascending" src="img/up.svg" onClick={() => this.sortBy('season', true)}/>
            <img className="sort" alt="Sort Descending" src="img/down.svg" onClick={() => this.sortBy('season', false)} />
          </th>
          <th>CITY
            <img className="sort" alt="Sort Ascending" src="img/up.svg" onClick={() => this.sortBy('city', true)}/>
            <img className="sort" alt="Sort Descending" src="img/down.svg" onClick={() => this.sortBy('city', false)} />
          </th>
          <th>MEDAL WINNER NAME
            <img className="sort" alt="Sort Ascending" src="img/up.svg" onClick={() => this.sortBy('name', true)}/>
            <img className="sort" alt="Sort Descending" src="img/down.svg" onClick={() => this.sortBy('name', false)} />
          </th>
          <th>EVENT
            <img className="sort" alt="Sort Ascending" src="img/up.svg" onClick={() => this.sortBy('event', true)}/>
            <img className="sort" alt="Sort Descending" src="img/down.svg" onClick={() => this.sortBy('event', false)} />
          </th>
        </tr>
        {this.renderMedalRows()}
        </tbody>
      </table>
      </div>
    );
  }
}

export default GoldMedalList;
