import React from 'react';
import './SearchBar.css'

export class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = { term: ''};
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        this.alert = this.alert.bind(this);
    }

    search() {
        this.props.onSearch(this.state.term);
    }

    handleTermChange(e) {
        this.setState({ term: e.target.value });
    }

    alert() {
        let accessToken = this.props.accessToken();
        if(!accessToken) return <h4>By clicking, You will be redirected to Spotify login page for taking your permission to create and edit your public playlist</h4>;
        else if(this.props.alertType === 'newPlaylist') return <h4>Current playlist added to your spotify account. Keep creating your favourite playlist!!</h4>;
        else return <h4>{this.props.alertType}</h4>;
    }

    render() {
        return(
        <div className="SearchBar">
            <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} />
            <button className="SearchButton" onClick={this.search}>SEARCH</button>
                {this.alert()}
        </div>
        );
    }
}