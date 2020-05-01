//Displaying the length of the trip on the main page, not just in the console
function displayLength(x) {
  const lengthMsg = document.createElement("div");
  lengthMsg.setAttribute("id", "lengthMsg");
  lengthMsg.innerHTML = "You are planning a " + x + " day long trip!";
  document.body.appendChild(lengthMsg);
}

function displayCountdown(x, y) {
  const countdownMsg = document.createElement("div");
  countdownMsg.setAttribute("id", "countdownMsg");
  countdownMsg.innerHTML = x + " is " + y + " days away.";
  document.body.appendChild(countdownMsg);
}

//Displaying the weather data of the trip on the main page,
//not just in the console
function displayWeather(x) {
  const weatherMsg = document.createElement("div");
  weatherMsg.setAttribute("id", "weatherMsg");
  weatherMsg.innerHTML =
    "The weather will be: " +
    x[0] +
    "\nHigh Temp: " +
    x[1] +
    "\nLow Temp: " +
    x[2];
  document.body.appendChild(weatherMsg);
}

export { displayLength, displayWeather };
