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
  const weatherMsg = document.createElement("TABLE");
  const row = [];
  const cell = [];
  weatherMsg.setAttribute("id", "weatherMsg");
  for (let i = 0; i < 4; i++){
    row[i] = weatherMsg.insertRow(i);
    row[i].setAttribute("id", `${i}`);
    for (let y = 0; y < 4; y++){
      cell[y] = row[i].insertCell(y);
      cell[y].setAttribute("id", `${i}${y}`);
    }
  };
  const heading = weatherMsg.getElementsByTagName("td")[0];
  heading.innerHTML = "Weather Forecast";

  document.getElementById('01').innerHTML = "Weather";
  // weatherMsg.getElementsByTagName("td")[1].innerHTML = "Weather";
  weatherMsg.getElementsByTagName("td")[2].innerHTML = "High Temp";
  weatherMsg.getElementsByTagName("td")[3].innerHTML = "Low Temp";

  weatherMsg.getElementsByTagName("td")[4].innerHTML = "Day 1";
  weatherMsg.getElementsByTagName("td")[8].innerHTML = "Day 2";
  weatherMsg.getElementsByTagName("td")[12].innerHTML = "Day 3";

  weatherMsg.getElementsByTagName("td")[5].innerHTML = x[0][0];
  //Refactor with loops?
  weatherMsg.getElementsByTagName("td")[6].innerHTML = x[0][1];
  weatherMsg.getElementsByTagName("td")[7].innerHTML = x[0][2];
  weatherMsg.getElementsByTagName("td")[9].innerHTML = x[1][0];
  weatherMsg.getElementsByTagName("td")[10].innerHTML = x[1][1];
  weatherMsg.getElementsByTagName("td")[11].innerHTML = x[1][2];
  weatherMsg.getElementsByTagName("td")[13].innerHTML = x[2][0];
  weatherMsg.getElementsByTagName("td")[14].innerHTML = x[2][1];
  weatherMsg.getElementsByTagName("td")[15].innerHTML = x[2][2];
  document.body.appendChild(weatherMsg);
}



export { displayLength, displayWeather };
