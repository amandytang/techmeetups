import React from 'react';
import './App.css';
import Map from './Map';
import Geocode from "react-geocode";
import axios from 'axios';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/flip.css';

export const MeetupContext = React.createContext();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meetups: '',
      geojson: [],
      textbox: '',
      lat: '',
      lng: ''
    };
  }

  setCity = (event) => {
    this.setState({textbox: event.target.value});
  }

  handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      this.handleSubmit();
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    Geocode.setApiKey("AIzaSyCsKztr2SzD8TrNkG-W4ruL2cLBcxf7SEU");

    if (this.state.textbox) {

      Geocode.fromAddress(this.state.textbox).then(
        response => {
          const { lat, lng } = response.results[0].geometry.location;
          this.setState({lat});
          this.setState({lng});

          let currentComponent = this;

           const fetchMeetups = () => {
            let jsonp = require('jsonp');
            jsonp(`https://api.meetup.com/find/upcoming_events?&sign=true&photo-host=public&lon=${lng}&text=tech&page=100&lat=${lat}&key=543b1a4f397a53372c62665f145eb`, null, (err, data) => {
              if (err) {
                console.error(err.message);
              } else {
                currentComponent.setState({meetups: data.data.events });
                if(currentComponent.state.meetups) {
                let meetupData = currentComponent.state.meetups.slice(0,70);
                let tempArr = [];
                for (let i = 0; i < meetupData.length; i++) {
                  if (meetupData[i].venue && meetupData[i].name) {
                    let isLongString = false;
                    if (meetupData[i].description) {
                      if (meetupData[i].description.length > 255) {
                        isLongString = true;
                      }
                      else {
                        isLongString = false;
                      }
                    }
                    let geojson = {
                      "meetup": meetupData[i].name,
                      "id": meetupData[i].id,
                      "latitude": meetupData[i].venue.lat,
                      "longitude": meetupData[i].venue.lon,
                      "description": isLongString ? `${meetupData[i].description.slice(0,255)}...` : `${meetupData[i].description.slice(0,200)}`
                    }
                    tempArr.push(geojson);
                  }
                }
                currentComponent.setState({geojson : tempArr});
                }
              }
            })
          }
          fetchMeetups(this.state.textbox);
        },
        error => {
          console.error(error);
        }
      )
    }
  }

  componentDidMount () {
    this.searchBar.focus();

    let userLat;
    let userLng;
    let currentComponent = this;

      axios.get('https://api.ipdata.co').then(res => {

        userLat = res.data.latitude;
        userLng = res.data.longitude;
        this.setState({lat: userLat});
        this.setState({lng: userLng});

         function fetchMeetups () {
         let jsonp = require('jsonp');
         jsonp(`https://api.meetup.com/find/upcoming_events?&sign=true&photo-host=public&lon=${userLng}&text=tech&page=100&lat=${userLat}&key=543b1a4f397a53372c62665f145eb`, null, (err, data) => {
          if (err) {
            console.error(err.message);
          } else {
            currentComponent.setState({meetups: data.data.events });
            if (currentComponent.state.meetups) {
              let meetupData = currentComponent.state.meetups.slice(0,80);
              let tempArr = [];
              for (let i = 0; i < meetupData.length; i++) {
                if (meetupData[i].venue && meetupData[i].name) {
                  let isLongString = false;
                  if (meetupData[i].description) {
                    if (meetupData[i].description.length > 255) {
                      isLongString = true;
                    } else {
                      isLongString = false;
                    }
                  }
                  let geojson;
                  if (meetupData[i].description) {
                     geojson = {
                      "meetup": meetupData[i].name,
                      "id": meetupData[i].id,
                      "latitude": meetupData[i].venue.lat,
                      "longitude": meetupData[i].venue.lon,
                      "description": isLongString ? `${meetupData[i].description.slice(0,255)}...` : `${meetupData[i].description.slice(0,200)}`
                    }
                  } else {
                     geojson = {
                      "meetup": meetupData[i].name,
                      "id": meetupData[i].id,
                      "latitude": meetupData[i].venue.lat,
                      "longitude": meetupData[i].venue.lon,
                      "description": "Coming soon."
                    }
                  }
                tempArr.push(geojson);
                }
              }
            currentComponent.setState({geojson : tempArr});
            }
          }
        })
      }
      fetchMeetups();
    }, "jsonp");
  }

  render() {

    return (
      <MeetupContext.Provider value={this.state}>
        <div id="searchContainer">
        <form>
          <input
            className="searchInput"
            placeholder="Find meetups by city"
            pattern=".{1,}" required title="1 character minimum"
            ref={(input) => { this.searchBar = input }}
            value={this.state.textbox}
            onKeyPress={this.handleKeyPress}
            onChange={this.setCity}
          />
          <span tooltip="Search" id="search" flow="down">
          <button
            className="searchButton"
            onClick={this.handleSubmit}
          ></button>
          </span>
        </form>
        </div>
        <Map lat={this.state.lat} lng={this.state.lng}/>
        {this.props.children}
        <Alert stack={{limit: 2}} />

      </MeetupContext.Provider>
    );
  }
}

export default App;
