import React, { Component } from "react";

class Episodes extends Component {
  render() {
    return (
      <div className="episodes_container">
        <h1>{this.props.seriesTitle}</h1>
        <div className="episodes">
          {this.props.episodes.map((ep,index) => {
            return (
              <a href={ep.imdbUrl} target="_blank">
                <div
                  key={index}
                  className="episode">
                  <img src={ep.imgUrl} alt={ep.title}/>
                  <div className="episode_title">"{ep.title}"</div>
                  <div className="episode_details">Season {ep.season} Episode {ep.episode}. Rating: {ep.rating}</div>
                </div>
              </a>
            )
          })}
        </div>
        <button onClick={this.props.reset}>Stingy Binge Another!</button>
      </div>
    )
  }
}

export default Episodes
