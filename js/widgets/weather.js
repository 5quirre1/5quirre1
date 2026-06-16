const WEATHER_ICONS = {
    clear: "sunny.png",
    mostly_clear: "sunny.png",
    partly_cloudy: "cloudy.png",
    cloudy: "clouds.png",
    fog: "foggy.png",
    rain: "rain.png",
    drizzle: "rain-little.png",
    snow: "snow.png",
    thunder: "lightning.png",
    wind: "wind.png",
    clear_night: "moon.png",
    partly_cloudy_night: "moon-half.png",
    cloudy_night: "moon-clouds.png",
    fog_night: "moon-fog.png"
};

function weatherType(code) {
    if (code === 0) return ["clear", "Clear"];
    if (code === 1) return ["mostly_clear", "Mostly clear"];
    if (code === 2) return ["partly_cloudy", "Partly cloudy"];
    if (code === 3) return ["cloudy", "Cloudy"];
    if (code === 45 || code === 48) return ["fog", "Foggy"];
    if (code === 51 || code === 53 || code === 55) return ["drizzle", "Drizzle"];
    if (code === 56 || code === 57) return ["drizzle", "Freezing drizzle"];
    if (code === 61 || code === 63 || code === 65) return ["rain", "Rain"];
    if (code === 66 || code === 67) return ["rain", "Freezing rain"];
    if (code === 71 || code === 73 || code === 75) return ["snow", "Snow"];
    if (code === 77) return ["snow", "Snow grains"];
    if (code === 80 || code === 81 || code === 82) return ["rain", "Rain showers"];
    if (code === 85 || code === 86) return ["snow", "Snow showers"];
    if (code === 95) return ["thunder", "Thunderstorms"];
    if (code === 96 || code === 99) return ["thunder", "Severe thunderstorms"];
    return ["cloudy", "Unknown"];
}

function getIcon(type, isDay) {
    if (isDay) return WEATHER_ICONS[type] || "clouds.png";
    if (type === "clear") return WEATHER_ICONS.clear_night;
    if (type === "mostly_clear" || type === "partly_cloudy") return WEATHER_ICONS.partly_cloudy_night;
    if (type === "cloudy") return WEATHER_ICONS.cloudy_night;
    if (type === "fog") return WEATHER_ICONS.fog_night;
    return WEATHER_ICONS.cloudy_night;
}

async function loadWeather() {
    const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?" +
        "latitude=47.6580&longitude=-117.4235" +
        "&current_weather=true" +
        "&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m" +
        "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
        "&temperature_unit=fahrenheit" +
        "&wind_speed_unit=mph" +
        "&timezone=America%2FLos_Angeles"
    );

    const data = await res.json();

    const current = data.current_weather;

    const [type, text] = weatherType(current.weathercode);
    const isDay = current.is_day === 1;

    const now = new Date(data.current_weather.time).getTime();

    const times = data.hourly.time.map(t => new Date(t).getTime());
    const index = times.findIndex(t => t >= now) || 0;

    const temp = Math.round(data.hourly.temperature_2m[index] ?? current.temperature);

    const feelsLike = Math.round(
        data.hourly.apparent_temperature?.[index] ??
        data.hourly.apparent_temperature?.[index - 1] ??
        temp
    );

    const wind = Math.round(
        data.hourly.wind_speed_10m?.[index] ??
        current.windspeed
    );

    const humidity = Math.round(
        data.hourly.relative_humidity_2m?.[index] ?? 0
    );

    const pop = Math.round(
        data.hourly.precipitation_probability?.[index] ?? 0
    );

    document.getElementById("weather-temp").textContent = `${temp}°F`;

    const weatherDesc =
        `${text} · feels ${feelsLike}° · wind ${wind} mph · ${humidity}% humidity · ${pop}% rain`;

    maybeMarquee(
        document.getElementById("weather-desc"),
        weatherDesc
    );

    document.getElementById("weather-icon").src =
        `assets/widgets/weather/icons/${getIcon(type, isDay)}`;

    const week = document.getElementById("weather-week");
    week.innerHTML = "";

    data.daily.time.forEach((date, i) => {
        const [kind] = weatherType(data.daily.weather_code[i]);
        const isToday = i === 0;

        const [year, month, day] = date.split("-").map(Number);

        const weekday = new Intl.DateTimeFormat("en-US", {
            weekday: "short",
            timeZone: "America/Los_Angeles"
        }).format(new Date(year, month - 1, day, 12));

        week.innerHTML += `
            <div class="weather-day ${isToday ? "today" : ""}">
                <div>${weekday}</div>
                <img src="assets/widgets/weather/icons/${getIcon(kind, true)}">
                <div>${Math.round(data.daily.temperature_2m_max[i])}°</div>
            </div>
        `;
    });
}

loadWeather();