// ======= Theme Toggle =======
const themeSwitch = document.getElementById("themeSwitch");

// Load saved theme on page load
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeSwitch.checked = true;
}

// Toggle dark mode
themeSwitch.addEventListener("change", () => {
  const isDark = themeSwitch.checked;
  if (isDark) {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
});

// ======= Temperature Unit Toggle =======
const unitSwitch = document.getElementById("unitSwitch");
let isFahrenheit = unitSwitch.checked;

unitSwitch.addEventListener("change", () => {
  isFahrenheit = unitSwitch.checked;
  if (currentCity) {
    fetchWeather(currentCity); // refresh with new unit
  }
});

// ======= Weather Search =======
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const currentWeather = document.getElementById("currentWeather");
const forecastContainer = document.getElementById("forecastContainer");
const errorMsg = document.getElementById("errorMsg");

let currentCity = ""; // To remember last searched city

const apiKey = "9af1ed3d75d5481ff2bf73f1d97bf859"; // Replace with your real OpenWeatherMap API key

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city !== "") {
    fetchWeather(city);
  }
});

async function fetchWeather(city) {
  try {
    errorMsg.classList.add("hidden");
    const units = isFahrenheit ? "imperial" : "metric";

    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`
    );
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`
    );

    if (!weatherRes.ok || !forecastRes.ok) {
      throw new Error("City not found");
    }

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    currentCity = city;
    displayCurrentWeather(weatherData);
    displayForecast(forecastData);
  } catch (error) {
    console.error(error);
    errorMsg.classList.remove("hidden");
  }
}

function displayCurrentWeather(data) {
  currentWeather.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon" />
    <p>${data.weather[0].description}</p>
    <p>Temp: ${Math.round(data.main.temp)}° ${isFahrenheit ? "F" : "C"}</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind: ${Math.round(data.wind.speed)} ${isFahrenheit ? "mph" : "m/s"}</p>
  `;
}

function displayForecast(data) {
  forecastContainer.innerHTML = "";

  const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  dailyData.forEach(item => {
    const date = new Date(item.dt_txt);
    forecastContainer.innerHTML += `
      <div>
        <p><strong>${date.toDateString().split(' ')[0]}</strong></p>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="Icon" />
        <p>${Math.round(item.main.temp)}° ${isFahrenheit ? "F" : "C"}</p>
      </div>
    `;
  });
}
