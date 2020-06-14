import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

import XPress from '../utils/XPress';

class Series extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: null,
      issues: [],
      artists: {}
    };

    this.updateSeriesName = this.updateSeriesName.bind(this);
    this.updateSeriesDescription = this.updateSeriesDescription.bind(this);
    this.updateIssueName = this.updateIssueName.bind(this);
    this.updateIssueNumber = this.updateIssueNumber.bind(this);
    this.updateIssueDate = this.updateIssueDate.bind(this);
    this.updateIssueArtist = this.updateIssueArtist.bind(this);
    this.saveSeries = this.saveSeries.bind(this);
    this.cancelSeriesEdit = this.cancelSeriesEdit.bind(this);
    this.deleteSeries = this.deleteSeries.bind(this);
    this.addIssue = this.addIssue.bind(this);
    this.saveIssue = this.saveIssue.bind(this);
    this.cancelIssueEdit = this.cancelIssueEdit.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params.id === 'new') {
      const newSeries = {
        name: '',
        description: ''
      };

      this.setState({
        series: newSeries,
        savedSeries: JSON.parse(JSON.stringify(newSeries))
      });
      return;
    }

    XPress.getSeriesById(this.props.match.params.id).then(series => {
      if (series) {
        this.setState({
          series: series,
          savedSeries: JSON.parse(JSON.stringify(series))
        });
      }
    });

    this.initializeIssues();
  }

  initializeIssues() {
    XPress.getIssues(this.props.match.params.id).then(issues => {
      const sortedIssues = this.sortIssues(issues);
      this.setState({
        issues: sortedIssues,
        savedIssues: JSON.parse(JSON.stringify(sortedIssues))
      });
    });

    XPress.getArtists().then(artists => {
      if (artists) {
        const artistMapping = {};
        artists.forEach(artist => artistMapping[artist.id] = artist.name);
        this.setState({artists: artistMapping});
      }
    });
  }

  sortIssues(issues) {
    return issues.sort((issue1, issue2) => {
      if (issue1.issueNumber < issue2.issueNumber) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  seriesHasChanges() {
    const series = this.state.series;
    const savedSeries = this.state.savedSeries;
    if (!savedSeries) {
      return false;
    }

    if (series.name === savedSeries.name &&
        series.description === savedSeries.description) {
      return false;
    }

    return true;
  }

  seriesHasAllRequiredFields() {
    return !!this.state.series.name && !!this.state.series.description;
  }

  issueHasChanges(issue, issueIndex) {
    const savedIssue = this.state.savedIssues[issueIndex];

    if (!issue.id) {
      return true;
    }

    if (!savedIssue) {
      return false;
    }

    if (issue.name === savedIssue.name &&
        issue.issueNumber === savedIssue.issueNumber &&
        issue.publicationDate === savedIssue.publicationDate &&
        issue.artistId === savedIssue.artistId) {
      return false;
    }

    return true;
  }

  issueHasAllRequiredFields(issue) {
    return !!issue.name && !!issue.issueNumber && !! issue.publicationDate &&
        issue.artistId;
  }

  updateSeriesName(event) {
    const series = JSON.parse(JSON.stringify(this.state.series));
    series.name = event.target.value;
    this.setState({series: series});
  }

  updateSeriesDescription(event) {
    const series = JSON.parse(JSON.stringify(this.state.series));
    series.description = event.target.value;
    this.setState({series: series});
  }

  updateIssueName(event, issueIndex) {
    const issues = JSON.parse(JSON.stringify(this.state.issues));
    issues[issueIndex].name = event.target.value;
    this.setState({issues: issues});
  }

  updateIssueNumber(event, issueIndex) {
    const issues = JSON.parse(JSON.stringify(this.state.issues));
    issues[issueIndex].issueNumber = event.target.value;
    this.setState({issues: issues});
  }

  updateIssueDate(event, issueIndex) {
    const issues = JSON.parse(JSON.stringify(this.state.issues));
    issues[issueIndex].publicationDate = event.target.value;
    this.setState({issues: issues});
  }

  updateIssueArtist(event, issueIndex) {
    const issues = JSON.parse(JSON.stringify(this.state.issues));
    issues[issueIndex].artistId = event.target.value;
    this.setState({issues: issues});
  }

  saveSeries() {
    if (this.state.series.id) {
      XPress.updateSeries(this.state.series).then(series => {
        this.setState({
          series: series,
          savedSeries: JSON.parse(JSON.stringify(series))
        });
      });
    } else {
      XPress.createSeries(this.state.series).then(series => {
        this.props.history.push(`/series/${series.id}`);
        this.setState({
          series: series,
          savedSeries: JSON.parse(JSON.stringify(series))
        });
        this.initializeIssues();
      });
    }
  }

  cancelSeriesEdit() {
    this.setState({
      series: JSON.parse(JSON.stringify(this.state.savedSeries))
    });
  }

  deleteSeries() {
    XPress.deleteSeries(this.state.series.id).then(() => {
      this.props.history.push('/');
    });
  }

  addIssue() {
    const defaultArtistId = Object.keys(this.state.artists)[0];
    const newIssue = {
      name: '',
      issueNumber: '',
      publicationDate: '',
      artistId: defaultArtistId
    };

    const issues = JSON.parse(JSON.stringify(this.state.issues));
    issues.push(newIssue);
    const savedIssues = JSON.parse(JSON.stringify(this.state.savedIssues));
    savedIssues.push(newIssue);
    this.setState({
      issues: issues,
      savedIssues: savedIssues
    });
  }

  saveIssue(issueIndex) {
    if (this.state.issues[issueIndex].id) {
      XPress.updateIssue(this.state.issues[issueIndex], this.state.series.id)
        .then(issue => {
          let issues = JSON.parse(JSON.stringify(this.state.issues));
          issues.splice(issueIndex, 1, issue);
          let savedIssues = JSON.parse(JSON.stringify(this.state.savedIssues));
          savedIssues.splice(issueIndex, 1, issue);
          issues = this.sortIssues(issues);
          savedIssues = this.sortIssues(savedIssues);
          this.setState({
            issues: issues,
            savedIssues: JSON.parse(JSON.stringify(issues))
          });
        });
    } else {
      XPress.createIssue(this.state.issues[issueIndex], this.state.series.id)
        .then(issue => {
          let issues = JSON.parse(JSON.stringify(this.state.issues));
          issues.splice(issueIndex, 1, issue);
          let savedIssues = JSON.parse(JSON.stringify(this.state.savedIssues));
          savedIssues.splice(issueIndex, 1, issue);
          issues = this.sortIssues(issues);
          savedIssues = this.sortIssues(savedIssues);
          this.setState({
            issues: issues,
            savedIssues: savedIssues
          });
      });
    }
  }

  cancelIssueEdit(issueIndex) {
    const issues = JSON.parse(JSON.stringify(this.state.issues));
    const issue = issues[issueIndex];
    if (!issue.id) {
      this.deleteIssue(issue, issueIndex);
    } else {
      issues[issueIndex] = JSON.parse(JSON.stringify(this.state.savedIssues[issueIndex]));
      this.setState({
        issues: issues
      });
    }
  }

  deleteIssue(issue, issueIndex) {
    XPress.deleteIssue(issue.id, this.state.series.id).then(() => {
      const issues = JSON.parse(JSON.stringify(this.state.issues));
      issues.splice(issueIndex, 1);
      const savedIssues = JSON.parse(JSON.stringify(this.state.savedIssues));
      savedIssues.splice(issueIndex, 1);
      this.setState({
        issues: issues,
        savedIssues: savedIssues
      });
    });
  }

  generateArtistOptions() {
    const artists = this.state.artists;
    const options = [];
    for (let artistId in artists) {
      options.push(<option value={artistId}>{artists[artistId]}</option>);
    }
    return options;
  }

  renderSeriesButtons() {
    const series = this.state.series;
    let saveButton, cancelButton, deleteButton;

    if (this.seriesHasChanges() && this.seriesHasAllRequiredFields()) {
      saveButton =<a className={'button'} onClick={this.saveSeries}>Save</a>;
    } else {
      saveButton = <a className='button inactive'>Save</a>;
    }

    if (this.seriesHasChanges()) {
      cancelButton =<a className={'button'} onClick={this.cancelSeriesEdit}>Cancel</a>
    } else {
      cancelButton = <a className='button inactive'>Cancel</a>;
    }

    if (!this.state.issues.length) {
      deleteButton = <a className='button delete' onClick={this.deleteSeries}>Delete</a>;
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

  renderIssueButtons(issue, issueIndex) {
    let saveButton, cancelButton, deleteButton;

    if (this.issueHasChanges(issue, issueIndex) && this.issueHasAllRequiredFields(issue)) {
      saveButton =<a className={'button'} onClick={this.saveIssue.bind(this, issueIndex)}>Save</a>;
    } else {
      saveButton = <a className='button inactive'>Save</a>;
    }

    if (this.issueHasChanges(issue, issueIndex)) {
      cancelButton =<a className={'button'} onClick={this.cancelIssueEdit.bind(this, issueIndex)}>Cancel</a>
    } else {
      cancelButton = <a className='button inactive'>Cancel</a>;
    }

    deleteButton = <a className='button delete' onClick={this.deleteIssue.bind(this, issue, issueIndex)}>Delete</a>;

    return (
      <div className="buttons">
        {saveButton}
        {cancelButton}
        {deleteButton}
      </div>
    )
  }

  renderIssues() {
    if (this.props.match.params.id === 'new') {
      return '';
    }
    const issues = this.state.issues.map((issue, issueIndex) => {
      return (
        <div className="issue" key={issue.id}>
          <h3>Name: <input onChange={(e) => this.updateIssueName(e, issueIndex)} value={issue.name}/></h3>
          <p>Issue # <input type="number" onChange={(e) => this.updateIssueNumber(e, issueIndex)} value={issue.issueNumber} /></p>
          <p>Date: <input onChange={(e) => this.updateIssueDate(e, issueIndex)} value={issue.publicationDate} /></p>
          <p>Artist: <select onChange={(e) => this.updateIssueArtist(e, issueIndex)} value={issue.artistId}>
            {this.generateArtistOptions()}
          </select></p>
          {this.renderIssueButtons(issue, issueIndex)}
        </div>
      );
    });

    return (
      <div className="issue-container">
        <div className="issues">
          {issues}
        </div>
        <a className="button" onClick={this.addIssue}>Add Issue</a>
      </div>
    );
  }

  render() {
    if (!this.state.series) {
      return <div className="Series"></div>
    }
    const series = this.state.series;
    return (
      <div className="Series">
        <div className="description">
          <input onChange={this.updateSeriesName} value={series.name}  placeholder="Series Title" />
          <h3>Description</h3>
          <textarea onChange={this.updateSeriesDescription} value={series.description} />
          {this.renderSeriesButtons()}
        </div>
        {this.renderIssues()}
      </div>
    );
  }
}

export default withRouter(Series);