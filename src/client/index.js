import './styles/styles.scss';
require("regenerator-runtime/runtime");

//Declaring the different parts of the URL for the Geonames API
const geoBaseUrl = 'http://api.geonames.org/findNearbyPostalCodesJSON?placename=';
const geoEndUrl = '&username=';
const username = 'magurarm';

//Declaring the different parts of the URL for the Weatherbit API
const wbBaseUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?';
const wbApiKey = '&key=' + process.env.WB_API_KEY;

//the different parts of the URL for the Pixabay API
const pixaBaseUrl = 'https://pixabay.com/api/?key=';
const pixaApiKey = process.env.PIXA_API_KEY;

//Set up Get Request for Geonames API
const getGeoData = async(url = '')=>{
  const res = await fetch(url)
  try{
    const newData = await res.json();
    const arrayData = Object.values(newData);
    const lat = arrayData[0][0].lat;
    const lng = arrayData[0][0].lng;
    const country = arrayData[0][0].countryCode;
    const geoArray = [lat, lng, country];
    return geoArray;
  }catch(error){
    console.log('error', error);
  }
}

//Just a basic Get Request
const getData = async(url = '')=>{
  const res = await fetch(url)
  try{
    const newData = await res.json();
    return newData;
  }catch(error){
    console.log('error', error);
  }
}

//Set up Post Request
const postData = async(url = '', data = {})=>{
  console.log(data);
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'},
      body: JSON.stringify(data)});
      try{
        const newData = await response.json();
        return newData;
      }catch(error){
        console.log('Error: ', error);
      }
    }

//When user submits button, call the three APIs in succession
const submitButton = document.getElementById('submit');
submitButton.addEventListener('click', performAction, false);
//When user inputs start and end date, calculate the length of the trip
submitButton.addEventListener('click', setTime, false);
function performAction(e){
  e.preventDefault();
  const placeName = document.getElementById('locName').value;
  const query = '&q=' + placeName + '&image_type=photo';
  console.log(placeName + ' submitted!');
  getGeoData(geoBaseUrl + placeName + geoEndUrl + username)
    .then(async()=>{
      const geoArray =
      await getGeoData(geoBaseUrl + placeName + geoEndUrl + username)
      return geoArray;
    })
    .then(function(geoArray){
      postData('http://localhost:8000/postData', {
      latitude: geoArray[0],
      longitude: geoArray[1],
      country: geoArray[2]
  }
);})
  // .then(async()=>{
  //   const results = await getData(pixaBaseUrl + pixaApiKey + query);
  //   const values = Object.values(results);
  //   const image = document.createElement('img');
  //   image.setAttribute('id', 'placePic');
  //   image.src = `${values[2][0].largeImageURL}`;
  //   image.width = 400; //Edit later?
  //   image.height = 400;
  //   document.body.appendChild(image);
  //   const logo = document.createElement('img');
  //   logo.src = 'https://pixabay.com/static/img/logo_square.png';
  //   logo.width = 50;
  //   logo.height = 50;
  //   logo.addEventListener('click', function()
  //   {window.open('https://pixabay.com/','_blank');})
  //   document.body.appendChild(logo);
  // })
  // .then(async()=>{
  //   const geoArray =
  //   await getGeoData(geoBaseUrl + placeName + geoEndUrl + username);
  //   const weather = await getData(wbBaseUrl + '&lat=' + geoArray[0]
  //   + '&lon=' + geoArray[1] + wbApiKey);
  //   console.log(weather);
  // }
  // )
}

//Calculating length of trip and displaying on page
function setTime(){
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  //convert to Unix
  const startStamp = (new Date(startDate).getTime()/1000).toFixed(0);
  const endStamp = (new Date(endDate).getTime()/1000).toFixed(0);
  const unixDiff = endStamp - startStamp;
  //Convert unix to days
  const difference = unixDiff/86400;
  const lengthMsg = document.createElement('div');
  lengthMsg.innerHTML = 'You are planning a ' + difference + ' day long trip!';
  document.body.appendChild(lengthMsg);

}
