
// Grabbing the API! Declaring global variables. 

var weatherAPIRootUrl = "https://api.openweathermap.org"
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

// Here is the function that creates the search history list

function renderSearchHistory() {
    searchHistoryContainer.innerHTML = " ";
    
    for (var i = searchHistory.length - 1; i >=0; i--) {
        var btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.setAttribute("aria-controls", "today forecast");
        btn.classList.add("history-btn", "btn-history");


        btn.setAttribute("data-search", searchHistory[i]);
        btn.textContent = searchHistory[i];
        searchHistoryContainer.append(btn);
    }
}

 function appendToHistory(search) {

 if (searchHistory.indexOf !== -1) {
    return;
 }
searchHistory.push(search);

localStorage.setItem("search-history", JSON.stringify(searchHistory));
renderSearchHistory();
}

function initSearchHistory() {
    var storedHistory = localStorage.getItem("search-history");
    if (storedHistory) {
        searchHistory = JSON.parse(storedHistory);
    }
    renderSearchHistory();
}

function renderCurrentWeather(city, weather) {
    var date = dayjs().format("M/D/YYYY");

    var tempF = weather.main.temp;
    var windMph = weather.wind.speed;
    var humidity = weather.main.humidity;
    var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`
    var iconDescription = weather.weather[0].description || weather[0].main;

    var card = document.createElement("div");
    var cardBody = document.createElement("div");
    var heading = document.createElement("h2");
    var weatherIcon = document.createElement("img");
    var tempEl = document.createElement("p");
    var windEl = document.createElement("p");
    var humidityEl = document.createElement("p");

    card.setAttribute("class", "card");
    cardBody.setAttribute("class", "card-body");
    card.append(cardBody);

    heading.setAttribute("class", "h3 card-title");
    tempEl.setAttribute("class", "card-text");
    windEl.setAttribute("class", "card-text");
    humidityEl.setAttribute("class", "card-text");



    heading.textContent = `${city} (${date})`;
    weatherIcon.setAttribute("src", iconUrl);
    weatherIcon.setAttribute("alt", iconDescription);
    weatherIcon.setAttribute("class", "weather-img");
    heading.append(weatherIcon);
    tempEl.textContent = `Temp: ${tempF}°F`;
    windEl.textContent = `Wind: ${windMph} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    cardBody.append(heading, tempEl, windEl, humidityEl);

    todayContainer.innerHTML = " ";
    todayContainer.append(card);
}

function renderForecastCard(forecast) {

    var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`
    var iconDescription = forecast.weather[0].description;
    var tempF = forecast.main.temp;
    var humidity = forecast.main.humidity;
    var windMph = forecast.wind.speed;


    var col = document.createElement("div");
    var card = document.createElement("div");
    var cardBody = document.createElement("div");
    var cardTitle = document.createElement("h5");
    var weatherIcon = document.createElement("img");
    var tempEl = document.createElement("p");
    var windEl = document.createElement("p");
    var humidityEl = document.createElement("p");

    col.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

    col.setAttribute("class", "col-md");
    col.classList.add("five-day-card");
    card.setAttribute("class", "card bg-primary h-100 text-white");
    cardBody.setAttribute("class", "card-body p-2");
    cardTitle.setAttribute("class", "card-title");
    tempEl.setAttribute("class", "card-text");
    windEl.setAttribute("class", "card-text");
    humidityEl.setAttribute("class", "card-text");

    cardTitle.textContent = dayjs(forecast.dt_txt).format("M/D/YYYY");
    weatherIcon.setAttribute("src", iconUrl);
    weatherIcon.setAttribute("alt", iconDescription);
    tempEl.textContent = `Temp: ${tempF} °F`;
    windEl.textContent = `Wind: ${windMph} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;

    forecastContainer.append(col);
}

function renderForcast (dailyForecast) {

    
}


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