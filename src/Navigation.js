import React from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { MeetupContext } from "./App";
import Geocode from "react-geocode";


class Navigation extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
       isSidebarClosed: true,
     };

     this.handleClick = this.handleClick.bind(this);
   }

  componentDidMount () {

    if (this.props.openSidebar) {
      if (this.state.isSidebarClosed) {
       this.setState({isSidebarClosed: false})
     }
    }
  }

  handleClick() {
      this.setState(prevState => ({
        isSidebarClosed: !prevState.isSidebarClosed
      }));
    }

  handleKeyPress = (event) => {
    if(event.key == 'Enter'){
      this.handleClick();
   }
  }

  render () {

    return (

      <MeetupContext.Consumer>
        {({ meetups, geojson }) => {
          return (
            <div id="nav-wrapper">
              <div id="navbar"><span className="menu" tooltip="Menu" flow="down" tabIndex="0" onKeyPress={this.handleKeyPress}><img src="/menu.svg" alt="menu" id="menu" onClick={this.handleClick}/></span></div>{this.state.isSidebarClosed ? (<div id="sidebar" style={{"transition": "transform 0.4s ease"}}></div>)
              :
              (<div id="sidebar" className="sidebar-shadow" style={{"transform": "translate3d(0px, 0, 0)", "transition": "transform 0.4s ease"}}>
                <img src="/close-menu.svg" className="close-menu" alt="collapse sidebar button" onClick={this.handleClick}/>
                  <MeetupList />
                </div>)}
              </div>
              )
            }
          }
        </MeetupContext.Consumer>
      )
    }
  }

class MeetupList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meetupData: [],
      suburb: ''
    };
  }

  render () {

    return (
      <MeetupContext.Consumer>
        {({ meetups, geojson, lat, lng }) => {

          let _= require('underscore');
          let meetupData = _.sortBy(meetups, 'local_date');
          // reverse geocoding
          // api query limit reached
          // Geocode.fromLatLng(lat, lng).then(
          //   response => {
          //     const suburb = response.results[0].address_components[2].long_name;
          //     if (this.state.suburb !== suburb) {
          //       this.setState({suburb});
          //     }
          //   },
          //   error => {
          //     console.error(error);
          //   }
          // );
          return (

          <div>
            <div id="meetups">
              <div id="meetups-header"><p>&nbsp;Tech&nbsp;<span className="accent">Meetups&nbsp;</span></p>
              <p id="tagline">near <span id="area">you</span></p>
              {/* Uncomment when api resets
              <p id="tagline">near <span id="area">{this.state.suburb}</span></p>
              */}
              </div>
              {meetupData.map( (meetup) => {
                if (meetup.venue && meetup.local_date) {
                  return (
                    <Link
                    key={meetup.id}
                    to={ {
                      pathname: `/meetup/${meetup.id}`,
                      state: { meetupId: meetup.id, geojson: geojson }
                    } } >
                      <div className="meetupContent" id={meetup.id} >
                        <div className="meetupNames">
                          <div className="meetupName">{meetup.name}</div>
                          <div className="groupName">{meetup.group.name}</div>
                          <p><b>Date:</b> <Moment format="dddd, MMM Do YYYY">{meetup.local_date}</Moment></p>
                          <p><b>Venue:</b> {meetup.venue.address_1}</p>
                        </div>
                      </div>
                    </Link>
                  )}
                })
              }
            </div>
          </div>
          )}
        }
        </MeetupContext.Consumer>
       )

  }
}

export default Navigation;
