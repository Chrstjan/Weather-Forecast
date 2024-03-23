//GLOBALS
const locationHeader = document.getElementById("location-header");
const app = document.getElementById("app");

//Calling functions
getUserCoordinates();

//#region model code
function getUserCoordinates() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      recivedCoordinates,
      coordinatesError
    );
  } else {
    alert("Geolocation is not supported by this browser");
  }
}

function getUserLocation(lat, long) {
  fetch(
    `https://geocode.maps.co/reverse?lat=${lat}&lon=${long}&api_key=65fbef1c16355178751609wmp6b195b`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((json) => {
      console.log(json);
      saveUserLocation(json);
    })
    .catch((error) => {
      console.log("Error fetching data:", error);
      return null;
    });
}

function getLocalWeatherForecast(lat, long) {
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,is_day,rain,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,rain,temperature_80m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=Europe%2FBerlin`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network was not ok");
      }
      return res.json();
    })
    .then((json) => {
      weatherForecastStructure(json);
    })
    .catch((error) => {
      console.log("Error fetching data:", error);
      return null;
    });
}

function getLocalStorage(key) {
  let localData = localStorage.getItem(key);
  return JSON.parse(localData || "[]");
}

function saveToLocalStorage(key, value) {
  let serializeValue = JSON.stringify(value);
  localStorage.setItem(key, serializeValue);
}
//#endregion model code

//#region controller code
function recivedCoordinates(position) {
  getUserLocation(position.coords.latitude, position.coords.longitude);
  getLocalWeatherForecast(position.coords.latitude, position.coords.longitude);
}

function coordinatesError(error) {
  console.log(error.message);
}

function weatherForecastStructure(weather) {
  console.log(weather);
  const { weekday, month } = convertTime(weather.current.time);

  buildCurrentWeather(weather.current, weekday, month);
}

function convertTime(currentTime) {
  const date = new Date(currentTime);

  // console.log(date);

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const months = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekdayIndex = date.getDay();
  const weekday = weekdays[weekdayIndex];

  // console.log(weekday);
  const monthIndex = date.getMonth();
  const month = months[monthIndex];

  // console.log(month);

  return { weekday, month };
}

function saveUserLocation(userLocation) {
  saveToLocalStorage("userLocation", userLocation.address);

  buildLocationName(userLocation.address);
}
//#endregion controller code

//#region view code
function buildLocationName(locationName) {
  let location = `
    <header class="location-header">
      <h2>${locationName.town}</h2>
      <button class="search-btn">&#128269;</button>
    </header>`;

  locationHeader.innerHTML = location;
}

function buildCurrentWeather(currentWeather, weekday, month) {
  let weatherCard = `
    <div>
      <header>
        <h4>
          ${weekday},
          ${new Date(currentWeather.time).getDate()},
          ${month}
        </h4>
      </header>
      <div class="wind-temp-container">
        <h3>${currentWeather.temperature_2m}<sup>&deg;</sup></h3>
        <div class="wind-container">
          <span>Wind speed: <p>${currentWeather.wind_speed_10m}</p></span>
          <span>Wind direction: <p>${
            currentWeather.wind_direction_10m
          }</p></span>
        </div>
        <h4>${currentWeather.rain}</h4>
      </div>
    </div>`;

  app.innerHTML += weatherCard;
}
//#endregion view code
