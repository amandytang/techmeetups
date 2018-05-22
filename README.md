# Tech Meetups

[Tech Meetups](http://tech-meetups.herokuapp.com/) is an app that allows you to easily find and join tech meetups near you. 📍

![Tech Meetups Screenshot](https://media.giphy.com/media/XJMkWRCdSdehUwDbcA/giphy.gif)
<br/>

## Features
* Quickly see where upcoming meetups are being held using the interactive map
* Search for meetups by location name   
* Sign in with your Meetup.com account using the OAuth2 Implicit Flow
* Join Meetup.com meetups directly from the app
* Join Meetup.com groups directly from the app
* On initial page load, the map defaults to the user's current location

## Possible Improvements
* Allow users to see all the meetups they've joined in one place
* Allow users to leave groups and cancel their RSVPs
* Sort by options other than date
* Have the map fly to the location on click of a meetup in the sidebar
* Consider using APIs with larger query limits

## Technologies Used
### [Server](https://github.com/amandytang/techmeetups-server)
The server is used as an API proxy only, to circumvent CORS issues that arose from attempting to fetch from the Meetup API on the frontend.
* Ruby on Rails
* PostgreSQL  

### [Frontend](https://github.com/amandytang/techmeetups)
The frontend is a Single-Page App built in React.

The following libraries/API's/frameworks were used:
* React
* React Context API
* OAuth2
* Mapbox 🗺
* d3 (map animations)
* Google Maps Geocoding API
* Meetup API  
* Axios

## Acknowledgements
A big thanks to Joel, John and Theo for the laughs, chocolates and pep talks, respectively.

## License
Licensed under MIT.
