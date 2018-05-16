import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import MeetupDetails from './MeetupDetails';
import Navigation from './Navigation';
import Map from './Map';
import Auth from './Auth';


import { BrowserRouter as Router, Route } from 'react-router-dom';


const Routes = ( // App component holds the Navigation component - but how do I keep the drawer open when navigating back?

  <App >
    <Router>
    <div>
    <Map />

        <Route exact path="/" render={props =>
          <div>
            <Navigation />
          </div>
        } />
        <Route path="/meetup/:id" render={props =>
          <div>
            <MeetupDetails />
          </div>
        } />
        <Route path="/oauth2" render={props =>
          <div>

          <Auth />

          </div>
        } />
    </div>
  </Router>
    </App>
);


ReactDOM.render(Routes, document.getElementById('root'));
registerServiceWorker();

// { props.history.push(`/meetup/${window.location.hash.split(/state=/)[1]}`) }

// {console.log(window.location.hash.split(/state=/)[1])}

// {localStorage.setItem('user', JSON.stringify(user))}

  // http://localhost:3000/oauth2/#access_token=fb39a6b32e8b5faa99fdca0a13ef0716&token_type=bearer&expires_in=3600&state=250024077


            // {localStorage.setItem("hello",hello)}
