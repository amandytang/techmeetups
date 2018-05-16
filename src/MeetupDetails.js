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
     this.setState({ showModal: true });
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
                  <img src="/close-menu.svg" className="close-menu" alt="collapse sidebar button" onClick={this.handleClick}/>
                    <div className="meetupDetailsName">{this.state.selectedMeetup.name}</div>
                    <div className="meetupInfo">
                      <p><b>Date:</b> <Moment format="dddd, MMM Do YYYY">{this.state.selectedMeetup.local_date}</Moment></p>
                      <p><b>Time:</b> {moment(this.state.selectedMeetup.local_time, "HH:mm").format('LT')}</p>
                      <p><b>Venue:</b> {this.state.selectedMeetup.venue.address_1}</p>
                      <p><b>{this.state.selectedMeetup.yes_rsvp_count}</b> attending</p>
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
