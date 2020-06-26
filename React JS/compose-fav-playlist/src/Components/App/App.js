import React from 'react';
import './App.css';

import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: [],
      checkAccessToken() {
        if(Spotify.accessToken) return true;
        else return false;
      },
      alertType: 'You are signed In',
      loading: false
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);

    Spotify.getAccessTokenFromCookie();

    if(!Spotify.accessToken)
      {
        Spotify.getAccessTokenFromURI();
      }

  }

  //add a new track to playlistTracks
  addTrack(track) {
    if(this.state.playlistTracks.find(playlistTrack => playlistTrack.id === track.id)) {
      return;
    }
    else {
      this.state.playlistTracks.push(track);
      this.setState({ playlistTracks: this.state.playlistTracks, searchResults: this.state.searchResults.filter(savedTrack => savedTrack.id !== track.id) });
    }
  }

  //remove from playlistTracks
  removeTrack(track) {
    if(this.state.playlistTracks.find(playListTrack => playListTrack.id === track.id)) {
      this.setState({playlistTracks: this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id )});
    }
    else {
      return;
    }
  }

  //sync playlistName with user's input
  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  //save the current playlist to Spotify
  async savePlaylist(){

    this.setState({loading: true});

    const trackURIs = this.state.playlistTracks.map(track => {
        return track.uri;
    });
    
    await Spotify.savePlaylist(this.state.playlistName, trackURIs);
    
    this.setState({playlistName: 'New Playlist', playlistTracks: [], alertType: 'newPlaylist', loading:false});
  
  }


  //searching a track
  async search(term) {
    if(!Spotify.accessToken){
      Spotify.requestAccessToken();
    }
    let results = await Spotify.search(term);
    if(results)
      this.setState({ searchResults: results });
    else return;
  }


  render() {
    if(!this.state.loading){
    return (
      <div>
        <h1>Compose<span className="highlight"> Your Fav </span>Playlist</h1>
        <div className="App">
          <SearchBar onSearch={this.search} accessToken={this.state.checkAccessToken} alertType={this.state.alertType} />
            <div className="App-playlist">
              <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
              <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} savePlaylist={this.savePlaylist} linkSpotify={this.getAccessToken} />
            </div>
        </div>
      </div>
    );
    }
    else return (
      <div className="loader">
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />
      </div>
    );
  }
}

export default App;
