import React from 'react';
import GoldMedalMetrics from '../utils/GoldMedalMetrics';

class Sports extends React.Component {
  constructor(props) {
    super(props);
    this.sortBy = this.sortBy.bind(this);
    this.state = {
      countryName: props.match.params.countryName,
      sports: [],
    };
  }

  componentDidMount() {
    GoldMedalMetrics.getSports(this.state.countryName).then(sports => {
      if(sports.length) {
        this.setState({sports: sports});
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const newCountryName = nextProps.match.params.countryName;
    this.setState({countryName: nextProps.match.params.countryName});
    GoldMedalMetrics.getSports(newCountryName).then(sports => {
      if(sports.length) {
        this.setState({sports: sports});
      }
    });
  }

  sortBy(property, isAscending) {
    GoldMedalMetrics.getSports(this.state.countryName, property, isAscending).then(sports => {
      if(sports.length) {
        this.setState({sports: sports});
      }
    });
  }

  renderSportRows() {
    if (!this.state.sports.length) {
      return '';
    }

    return this.state.sports.map(sport => {
      return (
        <tr key={sport.sportName}><td>{sport.sportName}</td>
        <td>{sport.numberMedals}</td>
        <td>{sport.percentageWins}%</td>
        </tr>
      );
    });
  }

  render() {
    return (
    <div>
      <h2 className="subheader">SPORTS</h2>
      <table className="country-table">
        <tbody>
        <tr className="table-header country-header">
          <th>SPORT NAME
            <img className="sort" alt="Sort Ascending" src="img/up.svg" onClick={() => this.sortBy('sport', true)}/>
            <img className="sort" alt="Sort Descending" src="img/down.svg" onClick={() => this.sortBy('sport', false)} />
          </th>
          <th># OF GOLD MEDALS WON
            <img className="sort" alt="Sort Ascending" src="img/up.svg" onClick={() => this.sortBy('count', true)}/>
            <img className="sort" alt="Sort Descending" src="img/down.svg" onClick={() => this.sortBy('count', false)} />
          </th>
          <th>% OF GOLD MEDAL WINS
            <img className="sort" alt="Sort Ascending" src="img/up.svg" onClick={() => this.sortBy('percent', true)}/>
            <img className="sort" alt="Sort Descending" src="img/down.svg" onClick={() => this.sortBy('percent', false)} />
          </th>
        </tr>
        {this.renderSportRows()}
        </tbody>
      </table>
      </div>
    );
  }
};

export default Sports;
