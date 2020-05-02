import "./styles/styles.scss";
import { displayLength } from "./js/app.js";
// import { displayCountdown } from "./js/app.js";
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
    logo.setAttribute('id', 'logo');
    logo.width = 50;
    logo.height = 50;
    logo.addEventListener("click", function() {
      window.open("https://pixabay.com/", "_blank");
    });
    document.body.appendChild(logo);
    return values;}
  )
};
//Set up a post route unique to the Weatherbit API
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
    const startDate = document.getElementById("startDate").value;
    const formatted = new Date(startDate);
    const startDay = formatted.getDate();
    const values = Object.values(res);
    console.log(values[0]);
    console.log(startDay);
    if (startDay <= 14){
      const weatherType = values[0][startDay - 1].weather.description;
      const highTemp = values[0][startDay - 1].high_temp;
      const lowTemp = values[0][startDay - 1].low_temp;
      const icon = values[0][startDay - 1].weather.icon;
      const day1 = [weatherType, highTemp, lowTemp, icon];
      const day2 = [values[0][startDay].weather.description,
                    values[0][startDay].high_temp,
                    values[0][startDay].low_temp,
                    values[0][startDay].weather.icon];
      const day3 = [values[0][startDay + 1].weather.description,
                    values[0][startDay + 1].high_temp,
                    values[0][startDay + 1].low_temp,
                    values[0][startDay + 1].weather.icon
                  ];
      const weatherArray = [day1, day2, day3];
      displayWeather(weatherArray);
      loadIcon(weatherArray);
    } else{
      const weatherType = values[0][13].weather.description;
      const highTemp = values[0][13].high_temp;
      const lowTemp = values[0][13].low_temp;
      const day1 = [weatherType, highTemp, lowTemp];
      const day2 = [values[0][14].weather.description,
                    values[0][14].high_temp,
                    values[0][14].low_temp];
      const day3 = [values[0][15].weather.description,
                    values[0][15].high_temp,
                    values[0][15].low_temp];
      displayWeather(weatherArray);
      loadIcon(weatherArray);
  }
  function loadIcon(x){
    //Refactor with loops?
    const table = document.getElementById('weatherMsg');

    const logo1 = document.createElement('img');
    const logo2 = document.createElement('img');
    const logo3 = document.createElement('img');
    logo1.src = `https://www.weatherbit.io/static/img/icons/${x[0][3]}.png`;
    logo2.src = `https://www.weatherbit.io/static/img/icons/${x[1][3]}.png`;
    logo3.src = `https://www.weatherbit.io/static/img/icons/${x[2][3]}.png`;

    table.rows[1].cells[1].appendChild(logo1);
    table.rows[2].cells[1].appendChild(logo2);
    table.rows[3].cells[1].appendChild(logo3);
    console.log('Icons loaded');
  };

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
    // .then(async () => {
    //   postToPixa('http://localhost:8000/pixaApi', {placeName});
    // })
    // Calling the Weatherbit API and adding to page
    .then(async () => {
      const geoArray = await getData(
        'http://localhost:8000/postData'
      );
      //This is an extra feature to let the user think about the length of
      //their trip
      const lat = geoArray[0].latitude;
      const lng = geoArray[0].longitude;
      postToWb('http://localhost:8000/wbApi', {lat, lng});
    });
}

//Calculating length of trip and displaying on page
function setTime() {
  const placeName = document.getElementById("locName").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const currentDate = new Date();
  //convert to Unix
  const startStamp = (new Date(startDate).getTime() / 1000);
  const endStamp = (new Date(endDate).getTime() / 1000);
  const currentStamp = currentDate/1000;
  const unixDiff = endStamp - startStamp;
  //Convert unix to days
  const tripLength = unixDiff / 86400;
  displayLength(tripLength);
  const departDate = Math.ceil(((startStamp - currentStamp)/86400));
  displayCountdown(placeName, departDate);
  return tripLength;
}

//Adding the option to delete a trip using the Remove Trip button
const removeButton = document.getElementById('remove2');
removeButton.addEventListener('click', removeTrip, false);
function removeTrip(){
  const weatherMsg = document.getElementById("weatherMsg");
  const lengthMsg = document.getElementById("lengthMsg");
  const countdownMsg = document.getElementById("countdownMsg");
  const image = document.getElementById('placePic');
  const logo = document.getElementById('logo');
  weatherMsg.parentNode.removeChild(weatherMsg);
  lengthMsg.parentNode.removeChild(lengthMsg);
  countdownMsg.parentNode.removeChild(countdownMsg);
  image.parentNode.removeChild(image);
  logo.parentNode.removeChild(logo);

}

function displayCountdown(x, y) {
  const countdownMsg = document.createElement("div");
  countdownMsg.setAttribute("id", "countdownMsg");
  countdownMsg.innerHTML = x + " is " + y + " days away.";
  document.body.appendChild(countdownMsg);
}
