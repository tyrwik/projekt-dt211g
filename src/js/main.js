import '../css/styles.scss'

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