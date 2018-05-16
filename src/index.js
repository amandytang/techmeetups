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

            // {localStorage.setItem("hello",hello)}
