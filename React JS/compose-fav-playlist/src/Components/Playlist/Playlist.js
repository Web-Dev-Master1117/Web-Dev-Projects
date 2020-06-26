import React from 'react';
import './Playlist.css';
import { TrackList } from '../TrackList/TrackList';

export class Playlist extends React.Component {

    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePlaylistCreation = this.handlePlaylistCreation.bind(this);
    }

    handleNameChange(e) {
        this.props.onNameChange(e.target.value);
    }

    handlePlaylistCreation(e) {
        this.props.savePlaylist();
    }

    render() {
        return (
            <div className="Playlist">
                <input value={this.props.playlistName} onChange={this.handleNameChange} />
                <TrackList tracks={this.props.playlistTracks} isRemoval={true} onRemove={this.props.onRemove} />
                <button className="Playlist-save" onClick={this.handlePlaylistCreation}>SAVE TO SPOTIFY</button>
            </div>
        )
    }
}