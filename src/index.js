$(document).ready(function () {
  $("#cityForm").submit(function (e) {
    e.preventDefault();
    var city = $("#cityInput").val();
    $("#cityHeading").text(city);
    $("#searchForm").collapse("hide");

    let key = "f9b7c5ede19bfdb8a31cd3fd5868d6fe";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;

    axios
      .get(url)
      .then(function (response) {
        let temperature = Math.round(response.data.main.temp);
        console.log("#curentTemp:", temperature);

        $("#curentTemp").text(`${temperature}°C`);
        getCurrentCity(response);
        sevenDayForecast(city);
      })
      .catch(function (error) {
        console.log("Error:", error);
      });
  });

  $("#cityHeading").click(function (e) {
    e.preventDefault();
    $("#searchForm").collapse("toggle");
  });

  function searchCity(response) {
    let city = response.name;
    let cityHeadingElemen = document.querySelector("#cityHeading");

    cityHeadingElemen.innerHTML = city;
  }
  function getForecast(coordinates) {
    let apiKey = "f9b7c5ede19bfdb8a31cd3fd5868d6fe";
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric&`;
    axios.get(apiUrl).then(displayForecast);
  }

  function getCurrentCity(response) {
    let lowHighElement = document.querySelector("#lowHigh");
    let cityElement = document.querySelector("#cityHeading");
    let descriptionElement = document.querySelector("#description");
    let humidityElement = document.querySelector("#humidity");
    let windElement = document.querySelector("#wind");
    let iconElement = document.querySelector("#icon");

    let lowTemperature = Math.round(response.data.main.temp_min);
    let highTemperature = Math.round(response.data.main.temp_max);
    lowHighElement.innerHTML = `Today ${lowTemperature}°C/${highTemperature}°C`;

    cityElement.innerHTML = response.data.name;
    descriptionElement.innerHTML = response.data.weather[0].description;
    humidityElement.innerHTML =
      "Humidity:  " + response.data.main.humidity + "%";
    windElement.innerHTML =
      "Wind Speed:  " + Math.round(response.data.wind.speed * 3.6) + "km/h";
    iconElement.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`
    );
    iconElement.setAttribute("alt", response.data.weather[0].description);

    getCurrentCity(response.data.coord);
  }

  function getWeekday() {
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let now = new Date();
    let dayNow = days[now.getDay()];
    return dayNow;
  }

  function getTime() {
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    return `${hours}:${minutes}`;
  }

  function updateDateTime() {
    let dayNow = getWeekday();
    let timeNow = getTime();
    $("#dayNow").text(`${dayNow}`);
    $("#timeNow").text(`${timeNow}`);
  }

  updateDateTime();

  setInterval(updateDateTime, 1000);
});

function sevenDayForecast(city) {
  let cnt = 7;
  let key = "f9b7c5ede19bfdb8a31cd3fd5868d6fe";
  let url = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=${cnt}&appid=${key}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const weatherData = data.list.map((day) => {
        return {
          day: getWeekday(day.dt),
          temp: `${Math.round(day.temp.max)}°C/${Math.round(day.temp.min)}°C`,
          emoji: getEmoji(day.weather[0].id),
        };
      });

      updateWeatherForecast(weatherData);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
  console.log(sevenDayForecast);
}

function updateWeatherForecast(weatherData) {
  const forecastElements = document.querySelectorAll("#weatherForecast .day");
  const tempElements = document.querySelectorAll("#weatherForecast .temp");
  const emojiElements = document.querySelectorAll("#weatherForecast .emoji");

  for (let i = 0; i < weatherData.length; i++) {
    const weather = weatherData[i];
    const forecastElement = forecastElements[i];
    const tempElement = tempElements[i];
    const emojiElement = emojiElements[i];

    forecastElement.textContent = weather.day;
    tempElement.textContent = weather.temp;
    emojiElement.textContent = weather.emoji;
  }
}

function getWeekday(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let weekday = days[date.getDay()];
  return weekday;
}

function getEmoji(weatherCode) {}
