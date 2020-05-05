import "./styles/styles.scss";
import { displayLength } from "./js/app.js";
import { displayWeather } from "./js/app.js";
require("regenerator-runtime/runtime");

//Declaring the different parts of the URL for the Geonames API
const geoBaseUrl =
  "http://api.geonames.org/findNearbyPostalCodesJSON?placename=";
const geoEndUrl = "&username=";
//username is defined separately so it could be changed easily
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
const postToPixa = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(function(res) {
      const values = Object.values(res);
      const image = document.createElement("img");
      image.setAttribute("id", "placePic");
      image.src = `${values[2][0].largeImageURL}`;
      image.width = 400; //Edit later?
      image.height = 400;
      document.body.appendChild(image);
      const logo = document.createElement("img");
      //adding the Pixabay logo and link to cite them
      logo.src = "https://pixabay.com/static/img/logo_square.png";
      logo.setAttribute("id", "logo");
      logo.width = 50;
      logo.height = 50;
      logo.addEventListener("click", function() {
        window.open("https://pixabay.com/", "_blank");
      });
      document.body.appendChild(logo);
      return values;
    });
};
//Set up a post route unique to the Weatherbit API
const postToWb = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(function(res) {
      const startDate = document.getElementById("startDate").value;
      const formatted = new Date(startDate);
      const startDay = formatted.getDate();
      const values = Object.values(res);
      //If start day is within 14 days, use actual data for those specific dates
      if (startDay <= 14) {
        const weatherType = values[0][startDay - 1].weather.description;
        const highTemp = values[0][startDay - 1].high_temp;
        const lowTemp = values[0][startDay - 1].low_temp;
        const icon = values[0][startDay - 1].weather.icon;
        const day1 = [weatherType, highTemp, lowTemp, icon];
        const day2 = [
          values[0][startDay].weather.description,
          values[0][startDay].high_temp,
          values[0][startDay].low_temp,
          values[0][startDay].weather.icon
        ];
        const day3 = [
          values[0][startDay + 1].weather.description,
          values[0][startDay + 1].high_temp,
          values[0][startDay + 1].low_temp,
          values[0][startDay + 1].weather.icon
        ];
        const weatherArray = [day1, day2, day3];
        displayWeather(weatherArray);
        loadIcon(weatherArray);
      } else {
        //if start day is more than 14 days away, just use any dates to estimate
        //weather instead of specific dates
        const weatherType = values[0][13].weather.description;
        const highTemp = values[0][13].high_temp;
        const lowTemp = values[0][13].low_temp;
        const icon =   values[0][13].weather.icon
        const day1 = [weatherType, highTemp, lowTemp, icon];
        const day2 = [
          values[0][14].weather.description,
          values[0][14].high_temp,
          values[0][14].low_temp,
          values[0][14].weather.icon
        ];
        const day3 = [
          values[0][15].weather.description,
          values[0][15].high_temp,
          values[0][15].low_temp,
          values[0][15].weather.icon
        ];
        const weatherArray = [day1, day2, day3];
        displayWeather(weatherArray);
        loadIcon(weatherArray);
      }
      //Adding weather icons using the codes returned in Weatherbit
      function loadIcon(x) {
        const table = document.getElementById("weatherMsg");
        for (let i = 0; i < 3; i++) {
          const logo = document.createElement("img");
          logo.src = `https://www.weatherbit.io/static/img/icons/${
            x[i][3]
          }.png`;
          table.rows[i + 1].cells[1].appendChild(logo);
        }
      }
    });
};

//When user inputs start and end date, calculate the length of the trip
const submitButton = document.getElementById("submit");
submitButton.addEventListener("click", setTime);

//When user submits button, call the three APIs in succession
submitButton.addEventListener("click", performAction);
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
      return geoArray;
    })
    .then(async function(geoArray) {
      //using REST Countries API to give some information about the country
      const countryData = await getData(
        `https://restcountries.eu/rest/v2/alpha/${geoArray[2]}`
      );
      const countryInfo = document.createElement("div");
      countryInfo.setAttribute("id", "countryInfo");
      const countryArray = [
        "Country Language: " + countryData.languages[0].name,
        "Country Language Native Name: " + countryData.languages[0].nativeName,
        "Country Native Name: " + countryData.nativeName,
        "Country Population: " + countryData.population
      ];
      for (let i = 0; i < countryArray.length; i++) {
        const x = document.createTextNode(`${countryArray[i]}`);
        countryInfo.appendChild(x);
        countryInfo.appendChild(document.createElement("br"));
      }
      const countryFlag = document.createElement("img");
      countryFlag.src = `${countryData.flag}`;
      countryInfo.appendChild(countryFlag);
      document.body.appendChild(countryInfo);
    })
    //Calling the Pixabay API and adding content directly to page
    .then(async () => {
      postToPixa("http://localhost:8000/pixaApi", { placeName });
    })
    //Calling the Weatherbit API and adding to page
    .then(async () => {
      const geoArray = await getData("http://localhost:8000/postData");
      //This is an extra feature to let the user think about the length of
      //their trip
      const lat = geoArray[0].latitude;
      const lng = geoArray[0].longitude;
      postToWb("http://localhost:8000/wbApi", { lat, lng });
    })
    .then(addList())
    .then(addFlight());
}

//Calculating length of trip and displaying on page
function setTime() {
  const placeName = document.getElementById("locName").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const currentDate = new Date();
  //convert to Unix
  const startStamp = new Date(startDate).getTime() / 1000;
  const endStamp = new Date(endDate).getTime() / 1000;
  const currentStamp = currentDate / 1000;
  const unixDiff = endStamp - startStamp;
  //Convert unix to days
  const tripLength = unixDiff / 86400;
  displayLength(tripLength);
  const departDate = Math.ceil((startStamp - currentStamp) / 86400);
  displayCountdown(placeName, departDate);
  return tripLength;
}

//Adding the option to delete a trip using the Remove Trip button
const removeButton = document.getElementById("remove");
removeButton.addEventListener("click", removeTrip, false);
function removeTrip() {
  const weatherMsg = document.getElementById("weatherMsg");
  const lengthMsg = document.getElementById("lengthMsg");
  const countdownMsg = document.getElementById("countdownMsg");
  const image = document.getElementById("placePic");
  const logo = document.getElementById("logo");
  const flightMsg = document.getElementById("flightBox");
  const listBox = document.getElementById("listBox");
  const countryInfo = document.getElementById("countryInfo");
  lengthMsg.parentNode.removeChild(lengthMsg);
  countdownMsg.parentNode.removeChild(countdownMsg);
  weatherMsg.parentNode.removeChild(weatherMsg);
  image.parentNode.removeChild(image);
  logo.parentNode.removeChild(logo);
  flightMsg.parentNode.removeChild(flightMsg);
  listBox.parentNode.removeChild(listBox);
  countryInfo.parentNode.removeChild(countryInfo);
}
//Show how far away the trip is
function displayCountdown(x, y) {
  const countdownMsg = document.createElement("div");
  countdownMsg.setAttribute("id", "countdownMsg");
  countdownMsg.innerHTML = x + " is " + y + " days away.";
  document.body.appendChild(countdownMsg);
}

//Let the user create their own to do list for a trip
function addList() {
  const box = document.createElement("div");
  box.setAttribute("id", "listBox");
  const listHeading = document.createElement("h3");
  listHeading.innerHTML = "To Do List: ";
  const list = document.createElement("ul");
  const listInput = document.createElement("INPUT");
  listInput.setAttribute("type", "text");
  const inputLabel = document.createElement("label");
  inputLabel.innerHTML = "Add a new item to list:";
  const listButton = document.createElement("button");
  listButton.innerHTML = "Add";
  box.appendChild(listHeading);
  box.appendChild(inputLabel);
  box.appendChild(listInput);
  box.appendChild(listButton);
  box.appendChild(list);
  listButton.addEventListener("click", addItem, false);
  function addItem() {
    const li = document.createElement("li");
    li.innerHTML = listInput.value;
    box.appendChild(li);
  }
  document.body.appendChild(box);
}

//Let the user add flight information to the trip
function addFlight() {
  const box2 = document.createElement("div");
  box2.setAttribute("id", "flightBox");
  const flightHeading = document.createElement("h3");
  flightHeading.innerHTML = "Flight Info: ";
  const flightInput = document.createElement("INPUT");
  flightInput.setAttribute("type", "text");
  const inputLabel2 = document.createElement("label");
  inputLabel2.innerHTML = "Add flight information:";
  const flightButton = document.createElement("button");
  flightButton.innerHTML = "Add Flight";
  box2.appendChild(flightHeading);
  box2.appendChild(inputLabel2);
  box2.appendChild(flightInput);
  box2.appendChild(flightButton);
  flightButton.addEventListener("click", addFlight, false);
  function addFlight() {
    const flightText = document.createElement("div");
    flightText.innerHTML = flightInput.value;
    box2.appendChild(flightText);
  }
  document.body.appendChild(box2);
}
