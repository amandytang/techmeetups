import React from 'react';
import { MeetupContext } from "./App";
import Moment from 'react-moment';
import moment from 'moment';
import ReactModal from 'react-modal';
import axios from 'axios';
import Alert from 'react-s-alert';
import { Link } from 'react-router-dom';

class MeetupDetails extends React.Component {
  constructor(props) {
     super(props);
     this.state = {
       isSidebarClosed: false,
       selectedMeetup: '',
       showModal: false,
       attending: '',
       hasJoinedMeetup: false,
       hasJoinedGroup: false,
       groups: ''
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
        url: 'http://tech-meetups-server.herokuapp.com/attending',
        params: {
          fields: "self",
          token: token
        }
      }).then( (response) => {
        let attending = [];
        let groups = [];
          if (response.data) {
            for (let i = 0; i < response.data.length; i++) {
              groups.push(response.data[i].group.id);
              if (response.data[i].self.rsvp) {
                if (response.data[i].self.rsvp.response === "yes" || response.data[i].self.rsvp.response === "waitlist") {
                  attending.push(response.data[i]);
                }
              }
            }
            this.setState({attending});
            this.setState({groups});
          }
        }).catch( (error) => {
          console.log(error);
      });
    }
  }

  componentDidUpdate () {
    let ids = [];

    for (let i = 0; i < this.state.attending.length; i++) {
      ids.push(this.state.attending[i].id)
    }

    if (this.state.groups && this.state.selectedMeetup.id) {
      if (this.state.groups.includes(this.state.selectedMeetup.group.id)) {
        if (!this.state.hasJoinedGroup) {
          this.setState({hasJoinedGroup: true});
        }
      }
    }

    if (ids.includes(this.state.selectedMeetup.id)) {
      if (!this.state.hasJoinedMeetup) {
        this.setState({hasJoinedMeetup: true});
      }
    }
  }

  handleJoinGroup (groupId, groupName) {
    if (localStorage.getItem("token")) {
      let token = localStorage.getItem("token");

      axios({
        method: 'post',
        url: 'http://tech-meetups-server.herokuapp.com/join_group',
        params: {
          group_id: groupId,
          group_urlname: groupName,
          token: token
        }
      }).then( (response) => {
        if (!response.data.error) {
          if (this.state.selectedMeetup.group.name) {
            Alert.success(`Success! You are now a member of the group, ${this.state.selectedMeetup.group.name}. Don’t forget to join the meetup if that’s what you’re into.`, {
              position: 'top',
              effect: 'flip',
              beep: false,
              html: true,
              timeout: 'none'
            });
          }
        }
        if (response.data.error) {
          this.setState({ showModal: true });

          Alert.warning(`Sorry, we couldn't add you to this group. Have you signed in? The group might also have special joining requirements that you can read about <a href="https://www.meetup.com/${groupName}" target="_blank" rel="noopener">here</a>.`, {
            position: 'top',
            effect: 'flip',
            beep: false,
            html: true,
            timeout: 'none'
          });
        }
      })
      .catch( (error) => {
        this.setState({ showModal: true });

        Alert.warning(`Sorry, we couldn't add you to this group. Have you signed in? The group might also have special joining requirements that you can read about <a href="https://www.meetup.com/${groupName}" target="_blank" rel="noopener">here</a>.`, {
          position: 'top',
          effect: 'flip',
          beep: false,
          html: true,
          timeout: 'none'
        });
      });
    } else {
      this.setState({ showModal: true });
    }
  }

  handleOpenModal () {
    if (localStorage.getItem("token")) {
      let token = localStorage.getItem("token");
      let id = window.location.href.split('/').pop();

      axios({
        method: 'post',
        url: 'http://tech-meetups-server.herokuapp.com/join_meetup',
        params: {
          rsvp: "yes",
          event_id: id,
          token: token
        }
      }).then( (response) => {
        if (!response.data.error) {
          if (this.state.selectedMeetup.name) {
            Alert.success(`Success! You're going to ${this.state.selectedMeetup.name}.`, {
              position: 'top',
              effect: 'flip',
              beep: false,
              html: true,
              timeout: 'none'
            });
          }
        }

        if (response.data.error) {

          if (response.data.error === "You must be a member of this group to RSVP to the event.") {
            Alert.warning("Sorry, we couldn't add you to this meetup. You need to become a member of the group that's hosting it first.", {
              position: 'top',
              effect: 'flip',
              beep: false,
              html: true,
              timeout: 'none'
            });
          } else if (response.data.error === "You are not authorized to make that request.") {
            this.setState({ showModal: true });

            Alert.warning("Sorry, we couldn't add you to this meetup. Please sign in first.", {
              position: 'top',
              effect: 'flip',
              beep: false,
              html: true,
              timeout: 'none'
            });
          } else if (response.data.error === "There are not enough spots for your rsvp.") {

            Alert.warning("Sorry, we couldn't add you to this meetup. Either there are not enough spots for your rsvp or rsvps haven't opened up yet.", {
              position: 'top',
              effect: 'flip',
              beep: false,
              html: true,
              timeout: 'none'
            });
          } else {
            this.setState({ showModal: true });

            Alert.warning(`Sorry, something went wrong and we couldn't add you to this meetup. You might have more luck joining <a href="https://www.meetup.com/${this.state.selectedMeetup.group.urlname}/events/${this.state.selectedMeetup.id}" target="_blank" rel="noopener">here</a>.`, {
              position: 'top',
              effect: 'flip',
              beep: false,
              html: true,
              timeout: 'none'
            });
          }
        }
      })
      .catch( (error) => {
        this.setState({ showModal: true });

        Alert.warning(`Sorry, something went wrong and we couldn't add you to this meetup. You might have more luck joining <a href="https://www.meetup.com/${this.state.selectedMeetup.group.urlname}/events/${this.state.selectedMeetup.id}/" target="_blank" rel="noopener>here</a>.`, {
          position: 'top',
          effect: 'flip',
          beep: false,
          html: true,
          timeout: 'none'
        });
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
      isSidebarClosed: !prevState.isSidebarClosed
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
                <button className="close-modal" alt="close modal button" onClick={this.handleCloseModal}/>
                <div className="modalContent">
                <div className="modalHeading">Join {this.state.selectedMeetup.name.slice(0,60)}</div>
                <p>Please sign in to join.</p>
              <img src="/meetup.svg" className="meetup-logo" alt="meetup logo"/>
                  <div className="alignment-wrapper"><a href={"https://secure.meetup.com/oauth2/authorize?client_id=nshm9bem6d20rlgg1it0hhg1gk&response_type=token&scope=rsvp+ageless+group_join&redirect_uri=http://tech-meetups.herokuapp.com/oauth2/&state=" + this.state.selectedMeetup.id}><button className="signIn">Sign in with Meetup.com</button></a></div></div>
              </ReactModal>
              <div id="nav-wrapper">
                <div id="navbar"><span tooltip="Menu" flow="down"><img src="/menu.svg" alt="menu" id="menu" onClick={this.handleClick} /></span></div>
                {this.state.isSidebarClosed ? (<div id="sidebar" style={{"transition": "transform 0.4s ease"}}></div>)
                :
                (<div id="sidebar" className="sidebar-shadow" style={{"transform": "translate3d(0px, 0, 0)", "transition": "transform 0.4s ease"}}>
                  <button className="close-menu" alt="collapse sidebar button" onClick={this.handleClick}/>
                  <div className="meetupDetailsName">{this.state.selectedMeetup.name}</div>

                  <div className="meetupInfo">
                    <div className="back">
                      <Link to={ {
                      pathname: '/back'
                      } } >Back</Link>
                    </div>
                    <p><b>Group:</b> {this.state.selectedMeetup.group.name}</p>
                    <p><b>Date:</b> <Moment format="dddd, MMM Do YYYY">{this.state.selectedMeetup.local_date}</Moment></p>
                    <p><b>Time:</b> {moment(this.state.selectedMeetup.local_time, "HH:mm").format('LT')}</p>
                    <p><b>Venue:</b> {this.state.selectedMeetup.venue.address_1}</p>
                    <p><b>{this.state.selectedMeetup.yes_rsvp_count}</b> <span className="members">{this.state.selectedMeetup.group.who}</span> attending</p>
                    {this.state.hasJoinedMeetup
                      ? <div className="meetupJoined" id={this.state.selectedMeetup.id}>Meetup Joined</div>
                      : <button className="meetupJoin" id={this.state.selectedMeetup.id} onClick={this.handleOpenModal}>Join Meetup</button>}
                    {this.state.hasJoinedGroup
                      ? <div className="groupJoined">Group Joined</div>
                      : <button className="groupJoin" onClick={() => this.handleJoinGroup(this.state.selectedMeetup.group.id, this.state.selectedMeetup.group.urlname)}>Join Group</button>}
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
