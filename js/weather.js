/* ============================================
   WEATHER PAGE JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('cityInput')) return;
    
    const WeatherApp = {
        apiKey: '', // OpenWeatherMap API key (optional - using Open-Meteo if empty)
        currentCity: localStorage.getItem('weatherCity') || 'Hanoi',
        favoriteCities: JSON.parse(localStorage.getItem('favoriteCities') || '["Hanoi", "Ho Chi Minh City", "Da Nang"]'),
        
        init() {
            this.bindEvents();
            this.renderFavorites();
            this.loadWeather(this.currentCity);
            this.updateDate();
        },
        
        bindEvents() {
            document.getElementById('searchBtn').addEventListener('click', () => {
                const city = document.getElementById('cityInput').value.trim();
                if (city) {
                    this.loadWeather(city);
                }
            });
            
            document.getElementById('cityInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const city = document.getElementById('cityInput').value.trim();
                    if (city) {
                        this.loadWeather(city);
                    }
                }
            });
            
            document.getElementById('locationBtn').addEventListener('click', () => {
                this.getLocation();
            });
        },
        
        updateDate() {
            const dateEl = document.getElementById('currentDate');
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateEl.textContent = now.toLocaleDateString('vi-VN', options);
        },
        
        getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.loadWeatherByCoords(position.coords.latitude, position.coords.longitude);
                    },
                    (error) => {
                        alert('Không thể lấy vị trí. Vui lòng cho phép truy cập vị trí hoặc nhập tên thành phố.');
                        console.error('Geolocation error:', error);
                    }
                );
            } else {
                alert('Trình duyệt không hỗ trợ geolocation.');
            }
        },
        
        async loadWeatherByCoords(lat, lon) {
            try {
                // Get city name from coordinates
                const geoUrl = `https://api.open-meteo.com/v1/search?latitude=${lat}&longitude=${lon}&count=1`;
                
                const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
                
                const response = await fetch(weatherUrl);
                const data = await response.json();
                
                // Get city name from reverse geocoding
                const cityResponse = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=vi`);
                const cityData = await cityResponse.json();
                const cityName = cityData.city || cityData.locality || 'Vị trí của bạn';
                
                this.displayWeather({
                    location: `${cityName}`,
                    current: data.current,
                    daily: data.daily
                });
                
            } catch (error) {
                console.error('Weather fetch error:', error);
                alert('Không thể lấy thông tin thời tiết. Vui lòng thử lại sau.');
            }
        },
        
        async loadWeather(city) {
            try {
                this.currentCity = city;
                localStorage.setItem('weatherCity', city);
                
                // Using Open-Meteo API (free, no API key needed)
                const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=vi&format=json`;
                
                const geoResponse = await fetch(geocodingUrl);
                const geoData = await geoResponse.json();
                
                if (!geoData.results || geoData.results.length === 0) {
                    throw new Error('Không tìm thấy thành phố');
                }
                
                const { latitude, longitude, name, country } = geoData.results[0];
                
                const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
                
                const weatherResponse = await fetch(weatherUrl);
                const weatherData = await weatherResponse.json();
                
                this.displayWeather({
                    location: `${name}, ${country}`,
                    current: weatherData.current,
                    daily: weatherData.daily
                });
                
            } catch (error) {
                console.error('Weather fetch error:', error);
                alert('Không thể tìm thấy thành phố. Vui lòng thử lại với tên khác.');
            }
        },
        
        displayWeather(data) {
            // Update current weather
            document.getElementById('cityName').textContent = data.location;
            document.getElementById('temperature').textContent = `${Math.round(data.current.temperature_2m)}°`;
            document.getElementById('weatherDesc').textContent = this.getWeatherDesc(data.current.weather_code);
            document.getElementById('feelsLike').textContent = `Cảm giác như ${Math.round(data.current.apparent_temperature)}°`;
            document.getElementById('humidity').textContent = `${data.current.relative_humidity_2m}%`;
            document.getElementById('windSpeed').textContent = `${data.current.wind_speed_10m} km/h`;
            document.getElementById('pressure').textContent = `${data.current.pressure_msl} hPa`;
            document.getElementById('visibility').textContent = data.current.visibility ? `${(data.current.visibility / 1000).toFixed(1)} km` : 'N/A';
            document.getElementById('weatherIcon').textContent = this.getWeatherIcon(data.current.weather_code);
            
            // Update forecast
            this.displayForecast(data.daily);
        },
        
        displayForecast(daily) {
            const container = document.getElementById('forecastContainer');
            const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
            
            let html = '';
            for (let i = 0; i < 7 && i < daily.time.length; i++) {
                const date = new Date(daily.time[i]);
                const dayName = i === 0 ? 'Hôm nay' : days[date.getDay()];
                const maxTemp = Math.round(daily.temperature_2m_max[i]);
                const minTemp = Math.round(daily.temperature_2m_min[i]);
                const icon = this.getWeatherIcon(daily.weather_code[i]);
                
                html += `
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                        <p class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">${dayName}</p>
                        <div class="text-3xl mb-2">${icon}</div>
                        <p class="text-lg font-semibold text-gray-800 dark:text-white">${maxTemp}°</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${minTemp}°</p>
                    </div>
                `;
            }
            
            container.innerHTML = html;
        },
        
        getWeatherIcon(code) {
            const icons = {
                0: '☀️', // Clear sky
                1: '🌤️', // Mainly clear
                2: '⛅', // Partly cloudy
                3: '☁️', // Overcast
                45: '🌫️', // Foggy
                48: '🌫️', // Depositing rime fog
                51: '🌦️', // Light drizzle
                53: '🌧️', // Moderate drizzle
                55: '🌧️', // Dense drizzle
                61: '🌧️', // Slight rain
                63: '🌧️', // Moderate rain
                65: '🌧️', // Heavy rain
                71: '🌨️', // Slight snow
                73: '🌨️', // Moderate snow
                75: '🌨️', // Heavy snow
                77: '🌨️', // Snow grains
                80: '🌦️', // Slight rain showers
                81: '🌧️', // Moderate rain showers
                82: '🌧️', // Violent rain showers
                85: '🌨️', // Slight snow showers
                86: '🌨️', // Heavy snow showers
                95: '⛈️', // Thunderstorm
                96: '⛈️', // Thunderstorm with hail
                99: '⛈️'  // Heavy thunderstorm with hail
            };
            return icons[code] || '🌡️';
        },
        
        getWeatherDesc(code) {
            const descs = {
                0: 'Trời quang',
                1: 'Chủ yếu quang',
                2: 'Có mây',
                3: 'U ám',
                45: 'Sương mù',
                48: 'Sương mù đặc',
                51: 'Mưa phùn nhẹ',
                53: 'Mưa phùn',
                55: 'Mưa phùn nặng',
                61: 'Mưa nhẹ',
                63: 'Mưa vừa',
                65: 'Mưa to',
                71: 'Tuyết nhẹ',
                73: 'Tuyết vừa',
                75: 'Tuyết nặng',
                77: 'Tuyết rơi',
                80: 'Mưa rào nhẹ',
                81: 'Mưa rào',
                82: 'Mưa rào nặng',
                85: 'Mưa tuyết nhẹ',
                86: 'Mưa tuyết nặng',
                95: 'Dông',
                96: 'Dông có mưa đá',
                99: 'Dông nặng'
            };
            return descs[code] || 'Không xác định';
        },
        
        renderFavorites() {
            const container = document.getElementById('favoriteCities');
            let html = '<span class="text-sm text-gray-600 dark:text-gray-400 mr-2">Thành phố yêu thích:</span>';
            
            this.favoriteCities.forEach(city => {
                html += `
                    <button onclick="weatherApp.loadWeather('${city}')" 
                        class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                        ${city === 'Hanoi' ? 'Hà Nội' : city === 'Ho Chi Minh City' ? 'TP.HCM' : city}
                    </button>
                `;
            });
            
            html += `
                <button onclick="weatherApp.addCurrentToFavorites()" 
                    class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                    + Thêm
                </button>
            `;
            
            container.innerHTML = html;
        },
        
        addCurrentToFavorites() {
            if (!this.favoriteCities.includes(this.currentCity)) {
                this.favoriteCities.push(this.currentCity);
                if (this.favoriteCities.length > 5) {
                    this.favoriteCities.shift();
                }
                localStorage.setItem('favoriteCities', JSON.stringify(this.favoriteCities));
                this.renderFavorites();
            }
        }
    };
    
    window.weatherApp = WeatherApp;
    WeatherApp.init();
});
