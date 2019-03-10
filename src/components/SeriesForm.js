import React, { Component } from "react";

class SeriesForm extends Component {
  render() {
    return (
      <div className="form_container">
        { !this.props.titleReceived ?
        <div className="series_form">
          <h3>Which TV series would you like to watch?</h3>
          <form onSubmit={this.props.handleTitleSubmit}>
            <input
              id="seriesTitle"
              type='text'
              value={this.props.seriesTitle}
              onChange={this.props.handleChange}
            />
            <br/>
            <input type='submit' value='Stingy Binge It!' />
          </form>
        </div>
        : !this.props.numEpisodesReceived ?
        <div className="num_episodes_form">
          <h3>How many of its {this.props.episodes.length} episodes would you like to watch?</h3>
          <form onSubmit={this.props.handleNumEpisodesSubmit}>
            <input
              id="numEpisodes"
              type='number'
              value={this.props.numEpisodes}
              onChange={this.props.handleChange}
            />
            <br/>
            <input type='submit' value='Stingy Binge It!' />
          </form>
        </div>
        : "" }
      </div>
    )
  }
}

export default SeriesForm
