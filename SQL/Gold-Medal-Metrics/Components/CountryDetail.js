import React from 'react';
import GoldMedalMetrics from '../utils/GoldMedalMetrics';


class CountryDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countryName: GoldMedalMetrics.fixName(props.match.params.countryName),
      countryDetails: {
        'name': '-',
        'numberMedals': '-',
        'bestSummer': '-',
        'bestYear': '-',
        'bestWinter': '-',
        'bestDiscipline': '-',
        'gdp': '-',
        'population': '-',
        'bestSport': '-',
        'bestEvent': '-',
        'mostMedalsAthlete': '-',
        'femaleMedalists': '-',
        'maleMedalists': '-'
      }
    };
  }

  componentDidMount() {
    GoldMedalMetrics.getCountryDetails(GoldMedalMetrics.fixName(this.state.countryName)).then(countryDetails => {
      if(Object.keys(countryDetails).length) {
        this.setState({countryDetails: countryDetails});
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const newCountryName = GoldMedalMetrics.fixName(nextProps.match.params.countryName);
    this.setState({countryName: newCountryName});
    GoldMedalMetrics.getCountryDetails(newCountryName).then(countryDetails => {
      if(Object.keys(countryDetails).length) {
        this.setState({countryDetails: countryDetails});
      }
    });
  }

  render() {
    return (
      <div>
      <h2 className="subheader">{this.state.countryName}</h2>
      <table id="country-detail-table">
        <tbody>
        <tr>
          <td className="table-descriptor">GROSS DOMESTIC PRODUCT</td>
          <td className="table-descriptor"># OF GOLD MEDALS</td>
          <td className="table-descriptor">POPULATION</td>
        </tr>
        <tr>
          <td className="table-value">{this.state.countryDetails.gdp}</td>
          <td className="table-value">{this.state.countryDetails.numberMedals}</td>
          <td className="table-value">{this.state.countryDetails.population}</td>
        </tr>
        <tr>
          <td className="table-descriptor">MOST WINS AT A SUMMER EVENT</td>
          <td className="table-descriptor">BEST OLYMPIC YEAR</td>
          <td className="table-descriptor">MOST WINS AT A WINTER EVENT</td>
        </tr>
        <tr>
          <td className="table-value">{this.state.countryDetails.bestSummer}</td>
          <td className="table-value">{this.state.countryDetails.bestYear}</td>
          <td className="table-value">{this.state.countryDetails.bestWinter}</td>
        </tr>
        <tr>
          <td className="table-descriptor">NUMBER OF MALE MEDALISTS</td> 
          <td className="table-descriptor">MOST MEDALS BY A SINGLE ATHLETE</td>
          <td className="table-descriptor">NUMBER OF FEMALE MEDALISTS</td>
        </tr>
        <tr>
          <td className="table-value">{this.state.countryDetails.maleMedalists}</td>
          <td className="table-value">{this.state.countryDetails.mostMedalsAthlete}</td>
          <td className="table-value">{this.state.countryDetails.femaleMedalists}</td>
        </tr>
        <tr>
          <td className="table-descriptor">MOST MEDALED SPORT</td>
          <td className="table-descriptor">MOST MEDALED DISCIPLINE</td> 
          <td className="table-descriptor">MOST MEDALED EVENT</td> 
        </tr>
        <tr>
          <td className="table-value">{this.state.countryDetails.bestSport}</td>
          <td className="table-value">{this.state.countryDetails.bestDiscipline}</td>
          <td className="table-value">{this.state.countryDetails.bestEvent}</td>
        </tr>
        </tbody>
      </table>
      </div>
    );
  };
}

export default CountryDetail;
