$(document).ready(function () {
  $("#cityForm").submit(function (e) {
    e.preventDefault();
    var city = $("#cityInput").val();
    $("#cityHeading").text(city);
    $("#searchForm").collapse("hide");

    let key = "f9b7c5ede19bfdb8a31cd3fd5868d6fe";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;

    axios.get(url).then(function (response) {
      let temperature = Math.round(response.data.main.temp);
      console.log("#currentTemp:", temperature);

      $("#currentTemp").text(`${temperature}°C`);
      getSearchCity(response);
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
        let key = "f9b7c5ede19bfdb8a31cd3fd5868d6fe";
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;

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
    windElement.innerHTML = `Wind speed: ${Math.round(
      response.data.wind.speed * 3.6
    )}km/h`;
    iconElement.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`
    );
    iconElement.setAttribute("alt", response.data.weather[0].description);
    getForecasts(response.data.coord);
    return response.data.id;
  }
  return null;
}

function Weekday(dt) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let date = new Date(dt * 1000);
  let dayNow = days[date.getDay()];
  return dayNow;
}

function updateDateTime() {
  let dayNow = Weekday(Date.now() / 1000);
  let timeNow = getTime();
  $("#dayNow").text(`${dayNow}`);
  $("#timeNow").text(`${timeNow}`);
}

function getTime() {
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  return `${hours}:${minutes}`;
}

updateDateTime();
setInterval(updateDateTime, 1000);

function getForecasts(coordinates) {
  let key = "e450bc345a80a08ada69fd5c714d871d";
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${key}&units=metric`;

  axios.get(url).then(function (response) {
    let forecasts = response.data.daily.slice(1, 8);
    updateForecastTable(forecasts);
  });
}

function updateForecastTable(forecasts) {
  let forecastElement = document.querySelector("#dayForecast");

  if (forecastElement) {
    let forecastHTML = `<tbody>`;
    forecasts.forEach(function (forecastDay) {
      let day = Weekday(forecastDay.dt);
      let minTemperature = Math.round(forecastDay.temp.min);
      let maxTemperature = Math.round(forecastDay.temp.max);
      let icon = forecastDay.weather[0].icon;

      forecastHTML += `
        <tr>
          <td class="day">${day}</td>
          <td class="temp">${minTemperature}°C/${maxTemperature}°C</td>
          <td class="emoji">
            <img src="http://openweathermap.org/img/wn/${icon}.png">
          </td>
        </tr>
      `;
    });

    forecastHTML += `</tbody>`;
    forecastElement.innerHTML = forecastHTML;
  } else {
    console.log("Forecast element not found in the DOM");
  }
}
