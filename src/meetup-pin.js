import React, {PureComponent} from 'react';

export default class MeetupPin extends PureComponent {

  render() {
    const {size = 20, onClick} = this.props;

    return (
      <img src="https://i.imgur.com/thmI7CT.png" alt="marker" style={{width: "25px", height: "25px", transform: `translate(${-size/2}px,${-size}px)`}}
        onClick={onClick} />
    );
  }
}
