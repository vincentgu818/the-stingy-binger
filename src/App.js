import React, { Component } from 'react';
import axios from 'axios'

import About from "./components/About";
import SeriesForm from "./components/SeriesForm";
import Episodes from "./components/Episodes";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      seriesTitle: '',
      titleReceived: false,
      numEpisodes: '',
      numEpisodesReceived: false,
      omdbUrl: '',
      episodes: []
    }
  }
  handleChange = (ev) => {
    this.setState({[ev.target.id]: ev.target.value})
  }
  handleTitleSubmit = (ev) => {
    ev.preventDefault()
    this.setState({
      omdbUrl: 'http://www.omdbapi.com/?apikey=afe230c0&t=' + this.state.seriesTitle
    }, () => {
      this.fetchEpisodes()
    })
  }
  handleNumEpisodesSubmit = (ev) => {
    ev.preventDefault()
    this.appendImages(this.cullEpisodes(this.state.episodes))
  }
  // fetch all the episodes from OMDB
  fetchEpisodes = async () => {
    let totalSeasons, episodes
    // fetch the series' first season
    await axios.get(this.state.omdbUrl+'&season=1')
      // select and store only the fields relevant to our task
      .then(response => {
        console.log(response)
        if(response.data === "" || response.data.Response === "False") return;
        totalSeasons = response.data.totalSeasons
        episodes = response.data.Episodes.map(ep => {
          return {
            title: ep.Title,
            season: 1,
            episode: Number(ep.Episode),
            rating: Number(ep.imdbRating)
          }
        })
      })
    if(episodes === undefined) return;
    // fetch subsequent seasons
    for(let i=2; i<=totalSeasons; i++) {
      await axios.get(this.state.omdbUrl+`&season=${i}`)
        .then(response => {
          episodes = episodes.concat(response.data.Episodes.map(ep => {
            return {
              title: ep.Title,
              season: i,
              episode: Number(ep.Episode),
              rating: Number(ep.imdbRating)
            }
          }))
        })
    }
    // remove episodes without a rating
    episodes = episodes.filter(ep => !isNaN(ep.rating))
    this.setState({
      episodes: episodes,
      titleReceived: true
    })
  }
  cullEpisodes = (eps) => {
    let culledEpisodes = eps.sort((a, b) => {
      return b.rating - a.rating
    })
    let cutoff = culledEpisodes[this.state.numEpisodes].rating
    culledEpisodes = culledEpisodes.filter(ep => ep.rating >= cutoff)
    culledEpisodes = culledEpisodes.sort((a, b) => {
      return (a.season*100+a.episode) - (b.season*100+b.episode)
    })
    return culledEpisodes
  }
  appendImages = async (eps) => {
    let episodesWithImages = eps
    for(let i=0; i<episodesWithImages.length; i++) {
      let imgUrl, imdbUrl
      let ep=episodesWithImages[i]
      await axios.get(this.state.omdbUrl+`&season=${ep.season}&episode=${ep.episode}`)
        .then(response => {
          imgUrl = response.data.Poster
          imdbUrl = "https://www.imdb.com/title/"+response.data.imdbID
        })
      episodesWithImages[i].imgUrl = imgUrl
      episodesWithImages[i].imdbUrl = imdbUrl
    }
    this.setState({
      episodes: episodesWithImages,
      numEpisodesReceived: true
    })
  }
  removeEpisode = (index) => {
    let episodesWithOneRemoved = this.state.episodes;
    episodesWithOneRemoved.splice(index,1)
    if(episodesWithOneRemoved.length === 0) {
      this.reset()
    }
    this.setState({
      episodes: episodesWithOneRemoved
    })
  }
  reset = () => {
    this.setState({
      seriesTitle: '',
      titleReceived: false,
      numEpisodes: '',
      numEpisodesReceived: false,
      episodes: []
    })
  }
  render() {
    return (
      <div className="container">
        <h1 className="main_title">The Stingy Binger</h1>
        <About/>
        <SeriesForm
          handleTitleSubmit={this.handleTitleSubmit}
          seriesTitle={this.state.seriesTitle}
          titleReceived={this.state.titleReceived}
          handleChange={this.handleChange}
          episodes={this.state.episodes}
          handleNumEpisodesSubmit={this.handleNumEpisodesSubmit}
          numEpisodes={this.state.numEpisodes}
          numEpisodesReceived={this.state.numEpisodesReceived}
        />
        { (this.state.titleReceived && this.state.numEpisodesReceived) ?
        <Episodes
          seriesTitle={this.state.seriesTitle}
          episodes={this.state.episodes}
          removeEpisode={this.removeEpisode}
          reset={this.reset}
        /> : "" }
      </div>
    )
  }
}

export default App;
