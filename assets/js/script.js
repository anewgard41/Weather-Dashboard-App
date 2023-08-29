
// Grabbing the API! Declaring global variables. 

var weatherAPIRootUrl = "https://api.openweathermap.org"
var weatherAPI = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}"
var weatherAPIKey = "9f568b68435686417139132a44d427c1"
var searchHistory = []

// Grabbing the DOM elements

var searchForm = $("#search-form");
var searchInput = document.querySelector("#search-input");
var searchHistoryContainer = document.querySelector("#history");
var todayContainer = document.querySelector("#today");
var forecastContainer = document.querySelector("#forecast");

// Adding day.JS plugins. 

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

// 
 
console.log('loaded')

function getCords(event) {
    event.preventDefault();
    console.log(event)
    console.log(event.target[0].value);

    var search = event.target[0].value

    var apiUrl = `${weatherAPIRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherAPIKey}`

    fetch(apiUrl)
    .then(function (res) {
        return res.json();
    })
    .then (function (data) {
        console.log(data)
        if (!data[0]) {
            alert("Location not found");
        } else {
            // appendToHistory(search);
            fetchWeather(data[0]);
            fetchCurrent(data[0]);
        }
    })
    .catch(function (err){
        console.error(err);
    });
}

function fetchWeather({lat, lon}) {
    
    var apiUrl = `${weatherAPIRootUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherAPIKey}`

    fetch(apiUrl)
    .then(function (res) {
        return res.json();
    })
    .then (function (data) {
        console.log(data)
    })
}

function fetchCurrent({lat, lon}) {
    
    var apiUrl = `${weatherAPIRootUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherAPIKey}`

    fetch(apiUrl)
    .then(function (res) {
        return res.json();
    })
    .then (function (data) {
        console.log(data)
    })
}

searchForm.on("submit", getCords);




// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the the wind speed
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city