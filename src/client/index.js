import './styles/styles.scss';
require("regenerator-runtime/runtime");

//Declaring the base URL for the Geonames API
const geoBaseUrl = 'http://api.geonames.org/findNearbyPostalCodesJSON?placename=';
const geoEndUrl = '&username=';
const username = 'magurarm';

//Set up Get Request
const getGeoData = async(url = '')=>{
  const res = await fetch(url)
  try{
    const newData = await res.json();
    const postalCodes = Object.keys(newData);
    console.log(newData[postalCodes][0]);
    console.log('Longitude: ' + newData[postalCodes][0].lng);
    console.log('Latitude: ' + newData[postalCodes][0].lat);
    console.log('Country: ' + newData[postalCodes][0].countryCode);
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
  console.log(placeName + ' submitted!');
  getGeoData(geoBaseUrl + placeName + geoEndUrl + username);
}
