import '../css/styles.scss'

const countrySelect = document.querySelector("#countrySelect")
const countryName = document.querySelector("#countryName")
const flag = document.querySelector("#flag")
const countryInfo = document.querySelector("#countryInfo")
const weatherInfo = document.querySelector("#weatherInfo")
const content = document.querySelector("#content")

let map;
let marker;

/**
 * Hämtar alla länder från Rest countries API
 * @async
 * @returns {Promise<Array>} Array med länder.
 */

async function fetchCountries() {
    const response = await fetch (`https://restcountries.com/v3.1/all?fields=name,capital,flags,population,region,languages,latlng`)

    if(!response.ok) {
       throw new Error("Kunde inte hämta länder.");
    }
    return await response.json();
}

/**
 * Fyller dropdown lista med alla länder sorterade alfabetiskt.
 * @param {Array} countries Lista med länder.
 */

function fillDropdown(countries) {
    countries
    .sort((a, b) => a.name.common.localeCompare(b.name.common))
    .forEach((country) => {
        const option = document.createElement("option");
        option.value = country.name.common;
        option.textContent = country.name.common;
        countrySelect.appendChild(option);
    })
}

/**
 * Hämtar ett specifikt land utifrån namn
 * @async
 * @param {string} countryNameValue landets namn
 */

async function fetchCountryByName(countryNameValue) {
    const response = await fetch(
        `https://restcountries.com/v3.1/name/${encodeURIComponent (countryNameValue)}?fullText=true`
    );
    if (!response.ok) {
        throw new Error("Kunde inte hämta landet.")
    }

    const data = await response.json();
    return data [0];
}

/**
 * Startar funktionen
 */
async function init() {
    try {
        const countries = await fetchCountries();
        fillDropdown(countries);
    }catch (error) {
        console.error(error);
    }
}

init();

/**
 * Hämtar väder från Open-Meteo baserat på latitud och longitud.
 * @async
 * @param {number} lat latitud
 * @param {number} lon longitud
 * @returns {promise<Object>} väderdata.
 */

async function fetchWeather(lat, lon) {
    const response = await fetch (`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code`);

        if(!response.ok) {
            throw new Error("Kunde inte hämtra väderdata.")
        }
        return await response.json();
}

function getWeatherText(code) {
    if (code === 0) return "Klart";
    if ([1, 2, 3].includes(code)) return "Molnigt";
    if ([45, 48].includes(code)) return "Dimma";
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "Regn";
    if ([71, 73, 75, 85, 86].includes(code)) return "Snö";
    if ([95, 96, 99].includes(code)) return "Åska";
    return "Okänt väder";
}


/**
 * Skriver ut väderinformation på sidan.
 * @param {Object} weatherData väderdata från Open-Meteo
 */

function renderWeather(weatherData) {
    const current = weatherData.current;

    weatherInfo.innerHTML = ` <p><strong>Temperatur:</strong> ${current.temperature_2m} °C </p>
    <p><strong>Vind:</strong> ${current.wind_speed_10km} km/h</p>
    <p><strong>Väder:</strong> ${getWeatherText(current.weather_code)} </p>`;
}

