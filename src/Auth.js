import React from 'react';
import PropTypes from "prop-types";

class Auth extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
  // extract token from url, save into local storage and redirect back to meetup detail page
    // let token = window.location.hash.match(/(?<=token=)(.*)(?=&token)/)[1];
    let token = window.location.hash.split('/').pop();
    localStorage.setItem("token", token);



    this.context.router.history.push(`/meetup/${window.location.hash.split(/state=/)[1]}`);
  };

  render() {

   return (
     <div></div>
   )
  }

}

export default Auth;
