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
    let chomp = window.location.hash.split('token=').pop();
    let token = chomp.split('&token_type')[0];

    // #access_token=
    // 716bb087cfcc2ffc5e7fa527c5d5d860&token_type=bearer&expires_i

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
