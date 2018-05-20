import React from 'react';
import { MeetupContext } from "./App";
import Moment from 'react-moment';
import moment from 'moment';
import ReactModal from 'react-modal';



class MeetupDetails extends React.Component {
  constructor(props) {
     super(props);

     this.state = {
       isToggleOn: false,
       selectedMeetup: '',
       showModal: false
     };

     this.handleClick = this.handleClick.bind(this);
     this.handleOpenModal = this.handleOpenModal.bind(this);
     this.handleCloseModal = this.handleCloseModal.bind(this);
   }

   handleOpenModal () {
     // what happens when the user clicks join. We shouldn't open the modal if they have already got a token, and should actually let them join the meetup here i.e. make the api call
     // need to handle what happens if the token has expired (get a refresh token)
     // if successful, change button to joined and make it green
     if (localStorage.getItem("token")) {
      let token = localStorage.getItem("token");
      let id = window.location.href.match(/[^\/]+$/)[0];

// Failed to load https://api.meetup.com/2/rsvp: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:3000' is therefore not allowed access. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

      const proxyurl = "https://cors-anywhere.herokuapp.com/";
      const url = `https://api.meetup.com/2/rsvp/?access_token=${token}`;
      const url2 = `https://api.meetup.com/2/rsvp/`;

// if I don't use proxy, I get 405. If I do, I get 400 (bad request)
// possible issues: fetching wrong url, sending wrong headers, CORS, not using the right parameters, not sending the parameters correctly...
    // axios({ method: 'POST',
    //   url: url,
    //   // headers: {Authorization: `Bearer ${token}`},
    //   data: { rsvp: 'yes', event_id: id } })
    //   .then(res => res.json()).catch(error => console.error('Error:', error))


    //   var request = require('request');
    //
    //   var options = {
    //   url: url,
    //   rsvp: 'yes',
    //   event_id: id
    // };
    //
    // function callback(error, response, body) {
    //     console.log('error:', error); // Print the error if one occurred
    //     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //     console.log('body:', body); // Print the HTML for the Google homepage.
    //   };
    //
    //   request(options, callback);

// const joinParams = {
//   method: 'POST',    // 405 - method not allowed - is it this one??
//   rsvp: 'yes',
//   event_id: id
// };
//
// const joinMeetup = () => {
//
// jsonp(url2, joinParams, (function (err, results) {
//   if (err) {
//     console.error(err.message);
//   } else {
//   console.log(results);
//   }
// }));
//
// }
// joinMeetup();


     fetch(url, {
        method: 'POST',
    //     headers: {
    //     'Accept': 'application/json, text/plain, */*',
    //     'Content-Type': 'application/json'
    // // // },
    //    headers: {
    //   'Authorization': 'Bearer ' + token
    //           },
       // withCredentials: true
       // credentials: 'include',

       body:
       // JSON.stringify({
         'rsvp=yes&event_id=' + id
       // })
     }).then(res => res.json()).catch(error => console.error('Error:', error))

   } else {
     this.setState({ showModal: true });
     }
   }

  handleCloseModal () {
    this.setState({ showModal: false });
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }


  render () {
    console.log();
    const createMarkup = () => {
      return {__html: `<b>Meetup Details</b>: ${this.state.selectedMeetup.description}`};
    }

    return <MeetupContext.Consumer>
      {({ meetups, geojson }) => {
        if (meetups) {
          let id = window.location.href.match(/[^\/]+$/)[0];
          let _= require('underscore');
          let selectedMeetup = _.findWhere(meetups, {id: id});
          if (selectedMeetup && (selectedMeetup !== this.state.selectedMeetup)) {
            this.setState({selectedMeetup});
          }
        }
        if (this.state.selectedMeetup.venue && this.state.selectedMeetup.description) {
          return (
            <div>
              <ReactModal
                 isOpen={this.state.showModal}
                 contentLabel="Modal"
                 ariaHideApp={false}
              >
                <img src="/close-menu.svg" className="close-modal" alt="close modal button" onClick={this.handleCloseModal}/>
                <div className="modalContent">
                <div className="modalHeading">Join {this.state.selectedMeetup.name}</div>
                <p>Please sign in to join this meetup.</p>
              <img src="/meetup.svg" className="meetup-logo" alt="meetup logo"/>
                  <div className="alignment-wrapper"><a href={"https://secure.meetup.com/oauth2/authorize?client_id=f551auo99eqakj1e68270s47b3&response_type=token&redirect_uri=http://localhost:3000/oauth2/&state=" + this.state.selectedMeetup.id}><button className="signIn">Sign in with Meetup.com</button></a></div></div>
              </ReactModal>
              <div id="nav-wrapper">
                <div id="navbar"><span tooltip="Menu" flow="down"><img src="/menu.svg" alt="menu" id="menu" onClick={this.handleClick} /></span></div>
                {this.state.isToggleOn ? (<div id="sidebar" style={{"transition": "transform 0.4s ease"}}></div>)
                :
                (<div id="sidebar" className="sidebar-shadow" style={{"transform": "translate3d(0px, 0, 0)", "transition": "transform 0.4s ease"}}>
                  <span tabIndex="0"><img src="/close-menu.svg" className="close-menu" alt="collapse sidebar button" onClick={this.handleClick}/></span>
                    <div className="meetupDetailsName">{this.state.selectedMeetup.name}</div>
                    <div className="meetupInfo">
                      <p className="group"><b>Organiser:</b> {this.state.selectedMeetup.group.name}</p>
                      <p><b>Date:</b> <Moment format="dddd, MMM Do YYYY">{this.state.selectedMeetup.local_date}</Moment></p>
                      <p><b>Time:</b> {moment(this.state.selectedMeetup.local_time, "HH:mm").format('LT')}</p>
                      <p><b>Venue:</b> {this.state.selectedMeetup.venue.address_1}</p>
                      <p><b>{this.state.selectedMeetup.yes_rsvp_count}</b> {this.state.selectedMeetup.group.who} attending</p>
                      <button className="meetupJoin" id={this.state.selectedMeetup.id} onClick={this.handleOpenModal}>Join</button>
                      </div>
                      <div className="meetupDetailsContent">
                      <p id="meetupDescription" dangerouslySetInnerHTML={createMarkup()} />
                    </div>
                </div>)}
              </div>
            </div>
          )
        }
      }
    }
    </MeetupContext.Consumer>
  }
}

export default MeetupDetails;
