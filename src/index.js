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
        console.log("Temperature:", temperature);

        $("#curentTemp").text(`${temperature}°C`);
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

  function getCurrentCity() {
    navigator.geolocation.getCurrentPosition(function (position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      let key = "f9b7c5ede19bfdb8a31cd3fd5868d6fe";
      let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          searchCity(data);
          let temperature = Math.round(data.main.temp);
          console.log("Temperature:", temperature);
          $("#curentTemp").text(`${temperature}°C`);
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    });
  }

  getCurrentCity();

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
    let weekday = days[now.getDay()];
    return weekday;
  }

  function getTime() {
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    return `${hours}:${minutes}`;
  }

  function updateDateTime() {
    let weekday = getWeekday();
    let time = getTime();
    $("#weekdayDetails").text(`${weekday} ${time}`);
  }

  updateDateTime();

  setInterval(updateDateTime, 1000);
});

function sevenDayForecast(city) {
  let cnt = 7;
  let key = "32ecda5bta3bd6bc964176affb080o6a";
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
