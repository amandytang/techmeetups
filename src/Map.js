import React, {Component} from 'react';
import {FlyToInterpolator} from 'react-map-gl';
import MapGL, {Marker, Popup} from 'react-map-gl';
import MeetupPin from './meetup-pin';
import MeetupInfo from './meetup-info';
import * as d3 from 'd3';
import {MeetupContext} from './App';

const TOKEN = 'pk.eyJ1IjoidGVjaG1lZXQiLCJhIjoiY2pndWRpOHVnMW51dzJ3bWx2dWMwd3BjOSJ9.hsVtz9FaTpBnCRunS3evUQ';

export default class Map extends Component {

  constructor(props) {
    super(props);
     this.state = {
      viewport: {
        latitude: -33.86,
        longitude: 151.2,
        zoom: 11.4,
        bearing: 0,
        pitch: 0,
        width: 500,
        height: 500
      },
      popupInfo: null,
      lat: '',
      lng: ''
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();
}

componentDidUpdate(){
  if (this.state.lat !== this.props.lat && this.state.lng !== this.props.lng) {
    this.setState({lat: this.props.lat});
    this.setState({lng: this.props.lng});
    this.setState({
      viewport: {
        ...this.state.viewport,
        latitude: this.props.lat,
        longitude: this.props.lng
      }
      });
  }
}
  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _resize = () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight
      }
    });
  };

  _updateViewport = (viewport) => {

    this.setState({viewport});

      //   if (this.state.lng && this.state.lat) {
      //     console.log(this.state.lng);
      //     this.setState({
      //     viewport: {
      //       ...this.state.viewport,
      //       latitude: this.state.lat,
      //       longitude: this.state.lng
      //     }
      //   });
      // }
  }


  _renderMeetupMarker = (meetup, index) => {
    return (
      <Marker key={`marker-${index}`}
        longitude={meetup.longitude}
        latitude={meetup.latitude} >
        <MeetupPin size={20} onClick={() => this._goToMarker(meetup)} />
      </Marker>
    );
  }

  _renderPopup() {
    const {popupInfo} = this.state;

    return popupInfo && (
      <Popup
        longitude={popupInfo.longitude}
        latitude={popupInfo.latitude}
        offsetTop={-13}
        offsetLeft={3}
        onClose={() => this.setState({popupInfo: null})} >
        <MeetupInfo info={popupInfo} />
      </Popup>
    );
  }
//
//   _goToCity = (lat,lng) => {
//     if (lat, lng) {
//        const viewport = {
//         ...this.state.viewport,
//         longitude: lng,
//         latitude: lat,
//         zoom: 11.4,
//         transitionDuration: 3000,
//         transitionInterpolator: new FlyToInterpolator(),
//         transitionEasing: d3.easeCubic
//       };
//     this.setState({viewport});
//   };
// }
  _goToMarker = (meetup) => {
    this.setState({popupInfo: meetup});
      const viewport = {
        ...this.state.viewport,
        longitude: meetup.longitude,
        latitude: meetup.latitude,
        zoom: 11.4,
        transitionDuration: 3000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: d3.easeCubic
      };
    this.setState({viewport});
  };

  render() {

    const {viewport} = this.state;

    return (
      <MeetupContext.Consumer>

        {({ meetups, geojson, lat, lng }) => {

          return (
            <MapGL
              {...viewport}
              mapStyle="mapbox://styles/techmeet/cjguetle700042roi9k1mb8mq"
              onViewportChange={this._updateViewport}
              mapboxApiAccessToken={TOKEN} >
               {geojson.map(this._renderMeetupMarker)}
               {this._renderPopup()}
             </MapGL>
          )
        }
      }

      </MeetupContext.Consumer>
    );
  }
}
