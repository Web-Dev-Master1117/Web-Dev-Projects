import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

import XPress from '../utils/XPress';

class Artist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      artist: null,
      mode: 'view'
    };

    this.updateName = this.updateName.bind(this);
    this.updateDob = this.updateDob.bind(this);
    this.updateBiography = this.updateBiography.bind(this);
    this.saveArtist = this.saveArtist.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.deleteArtist = this.deleteArtist.bind(this);
    this.restoreArtist = this.restoreArtist.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params.id === 'new') {
      const newArtist = {
        name: '',
        dateOfBirth: '',
        biography: '',
        isCurrentlyEmployed: 1
      };

      this.setState({
        artist: newArtist,
        savedArtist: JSON.parse(JSON.stringify(newArtist))
      });
      return;
    }

    XPress.getArtist(this.props.match.params.id).then(artist => {
      if (artist) {
        this.setState({
          artist: artist,
          savedArtist: JSON.parse(JSON.stringify(artist))
        });
      }
    });
  }

  hasAllRequiredFields() {
    const artist = this.state.artist;
    if (!artist.name || !artist.dateOfBirth || !artist.biography) {
      return false;
    }
    return true;
  }

  hasChanges() {
    const artist = this.state.artist;
    const savedArtist = this.state.savedArtist;
    if (!savedArtist) {
      return false;
    }

    if (artist.name === savedArtist.name &&
        artist.dateOfBirth === savedArtist.dateOfBirth &&
        artist.biography === savedArtist.biography) {
      return false;
    }

    return true;
  }

  updateName(event) {
    const artist = JSON.parse(JSON.stringify(this.state.artist));
    artist.name = event.target.value;
    this.setState({artist: artist});
  }

  updateDob(event) {
    const artist = JSON.parse(JSON.stringify(this.state.artist));
    artist.dateOfBirth = event.target.value;
    this.setState({artist: artist});
  }

  updateBiography(event) {
    const artist = JSON.parse(JSON.stringify(this.state.artist));
    artist.biography = event.target.value;
    this.setState({artist: artist});
  }

  saveArtist() {
    if (this.state.artist.id) {
      XPress.updateArtist(this.state.artist).then(artist => {
        this.setState({
          artist: artist,
          savedArtist: JSON.parse(JSON.stringify(artist))
        });
      });
    } else {
      XPress.createArtist(this.state.artist).then(artist => {
        this.props.history.push(`/artists/${artist.id}`);
        this.setState({
          artist: artist,
          savedArtist: JSON.parse(JSON.stringify(artist))
        });
      });
    }
  }

  cancelEdit() {
    this.setState({
      artist: JSON.parse(JSON.stringify(this.state.savedArtist))
    });
  }

  restoreArtist() {
    XPress.restoreArtist(this.state.savedArtist).then(artist => {
      const stateArtist = JSON.parse(JSON.stringify(this.state.artist));
      stateArtist.isCurrentlyEmployed = artist.isCurrentlyEmployed;
      this.setState({
        artist: stateArtist,
        savedArtist: artist
      });
    });
  }

  deleteArtist() {
    XPress.deleteArtist(this.state.artist.id).then(artist => {
      const stateArtist = JSON.parse(JSON.stringify(this.state.artist));
      stateArtist.isCurrentlyEmployed = artist.isCurrentlyEmployed;
      this.setState({
        artist: stateArtist,
        savedArtist: stateArtist
      });
    });
  }

  renderRetired() {
    if (!this.state.artist.isCurrentlyEmployed) {
      return <h2 className="retired">Retired</h2>;
    }
    return '';
  }

  renderButtons() {
    const artist = this.state.artist;
    let saveButton, cancelButton, deleteButton;

    if (this.hasChanges() && this.hasAllRequiredFields()) {
      saveButton =<a className={'button'} onClick={this.saveArtist}>Save</a>;
    } else {
      saveButton = <a className='button inactive'>Save</a>;
    }

    if (this.hasChanges()) {
      cancelButton =<a className={'button'} onClick={this.cancelEdit}>Cancel</a>
    } else {
      cancelButton = <a className='button inactive'>Cancel</a>;
    }

    if (artist.isCurrentlyEmployed && artist.id) {
      deleteButton = <a className='button delete' onClick={this.deleteArtist}>Delete</a>;
    } else if (artist.id) {
      deleteButton = <a className='button' onClick={this.restoreArtist}>Restore</a>
    } else {
      deleteButton = '';
    }

    return (
      <div className="buttons">
        {saveButton}
        {cancelButton}
        {deleteButton}
      </div>
    )
  }

  render() {
    if (!this.state.artist) {
      return <div className="Artist"></div>
    }
    const artist = this.state.artist;
    return (
      <div className="Artist">
        <div className="description">
          {this.renderRetired()}
          <h2>Name: <input onChange={this.updateName} value={artist.name} /></h2>
          <h3>DOB: <input onChange={this.updateDob} value={artist.dateOfBirth} /></h3>
          <div className="divider"></div>
          <h3>Biography:</h3>
          <textarea onChange={this.updateBiography} value={artist.biography} />
        </div>
        {this.renderButtons()}
      </div>
    );
  }
}

export default withRouter(Artist);
