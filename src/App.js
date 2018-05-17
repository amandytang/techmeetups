import React from 'react';
import './App.css';
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
  // let jsonp = require('jsonp');

  if (window.location.protocol != 'https:' && window.chrome) {
      axios.get('http://ip-api.com/json').then( function (res) {
          console.log(res);

})
}
  navigator.geolocation.getCurrentPosition(locationHandler);

  let currentComponent = this;

  function locationHandler (position) {
   let userLat = position.coords.latitude;
   let userLng = position.coords.longitude;


    const fetchMeetups = () => {
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
  }

  // this.fetchMeetups("sydney");

}


  render() {

    return (
      <MeetupContext.Provider value={this.state}>
      <div id="searchContainer">
      <input
            className="searchInput"
            placeholder="Search a city"
            value={this.state.textbox}
            onChange={this.setCity}
          />
          <button
            className="searchButton"
            onClick={this.handleSubmit}
          >Find</button>
          </div>
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
