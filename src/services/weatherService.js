const API_KEY = '5a319f3fc0edf91ca28ae601bdce9115'

export async function fetchWeather(city) {
    if (!city.trim()) {
        throw new Error("Введите город")
    }

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&units=metric&lang=ru&appid=${API_KEY}`);
    return await response.json()
}