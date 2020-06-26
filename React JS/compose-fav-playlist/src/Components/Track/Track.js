import React from 'react';
import './Track.css';

export class Track extends React.Component {

    constructor(props) {
        super(props);
        this.addTrack = this.addTrack.bind(this);
        this.renderAction = this.renderAction.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }

    addTrack() {
        this.props.onAdd(this.props.track);
    }

    removeTrack() {
        this.props.onRemove(this.props.track);
    }

    renderAction() {
        if(!this.props.isRemoval) {
            return <button className="Track-action" onClick={this.addTrack}>+</button>;
        }
        else {
            return <button className="Track-action" onClick={this.removeTrack}>-</button>
        }
    }

    render() {
        let track=this.props.track;
        return (
            <div className="Track">
                <img src={track.image} alt="" height="64" width="64"  />
                <div className="Track-information">
                    <h3>{track.name}</h3>
                    <p>{track.artist} | {track.album}</p>
                </div>
            {this.renderAction()}
            </div>
        );
    }
}