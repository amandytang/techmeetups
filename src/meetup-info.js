import React, {PureComponent} from 'react';
import { Link } from 'react-router-dom';

export default class MeetupInfo extends PureComponent {

  render() {
    const {info} = this.props;
    const heading = `${info.meetup}`;

    const createMarkup = () => {
      return {__html: `${info.description}`};
    }

    return (
      <div>
        <h3>
          {heading}
        </h3>
        <div id="description" dangerouslySetInnerHTML={createMarkup()} />
        <Link to={ {
          pathname: `/meetup/${info.id}`,
          state: { meetupId: `${info.id}` }
        } } ><button className="markerViewDetails">View Details</button>
        </Link>
      </div>
    );
  }
}
// at this point, do we want clicking on the map to fly to?
