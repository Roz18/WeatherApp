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
        console.log("#currentTemp:", temperature);

        $("#currentTemp").text(`${temperature}°C`);
        getSearchCity(response);
        getWeatherForecast(city);
      })
      .catch(function (error) {
        console.log("Error:", error);
      });
  });
});

$("#cityHeading").click(function (e) {
  e.preventDefault();
  $("#searchForm").collapse("toggle");
});

function currentCity(response) {
  let city = response.name;
  let cityHeadingElement = document.querySelector("#cityHeading");

  cityHeadingElement.innerHTML = city;
}

function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        let apiKey = "f9b7c5ede19bfdb8a31cd3fd5868d6fe";
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        axios
          .get(url)
          .then(function (response) {
            let city = response.data.name;
            $("#cityHeading").text(city);

            getSearchCity(response);
          })
          .catch(function (error) {
            console.log("Error:", error);
          });
      },
      function (error) {
        console.log("Error:", error);
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

getCurrentLocation();

function getForcats(coordinates) {
  console.log(coordinates);
}

function getSearchCity(response) {
  let lowHighElement = document.querySelector("#lowHigh");
  let temperatureElement = document.querySelector("#currentTemp");
  let cityElement = document.querySelector("#cityHeading");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let iconElement = document.querySelector("#icon");

  if (response && response.data && response.data.main) {
    let lowTemperature = Math.round(response.data.main.temp_min);
    let highTemperature = Math.round(response.data.main.temp_max);
    lowHighElement.innerHTML = `Today ${lowTemperature}°C/${highTemperature}°C`;

    let celsiusTemperature = Math.round(response.data.main.temp);
    temperatureElement.innerHTML = `${celsiusTemperature}°C`;
    cityElement.innerHTML = response.data.name;
    descriptionElement.innerHTML = response.data.weather[0].description;
    humidityElement.innerHTML =
      "Humidity: " + response.data.main.humidity + "%";
    windElement.innerHTML =
      "Wind speed: " + Math.round(response.data.wind.speed * 3.6) + "km/h";
    iconElement.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`
    );
    iconElement.setAttribute("alt", response.data.weather[0].description);
    getForcats(response.data.coord);
  }
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

setInterval(updateDateTime);
function getWeatherForecast(city) {
  let key = "f9b7c5ede19bfdb8a31cd3fd5868d6fe";
  let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&units=metric`;

  axios
    .get(url)
    .then(function (response) {
      let forecastData = response.data.list.slice(0, 7).map((item) => {
        return {
          day: getWeekday(item.dt),
          temp: Math.round(item.main.temp),
          emoji: item.weather[0].icon,
        };
      });

      updateWeatherForecast(forecastData);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

function updateWeatherForecast(forecastData) {
  let forecastElements = document.querySelectorAll("#dayForecats .day");
  let tempElements = document.querySelectorAll("#dayForecats .temp");
  let emojiElements = document.querySelectorAll("#dayForecats .emoji");

  for (let i = 0; i < forecastData.length; i++) {
    let weather = forecastData[i];
    let forecastElement = forecastElements[i];
    let tempElement = tempElements[i];
    let emojiElement = emojiElements[i];

    forecastElement.textContent = weather.day;
    tempElement.textContent = weather.temp;
    emojiElement.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather.emoji}.png">`;
  }
}

function getWeekday(dt) {
  let date = new Date(dt * 1000);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let dayIndex = date.getDay();
  return days[dayIndex];
}

// -- vanila weathe w7 06'51--//
