import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import MeetupDetails from './MeetupDetails';
import Navigation from './Navigation';
import Auth from './Auth';

import { BrowserRouter as Router, Route } from 'react-router-dom';

const Routes = (
  <Router>
    <App >
      <div>
        <Route exact path="/" render={props =>
          <div>
            <Navigation />
          </div>
        } />
        <Route path="/meetup/:id" render={props =>
          <div>
          <Navigation />
            <MeetupDetails />
          </div>
        } />

        <Route path="/back" render={()=>
          <div>
            <Navigation openSidebar={true} />
          </div>
        } />
        

        <Route path="/oauth2" render={props =>
          <div>
            <Auth />
          </div>
        } />
      </div>
    </App>
  </Router>
);

ReactDOM.render(Routes, document.getElementById('root'));
registerServiceWorker();
