const apiKey = "9af1ed3d75d5481ff2bf73f1d97bf859"; // Your OpenWeatherMap API key

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherDisplay = document.getElementById("weatherDisplay");
const errorMsg = document.getElementById("errorMsg");
const loader = document.getElementById("loader");
const unitSwitch = document.getElementById("unitSwitch");
const themeSwitch = document.getElementById("themeSwitch");

let isFahrenheit = false;

// Event Listeners
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

unitSwitch.addEventListener("change", () => {
  isFahrenheit = unitSwitch.checked;
  const city = document.getElementById("cityCountry")?.dataset?.city;
  if (city) fetchWeather(city);
});

themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

// Fetch Weather
async function fetchWeather(city) {
  try {
    showLoader();
    const unit = isFahrenheit ? "imperial" : "metric";
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`
    );

    if (!res.ok) throw new Error("City not found");
    const data = await res.json();
    displayWeather(data);
  } catch (err) {
    showError(err.message);
  } finally {
    hideLoader();
  }
}

// Display Weather
function displayWeather(data) {
  errorMsg.classList.add("hidden");
  weatherDisplay.classList.remove("hidden");

  const { name, country, timezone } = data.city;
  const weather = data.list[0]; // Closest current forecast
  const flagUrl = `https://flagsapi.com/${country}/flat/64.png`;
  const cityCountry = document.getElementById("cityCountry");

  cityCountry.innerHTML = `${name}, ${country} <img class="flag" src="${flagUrl}" alt="Flag of ${country}">`;
  cityCountry.dataset.city = name;

  const icon = weather.weather[0].icon;
  const desc = weather.weather[0].description;
  const temp = Math.round(weather.main.temp);
  const humidity = weather.main.humidity;
  const wind = weather.wind.speed;
  const localTime = getLocalTime(timezone);

  document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  document.getElementById("weatherIcon").alt = desc;
  document.getElementById("description").textContent = desc;
  document.getElementById("temperature").textContent = `Temperature: ${temp}°${isFahrenheit ? "F" : "C"}`;
  document.getElementById("humidity").textContent = `Humidity: ${humidity}%`;
  document.getElementById("wind").textContent = `Wind: ${wind} ${isFahrenheit ? "mph" : "m/s"}`;
  document.getElementById("localTime").textContent = `Local Time: ${localTime}`;

  displayForecast(data.list);
}

// Display Forecast
function displayForecast(list) {
  const container = document.getElementById("forecastContainer");
  container.innerHTML = "";

  const forecast = list.filter(item => item.dt_txt.includes("12:00:00"));

  forecast.forEach(item => {
    const icon = item.weather[0].icon;
    const date = new Date(item.dt_txt).toLocaleDateString();
    const temp = Math.round(item.main.temp);

    container.innerHTML += `
      <div class="forecast-day">
        <p>${date}</p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="" width="40">
        <p>${temp}°${isFahrenheit ? "F" : "C"}</p>
      </div>
    `;
  });
}

// Helpers
function getLocalTime(offset) {
  const local = new Date(Date.now() + offset * 1000);
  return local.toUTCString().replace("GMT", "");
}

function showLoader() {
  loader.classList.remove("hidden");  
  weatherDisplay.classList.add("hidden");
  errorMsg.classList.add("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
} 

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.remove("hidden");
  weatherDisplay.classList.add("hidden");
}
