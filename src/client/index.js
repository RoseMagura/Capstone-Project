import "./styles/styles.scss";
import { displayLength } from "./js/app.js";
import { displayWeather } from "./js/app.js";
require("regenerator-runtime/runtime");

//Declaring the different parts of the URL for the Geonames API
const geoBaseUrl =
  "http://api.geonames.org/findNearbyPostalCodesJSON?placename=";
const geoEndUrl = "&username=";
const username = "magurarm";

//Set up Get Request for Geonames API
const getGeoData = async (url = "") => {
  const res = await fetch(url);
  try {
    const newData = await res.json();
    const arrayData = Object.values(newData);
    const lat = arrayData[0][0].lat;
    const lng = arrayData[0][0].lng;
    const country = arrayData[0][0].countryCode;
    const geoArray = [lat, lng, country];
    return geoArray;
  } catch (error) {
    console.log("error", error);
  }
};

//Just a basic Get Request
const getData = async (url = "") => {
  const res = await fetch(url);
  try {
    const newData = await res.json();
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};

//Set up Post Request
const postData = async (url = "", data = {}) => {
  // console.log(data);
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log("Error: ", error);
  }
};

//Set up a post route unique to the Pixabay API
const postToPixa = async(url = "", data = {})=> {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(function(res){
    const values = Object.values(res);
    const image = document.createElement("img");
    image.setAttribute("id", "placePic");
    image.src = `${values[2][0].largeImageURL}`;
    image.width = 400; //Edit later?
    image.height = 400;
    document.body.appendChild(image);
    const logo = document.createElement("img");
    logo.src = "https://pixabay.com/static/img/logo_square.png";
    logo.width = 50;
    logo.height = 50;
    logo.addEventListener("click", function() {
      window.open("https://pixabay.com/", "_blank");
    });
    document.body.appendChild(logo);
    return values;}
  )
};

const postToWb = async(url = "", data = {})=> {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(function(res){
    const tripLength = setTime();
    displayLength(tripLength);
    const values = Object.values(res);
    const weatherType = values[0][tripLength - 1].weather.description;
    const highTemp = values[0][tripLength - 1].high_temp;
    const lowTemp = values[0][tripLength - 1].low_temp;
    const weatherArray = [weatherType, highTemp, lowTemp];
    displayWeather(weatherArray);
  })
}

//When user inputs start and end date, calculate the length of the trip
const submitButton = document.getElementById("submit");
submitButton.addEventListener("click", setTime, false);

//When user submits button, call the three APIs in succession
submitButton.addEventListener("click", performAction, false);
function performAction(e) {
  e.preventDefault(); //prevent endless relaoding
  //Here, set up the different parts of the Geonames URL based on input
  const placeName = document.getElementById("locName").value;
  console.log(placeName + " submitted!");
  const geoArray = getGeoData(geoBaseUrl + placeName + geoEndUrl + username)
    //Post the information that was just retrieved
  .then(function(geoArray) {
    postData("http://localhost:8000/postData", {
      latitude: geoArray[0],
      longitude: geoArray[1],
      country: geoArray[2]
      });
    })
    //Calling the Pixabay API and adding content directly to page
    .then(async () => {
      postToPixa('http://localhost:8000/pixaApi', {placeName});
    })
    // Calling the Weatherbit API and adding to page
    .then(async () => {
      const geoArray = await getData(
        'http://localhost:8000/postData'
      );
      console.log(geoArray);
      //This is an extra feature to let the user think about the length of
      //their trip
      const lat = geoArray[0].latitude;
      const lng = geoArray[1].longitude;
      postToWb('http://localhost:8000/wbApi', {lat, lng});
    });
}

//Calculating length of trip and displaying on page
function setTime() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  //convert to Unix
  const startStamp = (new Date(startDate).getTime() / 1000).toFixed(0);
  const endStamp = (new Date(endDate).getTime() / 1000).toFixed(0);
  const unixDiff = endStamp - startStamp;
  //Convert unix to days
  const tripLength = unixDiff / 86400;
  return tripLength;
}
