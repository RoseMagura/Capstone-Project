//Displaying the length of the trip on the main page, not just in the console
function displayLength(x) {
  const lengthMsg = document.createElement("div");
  lengthMsg.setAttribute("id", "lengthMsg");
  lengthMsg.innerHTML = "You are planning a " + x + " day long trip!";
  document.body.appendChild(lengthMsg);
  return lengthMsg.innerHTML;
}

//Adding the number of days before the trip to the body
function displayCountdown(x, y) {
  const countdownMsg = document.createElement("div");
  countdownMsg.setAttribute("id", "countdownMsg");
  countdownMsg.innerHTML = x + " is " + y + " days away.";
  document.body.appendChild(countdownMsg);
}

//Displaying the weather data of the trip on the main page,
//not just in the console
function displayWeather(x) {
  const weatherMsg = document.createElement("TABLE");
  const cells = new Array();
  const row = [];
  const cell = [];
  weatherMsg.setAttribute("id", "weatherMsg");
  for (let i = 0; i < 4; i++) {
    cells[i] = new Array();
    row[i] = weatherMsg.insertRow(i);
    row[i].setAttribute("id", `${i}`);
    for (let y = 0; y < 4; y++) {
      cell[y] = row[i].insertCell(y);
      cell[y].setAttribute("id", `${i}${y}`);
      cells[i].push(cell[y]);
    }
  }
  //Set unique headings that can't be done in a loop
  cells[0][0].innerHTML = "Weather Forecast";
  cells[0][1].innerHTML = "Weather Type";
  cells[0][2].innerHTML = "High Temp (\u00B0 C)";
  cells[0][3].innerHTML = "Low Temp (\u00B0 C)";
  //Once unique text has been created, add the rest of the data using a loop
  for (let z = 0; z < 3; z++) {
    cells[z + 1][0].innerHTML = `Day ${z + 1}`;
    for (let y = 0; y < 3; y++) {
      //Note: x is the argument passed to displayWeather, and in this case
      //is the weatherArray defined in index.js
      cells[z + 1][y + 1].innerHTML = x[z][y];
    }
  }

  document.body.appendChild(weatherMsg);
}

export { displayLength, displayWeather };
