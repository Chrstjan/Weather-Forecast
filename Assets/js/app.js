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
    })
    .catch((error) => {
      console.log("Error fetching data:", error);
      return null;
    });
}
//#endregion model code

//#region controller code
function recivedCoordinates(position) {
  getUserLocation(position.coords.latitude, position.coords.longitude);
}

function coordinatesError(error) {
  console.log(error.message);
}
//#endregion model code

//#region view code

//#endregion view code
