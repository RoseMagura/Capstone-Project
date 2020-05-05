//Configuring different parts of the server
const path = require("path");
//Configure dotenv to work with .env file and secret data
const dotenv = require("dotenv");
dotenv.config();

//Declaring the different parts of the URL for the Weatherbit API
const wbBaseUrl = "https://api.weatherbit.io/v2.0/forecast/daily?";
const wbApiKey = "&key=" + process.env.WB_API_KEY;

//the different parts of the URL for the Pixabay API
const pixaBaseUrl = "https://pixabay.com/api/?key=";
const pixaApiKey = process.env.PIXA_API_KEY;

//Setting up express, cors, and body-parser
const express = require("express");
const app = express();

const request = require("request");

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Setting up server
const port = 8000;
const server = app.listen(port, () => {
  console.log(`running on localhost:
  ${port}`);
});

//Letting express know which directory to check
app.use(express.static("dist"));

//Sending the home page HTML to the server using a get method
app.get("/", function(req, res) {
  res.sendFile(path.resolve('dist/index.html'))
});

//Make POST Request for information from Geonames API
const appData = [];
app.post("/postData", postData);
function postData(req, res) {
  let newEntry = {
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    country: req.body.country
  };
  appData.push(newEntry);
};

//Get data from Geonames and use to call Weatherbit API (see client side)
app.get('/postData', (req, res)=>{
  res.send(appData);
  //clear appData so that once a trip has been posted, it doesn't keep
  //getting displayed
  appData.length = 0;
})

//Make GET Request to Geonames API
app.get("/getGeoData", (req, res) => {
  console.log(appData);
  res.send(appData);
});

//Resolving cors bug that occurs when trying to access Weatherbit API
app.use((req, res, next) => {
  res.header("Acess-Control-Allow-Origin", "*");
  next();
});

//Set up features for Weatherbit API and resolving bug
app.post("/wbApi", (req, res) =>{
  request(
    { url: wbBaseUrl + '&lat=' + req.body.lat + '&lon=' + req.body.lng +
  wbApiKey},
    (error, response, body) => {
      res.json(JSON.parse(body));
    }
  );
});

//Resolving cors bug that occurs when trying to access Pixabay API
app.use((req, res, next) => {
  res.header("Acess-Control-Allow-Origin", "*");
  next();
});

// Set up features for Weatherbit API and resolving bug
app.post("/pixaApi", function(req, res) {
  request(
    { url:
      `https://pixabay.com/api/?key=${pixaApiKey}&q=${req.body.placeName}&image_type=photo`},
    (error, response, body) => {
      res.json(JSON.parse(body));
    }
  );
});
