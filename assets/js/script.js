
// Grabbing the API! Declaring global variables. 

var weatherAPIRootUrl = "https://api.openweathermap.org"
var weatherAPIKey = "9f568b68435686417139132a44d427c1"
var searchHistory = []

// Grabbing the DOM elements

var searchForm = document.querySelector("#search-form");
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

function renderForcast(dailyForecast) {

    var startDt = dayjs().add(1, "day").startOf("day").unix();
    var endDt = dayjs().add(6, "day").startOf("day").unix();

    var headingCol = document.createElement("div");
    var heading = document.createElement("h4");

    headingCol.setAttribute("class", "col-12");
    heading.textContent = "5-Day Forecast:";
    headingCol.append(heading);

    forecastContainer.innerHTML = " ";
    forecastContainer.append(headingCol);

    for (var i = 0; i < dailyForecast.length; i++) {

        if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {

            if (dailyForecast[i].dt_txt.slice(11, 13) == "12") {
                renderForecastCard(dailyForecast[i]);
            }

        }
    }

}

function renderItems(city, data) {
    renderCurrentWeather(city, data.list[0], data.city.timezone);
    renderForcast(data.list);
}


function getCords(search) {

    // console logging the event in order to determine where the value of the search field is stored. 

    // event.preventDefault();
    // console.log(event)
    // console.log(event.target[0].value);

    // var search = event.target[0].value
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
            appendToHistory(search);
            fetchWeather(data[0]);
        }
    })
    .catch(function (err){
        console.error(err);
    });
}

function fetchWeather(location) {
    
    var { lat } = location;
    var { lon } = location;
    var city = location.name;

    var apiUrl = `${weatherAPIRootUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherAPIKey}`

    fetch(apiUrl)
    .then(function (res) {
        return res.json();
    })
    .then (function (data) {
        renderItems(city, data);
    })
    .catch(function (err) {
        console.error(err);
    });
}

function handleSearchFormSubmit(e) {
    if(!searchInput.value) {
        return;
    }

    e.preventDefault();
    var search = searchInput.value.trim();
    getCords(search);
    searchInput.value = " ";
}

function handleSearchHistoryClick(e) {
    // ensures that the search won't fire if button isn't a history button. 
    if (!e.target.matches(".btn-history")) {
        return;
    }
    
    var btn = e.target;
    var search = btn.getAttribute("data-search");
    getCords(search);
}

initSearchHistory();
searchForm.addEventListener("submit", handleSearchFormSubmit);
searchHistoryContainer.addEventListener("click", handleSearchHistoryClick);


// searchForm.addEventListener("submit", getCords);




// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the the wind speed
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city