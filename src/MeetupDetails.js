import React from 'react';
import { MeetupContext } from "./App";
import Moment from 'react-moment';
import moment from 'moment';
import ReactModal from 'react-modal';
import axios from 'axios';
import Alert from 'react-s-alert';

class MeetupDetails extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
       isToggleOn: false,
       selectedMeetup: '',
       showModal: false,
       attending: ''
     };
     this.handleClick = this.handleClick.bind(this);
     this.handleOpenModal = this.handleOpenModal.bind(this);
     this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  componentDidMount () {
    if (localStorage.getItem("token")) {
      let token = localStorage.getItem("token");

      axios({
        method: 'get',
        url: 'https://api.meetup.com/self/calendar/',
        headers: {'Authorization': `Bearer ${token}`},
        params: {
          fields: "self"
        }
      }).then( (response) => {
        let attending = [];
          if (response.data) {
            for (let i = 0; i < response.data.length; i++) {
              if (response.data[i].self.rsvp) {
                if (response.data[i].self.rsvp.response === "yes" || response.data[i].self.rsvp.response === "waitlist") {
                  attending.push(response.data[i]);
                }
              }
            }
          }
        this.setState({attending}); // array of objects
        console.log(attending);
        // if (this.state.selectedMeetup.id) {
        //
        // }

      }).catch( (error) => {
        console.log(error);
      });
  }

  // based on the state (results from api call), find whether the current meetup id is present and if it is, do the class adding stuff

}

  handleJoinGroup (groupId, groupName) {
    if (localStorage.getItem("token")) {
      let token = localStorage.getItem("token");

      axios({
        method: 'post',
        url: "https://api.meetup.com/2/profile/",
        headers: {'Authorization': `Bearer ${token}`},
        params: {
          group_id: groupId,
          group_urlname: groupName
        }
      }).then( (response) => {
        if (this.state.selectedMeetup.group.name) {
          Alert.success(`Success! You are now a member of the group, ${this.state.selectedMeetup.group.name}. Don’t forget to join the meetup if that’s what you’re into.`, {
            position: 'top',
            effect: 'flip',
            beep: false,
            html: true,
            timeout: 'none'
          });
        }
      })
      .catch( (error) => {
      // if API returns 401 error, access token has likely expired - so trigger reauthorisation modal
        if (error.toString().includes('401')) {
          this.setState({ showModal: true });
        }

        if (error.toString().includes('400')) {
          this.setState({ showModal: true });

          Alert.warning(`Sorry, we couldn't add you to this group. Have you signed in? They might also have special requirements that you can read about <a href="https://www.meetup.com/${groupName}" target="_blank" rel="noopener">here</a>.`, {
            position: 'top',
            effect: 'flip',
            beep: false,
            html: true,
            timeout: 'none'
          });
        }
      });

    } else {
      this.setState({ showModal: true });
    }
  }

  handleOpenModal () {
    if (localStorage.getItem("token")) {
      let token = localStorage.getItem("token");
      let id = window.location.href.match(/[^\/]+$/)[0];

      axios({
        method: 'post',
        url: 'https://api.meetup.com/2/rsvp/',
        headers: {'Authorization': `Bearer ${token}`},
        params: {
          rsvp: "yes",
          event_id: id
        }
      }).then( (response) => {
        if (this.state.selectedMeetup.name) {
          Alert.success(`Success! You're going to ${this.state.selectedMeetup.name}.`, {
            position: 'top',
            effect: 'flip',
            beep: false,
            html: true,
            timeout: 'none'
          });
        }
      })
      .catch( (error) => {
        if (error.toString().includes('401')) {
          this.setState({ showModal: true });
        }

        if (error.toString().includes('400')) {
          this.setState({ showModal: true });

          Alert.warning("Sorry, we couldn't add you to this meetup. You might need to sign in and become a member of the group that's hosting it first.", {
            position: 'top',
            effect: 'flip',
            beep: false,
            html: true,
            timeout: 'none'
          });
        }
      });

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
                <p>Please sign in to join.</p>
              <img src="/meetup.svg" className="meetup-logo" alt="meetup logo"/>
                  <div className="alignment-wrapper"><a href={"https://secure.meetup.com/oauth2/authorize?client_id=nshm9bem6d20rlgg1it0hhg1gk&response_type=token&scope=rsvp+ageless+group_join&redirect_uri=http://tech-meetups.herokuapp.com/oauth2/&state=" + this.state.selectedMeetup.id}><button className="signIn">Sign in with Meetup.com</button></a></div></div>
              </ReactModal>
              <div id="nav-wrapper">
                <div id="navbar"><span tooltip="Menu" flow="down"><img src="/menu.svg" alt="menu" id="menu" onClick={this.handleClick} /></span></div>
                {this.state.isToggleOn ? (<div id="sidebar" style={{"transition": "transform 0.4s ease"}}></div>)
                :
                (<div id="sidebar" className="sidebar-shadow" style={{"transform": "translate3d(0px, 0, 0)", "transition": "transform 0.4s ease"}}>
                  <img src="/close-menu.svg" className="close-menu" alt="collapse sidebar button" onClick={this.handleClick}/>
                    <div className="meetupDetailsName">{this.state.selectedMeetup.name}</div>
                    <div className="meetupInfo">
                      <p><b>Group:</b> {this.state.selectedMeetup.group.name}</p>
                      <p><b>Date:</b> <Moment format="dddd, MMM Do YYYY">{this.state.selectedMeetup.local_date}</Moment></p>
                      <p><b>Time:</b> {moment(this.state.selectedMeetup.local_time, "HH:mm").format('LT')}</p>
                      <p><b>Venue:</b> {this.state.selectedMeetup.venue.address_1}</p>
                      <p><b>{this.state.selectedMeetup.yes_rsvp_count}</b> <span className="members">{this.state.selectedMeetup.group.who}</span> attending</p>
                      <button className="meetupJoin" id={this.state.selectedMeetup.id} onClick={this.handleOpenModal}>Join Meetup</button>
                      <button className="groupJoin" onClick={() => this.handleJoinGroup(this.state.selectedMeetup.group.id, this.state.selectedMeetup.group.urlname)}>Join Group</button>
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
