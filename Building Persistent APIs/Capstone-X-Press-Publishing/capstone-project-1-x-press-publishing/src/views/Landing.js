import randomFlatColors from 'random-flat-colors';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import XPress from '../utils/XPress';

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      artists: [],
      series: []
    };
  }

  componentDidMount() {
    XPress.getSeries().then(series => {
      if (series.length) {
        const sortedSeries = this.sortItemNames(series);
        this.setState({series: sortedSeries});
      }
    });

    XPress.getArtists().then(artists => {
      if (artists.length) {
        const sortedArtists = this.sortItemNames(artists);
        this.setState({artists: sortedArtists});
      }
    });
  }

  sortItemNames(items) {
    return items.sort((item1, item2) => {
      if (item2.name.toLowerCase() < item1.name.toLowerCase()) {
        return 1;
      } else {
        return -1;
      }
    });
  }

  renderSeries() {
    return this.state.series.map(series => {
      return (
        <Link to={`/series/${series.id}`}
           className="item"
           style={{backgroundColor: randomFlatColors()}}
           key={series.id}>
          <h3>{series.name}</h3>
        </Link>
      );
    });
  }

  renderArtists() {
    return this.state.artists.map(artist => {
      return (
        <Link to={`/artists/${artist.id}`}
           className="item"
           key={artist.id}>
           <h3>{artist.name}</h3>
           <img src='public/img/artist.svg' alt=''/>
        </Link>
      );
    });
  }

  render() {
    return (
      <div className="Landing">
        <h2>CHOOSE A SERIES</h2>
        <div className="series item-list">
          {this.renderSeries()}
        </div>
        <Link to="/series/new" className="button">ADD</Link>
        <h2>ARTISTS</h2>
        <div className="artist item-list">
          {this.renderArtists()}
        </div>
        <Link to="/artists/new" className="button">ADD</Link>
      </div>
    );
  }
}

export default Landing;
