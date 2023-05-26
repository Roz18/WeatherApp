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
        $("#curentTemp").text(`${temperature}°C`);
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
