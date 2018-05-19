import React from 'react';
import './App.css';
import Map from './Map';
import Geocode from "react-geocode";
import axios from 'axios';
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

handleSubmit = () => {

  Geocode.setApiKey("AIzaSyCsKztr2SzD8TrNkG-W4ruL2cLBcxf7SEU");

  Geocode.fromAddress(this.state.textbox).then(
    response => {
      const { lat, lng } = response.results[0].geometry.location;
      this.setState({lat});
      this.setState({lng});

      let currentComponent = this;

       const fetchMeetups = () => {
        let jsonp = require('jsonp');
        jsonp(`https://api.meetup.com/find/upcoming_events?&sign=true&photo-host=public&lon=${lng}&text=tech&radius=25&lat=${lat}&key=543b1a4f397a53372c62665f145eb`, null, (err, data) => {
          if (err) {
            console.error(err.message);
          } else {
            currentComponent.setState({meetups: data.data.events });
            if(currentComponent.state.meetups) {
            let meetupData = currentComponent.state.meetups.slice(0,30);
            let tempArr = [];
            for (let i = 0; i < meetupData.length; i++) {
              if (meetupData[i].venue && meetupData[i].name) {
                let isLongString = false;
                if (meetupData[i].description.length > 255) {
                  isLongString = true;
                }
                else {
                  isLongString = false;
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
            } // end of for loop
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
       jsonp(`https://api.meetup.com/find/upcoming_events?&sign=true&photo-host=public&lon=${userLng}&text=tech&radius=25&lat=${userLat}&key=543b1a4f397a53372c62665f145eb`, null, (err, data) => {
         if (err) {
           console.error(err.message);
         } else {
           currentComponent.setState({meetups: data.data.events });
           if(currentComponent.state.meetups) {
           let meetupData = currentComponent.state.meetups.slice(0,30);
           let tempArr = [];
           for (let i = 0; i < meetupData.length; i++) {
             if (meetupData[i].venue && meetupData[i].name) {
               let isLongString = false;
               if (meetupData[i].description.length > 255) {
                 isLongString = true;
               }
               else {
                 isLongString = false;
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
           } // end of for loop
           currentComponent.setState({geojson : tempArr});
           }
         }
       })
     }
fetchMeetups();
    }, "jsonp");

  // navigator.geolocation.getCurrentPosition(locationHandler);


  // const locationHandler = () => {
    // userLat = position.coords.latitude;
    // userLng = position.coords.longitude;



  // this.fetchMeetups("sydney");
  // locationHandler();

}


  render() {

    return (
      <MeetupContext.Provider value={this.state}>
      <div id="searchContainer">
      <input
            className="searchInput"
            placeholder="Search meetups by city"
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
          </div>
          <Map lat={this.state.lat} lng={this.state.lng}/>
        {this.props.children}

      </MeetupContext.Provider>
    );
  }
}

export default App;


      // <div id="wrapper">
      // <Map meetups={this.state.meetups} geojson={this.state.geojson} style={{width: '100%',
      //   height: '100%'
      // }}/>
      // <Navigation meetups={this.state.meetups} geojson={this.state.geojson}/>
      // </div>
