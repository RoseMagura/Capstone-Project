import './styles/styles.scss';
require("regenerator-runtime/runtime");

//Declaring the different parts of the URL for the Geonames API
const geoBaseUrl = 'http://api.geonames.org/findNearbyPostalCodesJSON?placename=';
const geoEndUrl = '&username=';
const username = 'magurarm';

//Declaring the different parts of the URL for the Weatherbit API
const wbBaseUrl = 'http://api.weatherbit.io/v2.0/forecast/daily';
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


const submitButton = document.getElementById('submit');
submitButton.addEventListener('click', performAction, false);
function performAction(e){
  e.preventDefault();
  const placeName = document.getElementById('locName').value;
  const query = '&q=' + placeName + '&image_type=photo';
  console.log(placeName + ' submitted!');
  getGeoData(geoBaseUrl + placeName + geoEndUrl + username)
    .then(async()=>{
      const geoArray = await getGeoData(geoBaseUrl + placeName + geoEndUrl + username)
      return geoArray;
    })
    .then(function(geoArray){
      postData('http://localhost:8000/postData', {
      latitude: geoArray[0],
      longitude: geoArray[1],
      country: geoArray[2]
  }
);})
  .then(async()=>{
    const results = await getData(pixaBaseUrl + pixaApiKey + query);
    const values = Object.values(results);
    const image = document.createElement('img');
    image.src = `${values[2][0].largeImageURL}`;
    image.width = 400; //Edit later?
    image.height = 400;
    document.body.appendChild(image);
  })

}
