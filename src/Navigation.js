import React from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { MeetupContext } from "./App";


class Navigation extends React.Component {
  constructor(props) {
     super(props);
     this.state = {isToggleOn: true};

     this.handleClick = this.handleClick.bind(this);
   }

  handleClick() {
      this.setState(prevState => ({
        isToggleOn: !prevState.isToggleOn
      }));
    }

// componentDidMount() {
// could we say... if (this.state.meetup)
//       const toggleHeader = () => {
//       if (this.props.isToggleOn === false) {
//         this.setState(prevState => ({
//           isToggleOn: !prevState.isToggleOn
//         }));
//     }
//   }
//   toggleHeader();
// }
  render () {

    return (

        <MeetupContext.Consumer>
                {({ meetups, geojson }) => {
    return (
      <div id="nav-wrapper">
        <div id="navbar"><span tooltip="Menu" flow="down"><img src="/menu.svg" alt="menu" id="menu" onClick={this.handleClick} /></span></div>{this.state.isToggleOn ? (<div id="sidebar" style={{"transition": "transform 0.4s ease"}}></div>)
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
      meetupData: []
    };
  }

  render () {

    return (
      <MeetupContext.Consumer>
        {({ meetups, geojson }) => {

          let _= require('underscore');
          let meetupData = _.sortBy(meetups.slice(0,30), 'local_date');


          return (

          <div>
            <div id="meetups">
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
// ${meetup.date.slice(5)}
// <div className="meetupContent" id={meetup.id} onClick={() => this.handleClick(meetup.id)}>

export default Navigation;
