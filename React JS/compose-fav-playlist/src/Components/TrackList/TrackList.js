import React from 'react';
import './TrackList.css';
import { Track } from '../Track/Track';

export class TrackList extends React.Component {
    render() {
        let tracks = this.props.tracks;
        return (
            <div className="TrackList">
                { tracks.map(track => {
                    return <Track key={track.id} track={track} isRemoval={this.props.isRemoval} onAdd={this.props.onAdd} onRemove={this.props.onRemove} />
                }) }
            </div>
        );
    }
}