// Constants
const KELVIN = 273;
const CELCIUS = "celcius";
const FARENHEIT = "farenheit";
const API_KEY = "82da37f128db9f12279062af7ef2bd2c";

// initial value of weather
const weatherInfo = {
  temperature: {
    unit: CELCIUS,
    value: 0
  },
  description: "",
  iconId: "",
  city: "",
  country: ""
}

// Select html elements
const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");

const celsiusToFahrenheit = (temperature) => (Math.floor((temperature * 9/5) + 32));

// adds click event to temperature element to switch between celcius and farenheit
tempElement.addEventListener("click", () => {
  if (weatherInfo.temperature.value === undefined) return;

  if (weatherInfo.temperature.unit === CELCIUS) {
    const tempInFarenheit = celsiusToFahrenheit(weatherInfo.temperature.value);
    tempElement.innerHTML = `${tempInFarenheit}°<span>F</span>`
    weatherInfo.temperature.unit = FARENHEIT;
  } else {
    tempElement.innerHTML = `${weatherInfo.temperature.value}°<span>C</span>`;
    weatherInfo.temperature.unit = CELCIUS;
  }
});

// shows notification error
const showError = (error = { message: "Boom!" }) => {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p>${error.message}</p>`
}

// gets weather from API provider
const getWeather = (lat, lon) => {
  const api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const { name, main: { temp }, weather, sys: { country } } = data;
      weatherInfo.temperature.value = Math.floor(temp - KELVIN);
      weatherInfo.description = weather[0].description;
      weatherInfo.iconId = weather[0].icon;
      weatherInfo.city = name;
      weatherInfo.country = country;
    })
    .then(() => {
      // displays weather
      iconElement.innerHTML = `<img src="icons/${weatherInfo.iconId}.png"/>`;
      tempElement.innerHTML = `${weatherInfo.temperature.value}°<span>C</span>`;
      descElement.innerHTML = weatherInfo.description;
      locationElement.innerHTML = `${weatherInfo.city}, ${weatherInfo.country}`;
    })
    .catch((err) => {
      showError(err);
    });
};

// checks if browser supports geolocation service
window.addEventListener('load', () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      function position(position) { // sets geolocation position of user
        let { coords: { longitude, latitude }} = position;
        getWeather(latitude, longitude);
      },
      showError
    );
  } else {
    showError({ message: "Browser doesn't support Geolocation service!" });
  }
});
