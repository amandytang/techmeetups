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
  // extract token from url, save into local storage and
    let token = window.location.hash.match("(?<=token=)(.*)(?=&token)")[1];
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

// { props.history.push(`/meetup/${window.location.hash.split(/state=/)[1]}`) }

// {console.log(window.location.hash.split(/state=/)[1])}

// {localStorage.setItem('user', JSON.stringify(user))}

  // http://localhost:3000/oauth2/#access_token=fb39a6b32e8b5faa99fdca0a13ef0716&token_type=bearer&expires_in=3600&state=250024077

  // if (localStorage.getItem("token")) {

//}
