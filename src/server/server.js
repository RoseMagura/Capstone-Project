//Configuring different parts of the server
const path = require('path');
//Configure dotenv to work with .env file and secret data
const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const app = express();

const request = require('request');

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Setting up server
const port = 8000;
const server = app.listen(port, ()=>{console.log(`running on localhost:
  ${port}`)});

//Letting express know which directory to check
app.use(express.static('dist'));

//Sending the home page HTML to the server using a get method
app.get('/', function(req,res){
  res.sendFile(path.resolve('dist/index.html'))
});

//Make POST Request
const appData = [];
app.post('/postData', postData);
function postData(req, res){
  let newEntry = {
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    country: req.body.country
  };
  appData.push(newEntry);
}

//Make GET Request to Geonames API
app.get('/getGeoData', function(req, res){
   res.send(appData);
})

//Resolving cors bug that occurs when trying to access Weatherbit API
app.use((req, res, next) => {
  res.header('Acess-Control-Allow-Origin', '*');
  next();
});

//Set up features for Weatherbit API and resolving bug
app.get('/daily', function(req, res){
  request(
   { url: 'https://api.weatherbit.io/v2.0/forecast/daily'},

   (error, response, body) => {
     // if (error || response.statusCode !== 200) {
     //   return res.status(500).json({ type: 'error', message: err.message });
     // }

     res.json(JSON.parse(body));
   }
  )
})

//Resolving cors bug that occurs when trying to access Weatherbit API
app.use((req, res, next) => {
  res.header('Acess-Control-Allow-Origin', '*');
  next();
});
//Set up features for Pixabay API and resolving bug
app.get('/api', function(req, res){
  request(
   { url: 'https://pixabay.com/api/?key='},

   (error, response, body) => {
     // if (error || response.statusCode !== 200) {
     //   return res.status(500).json({ type: 'error', message: err.message });
     // }

     res.json(JSON.parse(body));
   }
  )
})
