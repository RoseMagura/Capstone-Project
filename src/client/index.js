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
}
