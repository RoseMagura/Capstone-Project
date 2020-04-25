import './styles/styles.scss';

//Declaring the base URL for the Geonames API
const geoBaseUrl = 'api.geonames.org/findNearbyPostalCodes?';
const username = 'magurarm';

//Geo Get Request
const getData = async(url = '')=>{
  const res = await fetch(url)
  try{
    const newData = await response.json();
    console.log(newData);
    return newData;
  }catch(error){
    console.log('error', error);
  }
}

document.getElementById('submit').addEventListener('click', performAction);
function performAction(){
  getData('localhost:8000/getGeoData');
}
