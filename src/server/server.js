//Configuring different parts of the server
const path = require('path');

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

app.use((req, res, next) => {
  res.header('Acess-Control-Allow-Origin', '*');
  next();
});

//Sending the home page HTML to the server using a get method
app.get('/', function(req,res){
  res.sendFile(path.resolve('dist/index.html'))
});

//Set up APIs

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

//Make GET Request
app.get('/getGeoData', function(req, res){
   res.send(appData);
})

//for updating UI
app.get("/all", function(req, res) {
  res.send(projectData);
});
