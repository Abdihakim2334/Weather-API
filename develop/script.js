const apiKey = '9d7bdeddb78891604dbc100a1dce8b3c'; // Replace with your OpenWeather API key
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');
const searchHistoryDiv = document.getElementById('search-history');

function fetchWeather(city) {
    const geocodeUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    
    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            const { lat, lon } = data.coord;
            fetchForecast(lat, lon);
            updateSearchHistory(city);
        })
        .catch(err => console.error(err));
}

function fetchForecast(lat, lon) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            displayForecast(data);
        })
        .catch(err => console.error(err));
}

function displayCurrentWeather(data) {
    const { name, main, wind, weather } = data.list[0];
    const date = new Date(data.list[0].dt * 1000).toLocaleDateString();
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;

    currentWeatherDiv.innerHTML = `
        <h2>${name} (${date})</h2>
        <img src="${iconUrl}" alt="${weather[0].description}">
        <p>Temperature: ${main.temp}°C</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
    `;
}

function displayForecast(data) {
    forecastDiv.innerHTML = '<h3>5-Day Forecast</h3>';
    const forecastItems = data.list.filter(item => item.dt_txt.includes("15:00:00"));
    
    forecastItems.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
        
        forecastDiv.innerHTML += `
            <div class="forecast-card">
                <h4>${date}</h4>
                <img src="${iconUrl}" alt="${item.weather[0].description}">
                <p>Temp: ${item.main.temp}°C</p>
                <p>Wind: ${item.wind.speed} m/s</p>
                <p>Humidity: ${item.main.humidity}%</p>
            </div>
        `;
    });
}

function updateSearchHistory(city) {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        renderSearchHistory();
    }
}

function renderSearchHistory() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistoryDiv.innerHTML = '<h3>Search History</h3>';
    
    searchHistory.forEach(city => {
        const cityElement = document.createElement('div');
        cityElement.textContent = city;
        cityElement.classList.add('city');
        cityElement.addEventListener('click', () => fetchWeather(city));
        searchHistoryDiv.appendChild(cityElement);
    });
}

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();
    fetchWeather(city);
    cityInput.value = '';
});

document.addEventListener('DOMContentLoaded', renderSearchHistory);
