/* ============================================
   MAIN JAVASCRIPT - Portal Website
   ============================================ */

// ============================================
// THEME MANAGEMENT
// ============================================
const ThemeManager = {
    init() {
        const themeToggle = document.getElementById('themeToggle');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        }
        
        // Theme toggle
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark');
                const isDark = document.documentElement.classList.contains('dark');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            });
        }
        
        // Mobile menu
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }
};

// ============================================
// CLOCK MANAGEMENT
// ============================================
const ClockManager = {
    update() {
        const clock = document.getElementById('realtimeClock');
        if (clock) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('vi-VN', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            clock.textContent = timeString;
        }
    },
    
    init() {
        this.update();
        setInterval(() => this.update(), 1000);
    }
};

// ============================================
// DATE DISPLAY
// ============================================
const DateManager = {
    weekdays: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
    months: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    
    formatDate(date) {
        const day = date.getDate();
        const month = this.months[date.getMonth()];
        const year = date.getFullYear();
        const weekday = this.weekdays[date.getDay()];
        return `${weekday}, ngày ${day} tháng ${month} năm ${year}`;
    },
    
    formatShortDate(date) {
        const day = date.getDate();
        const month = this.months[date.getMonth()];
        const year = date.getFullYear();
        return { day, month, year: `${month}/${year}` };
    },
    
    updateTodayDisplay() {
        const today = new Date();
        
        // Update main date display
        const todayDateEl = document.getElementById('todayDate');
        if (todayDateEl) {
            todayDateEl.textContent = this.formatDate(today);
        }
        
        // Update mini calendar
        const todayDayEl = document.getElementById('todayDay');
        const todayMonthYearEl = document.getElementById('todayMonthYear');
        if (todayDayEl && todayMonthYearEl) {
            const shortDate = this.formatShortDate(today);
            todayDayEl.textContent = shortDate.day;
            todayMonthYearEl.textContent = `Tháng ${shortDate.monthYear}`;
        }
        
        // Update lunar date
        const todayLunarEl = document.getElementById('todayLunar');
        const lunarDateEl = document.getElementById('lunarDate');
        
        if (typeof LunarCalendar !== 'undefined') {
            const lunar = LunarCalendar.convertSolarToLunar(
                today.getDate(),
                today.getMonth() + 1,
                today.getFullYear()
            );
            
            const lunarText = `ngày ${lunar.day} tháng ${lunar.monthName} năm ${lunar.yearName}`;
            
            if (todayLunarEl) todayLunarEl.textContent = lunarText;
            if (lunarDateEl) lunarDateEl.textContent = `Âm lịch: ${lunarText}`;
        }
    }
};

// ============================================
// COUNTDOWN MANAGER
// ============================================
const CountdownManager = {
    update() {
        const now = new Date();
        
        // Tết countdown
        const tetEl = document.getElementById('tetCountdown');
        if (tetEl && typeof LunarCalendar !== 'undefined') {
            const currentYear = now.getFullYear();
            let tetDate = LunarCalendar.getTetDate(currentYear);
            
            if (tetDate < now) {
                tetDate = LunarCalendar.getTetDate(currentYear + 1);
            }
            
            const diff = tetDate - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            
            tetEl.textContent = `${days} ngày ${hours} giờ`;
        }
        
        // Weekend countdown
        const weekendEl = document.getElementById('weekendCountdown');
        if (weekendEl) {
            const dayOfWeek = now.getDay();
            let daysToWeekend;
            
            if (dayOfWeek === 0) {
                daysToWeekend = 0;
            } else if (dayOfWeek === 6) {
                daysToWeekend = 0;
            } else {
                daysToWeekend = 6 - dayOfWeek;
            }
            
            if (daysToWeekend === 0) {
                weekendEl.textContent = 'Hôm nay!';
            } else {
                weekendEl.textContent = `Còn ${daysToWeekend} ngày`;
            }
        }
    },
    
    init() {
        this.update();
        setInterval(() => this.update(), 60000); // Update every minute
    }
};

// ============================================
// WEATHER WIDGET
// ============================================
const WeatherWidget = {
    async fetchWeather(city = 'Hanoi') {
        try {
            // Using Open-Meteo API (free, no API key needed)
            const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=vi&format=json`;
            const geoResponse = await fetch(geocodingUrl);
            const geoData = await geoResponse.json();
            
            if (!geoData.results || geoData.results.length === 0) {
                throw new Error('City not found');
            }
            
            const { latitude, longitude, name, country } = geoData.results[0];
            
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
            
            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();
            
            return {
                location: `${name}, ${country}`,
                current: weatherData.current,
                daily: weatherData.daily
            };
        } catch (error) {
            console.error('Weather fetch error:', error);
            return this.getDemoWeather();
        }
    },
    
    getDemoWeather() {
        // Demo data for when API fails or for development
        return {
            location: 'Hà Nội, Vietnam',
            current: {
                temperature_2m: 28,
                relative_humidity_2m: 75,
                apparent_temperature: 32,
                weather_code: 1,
                wind_speed_10m: 12,
                pressure_msl: 1012
            },
            daily: {
                time: [],
                temperature_2m_max: [],
                temperature_2m_min: [],
                weather_code: []
            }
        };
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
            95: 'Dông',
            96: 'Dông có mưa đá',
            99: 'Dông nặng'
        };
        return descs[code] || 'Không xác định';
    },
    
    async updateWidget() {
        const widget = document.getElementById('weatherWidget');
        const locationEl = document.getElementById('weatherLocation');
        
        if (!widget) return;
        
        const data = await this.fetchWeather('Hanoi');
        
        if (locationEl) {
            locationEl.textContent = data.location.split(',')[0];
        }
        
        const current = data.current;
        const icon = this.getWeatherIcon(current.weather_code);
        const desc = this.getWeatherDesc(current.weather_code);
        
        widget.innerHTML = `
            <div class="text-6xl mb-2">${icon}</div>
            <div class="text-4xl font-bold text-gray-800 dark:text-white">${Math.round(current.temperature_2m)}°C</div>
            <div class="text-gray-600 dark:text-gray-300">${desc}</div>
            <div class="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div class="text-gray-500 dark:text-gray-400">
                    <span class="block">Độ ẩm</span>
                    <span class="font-semibold text-gray-700 dark:text-gray-200">${current.relative_humidity_2m}%</span>
                </div>
                <div class="text-gray-500 dark:text-gray-400">
                    <span class="block">Gió</span>
                    <span class="font-semibold text-gray-700 dark:text-gray-200">${Math.round(current.wind_speed_10m)} km/h</span>
                </div>
            </div>
        `;
    }
};

// ============================================
// NEWS MANAGER (Demo Data)
// ============================================
const NewsManager = {
    demoNews: [
        {
            id: 1,
            title: 'Việt Nam đạt tăng trưởng GDP 5.05% trong năm 2023',
            summary: 'Kinh tế Việt Nam tiếp tục phục hồi mạnh mẽ với nhiều chỉ số tích cực...',
            category: 'economy',
            categoryName: 'Kinh tế',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
            date: new Date().toLocaleDateString('vi-VN'),
            content: 'Kinh tế Việt Nam năm 2023 đạt nhiều kết quả tích cực với GDP tăng 5.05%. Các ngành công nghiệp chế biến, chế tạo tiếp tục là động lực chính thúc đẩy tăng trưởng. Xuất khẩu hàng hóa duy trì đà tăng trưởng ổn định, thu hút đầu tư nước ngoài đạt kỷ lục mới.'
        },
        {
            id: 2,
            title: 'AI đang thay đổi ngành công nghiệp công nghệ toàn cầu',
            summary: 'Trí tuệ nhân tạo đang tạo ra cuộc cách mạng trong nhiều lĩnh vực...',
            category: 'technology',
            categoryName: 'Công nghệ',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
            date: new Date().toLocaleDateString('vi-VN'),
            content: 'Trí tuệ nhân tạo đang tạo ra những thay đổi sâu rộng trong ngành công nghiệp công nghệ. Các công ty lớn như Google, Microsoft, OpenAI đang đua nhau phát triển các mô hình AI ngày càng mạnh mẽ. AI đang được ứng dụng trong y tế, giáo dục, tài chính và nhiều lĩnh vực khác.'
        },
        {
            id: 3,
            title: 'Đội tuyển Việt Nam chuẩn bị cho vòng loại World Cup 2026',
            summary: 'Huấn luyện viên Kim Sang-sik đang đặt kỳ vọng cao vào đội tuyển...',
            category: 'sports',
            categoryName: 'Thể thao',
            image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
            date: new Date().toLocaleDateString('vi-VN'),
            content: 'Đội tuyển Việt Nam đang trong giai đoạn chuẩn bị nước rút cho vòng loại World Cup 2026. Huấn luyện viên Kim Sang-sik đã triệu tập đội hình mạnh nhất với nhiều cầu thủ trẻ tài năng. Người hâm mộ đang kỳ vọng đội tuyển sẽ tạo nên kỳ tích tại đấu trường thế giới.'
        },
        {
            id: 4,
            title: 'Bão nhiệt đới mới hình thành trên Biển Đông',
            summary: 'Cơ quan khí tượng cảnh báo về diễn biến phức tạp của bão...',
            category: 'domestic',
            categoryName: 'Trong nước',
            image: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=400',
            date: new Date().toLocaleDateString('vi-VN'),
            content: 'Trung tâm Dự báo Khí tượng Thủy văn Quốc gia vừa phát đi thông báo về một áp thấp nhiệt đới mới hình thành trên Biển Đông. Các địa phương ven biển cần chủ động phòng chống thiên tai, đảm bảo an toàn cho người dân và tàu thuyền.'
        },
        {
            id: 5,
            title: 'Liên Hợp Quốc thông qua nghị quyết về biến đổi khí hậu',
            summary: 'Các quốc gia đạt được đồng thuận về hành động khẩn cấp...',
            category: 'international',
            categoryName: 'Quốc tế',
            image: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=400',
            date: new Date().toLocaleDateString('vi-VN'),
            content: 'Tại Hội nghị Khí hậu COP mới nhất, các quốc gia thành viên đã đạt được đồng thuận về nghị quyết tăng cường hành động chống biến đổi khí hậu. Cam kết giảm phát thải ròng về 0 vào năm 2050 được tái khẳng định với lộ trình cụ thể hơn.'
        },
        {
            id: 6,
            title: 'Giá vàng trong nước tiếp tục tăng cao',
            summary: 'Thị trường vàng đang chứng kiến những biến động mạnh...',
            category: 'economy',
            categoryName: 'Kinh tế',
            image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400',
            date: new Date().toLocaleDateString('vi-VN'),
            content: 'Giá vàng trong nước hôm nay tiếp tục xu hướng tăng, vượt mức 75 triệu đồng/lượng. Các chuyên gia nhận định giá vàng vẫn được hỗ trợ bởi bất ổn địa chính trị và lạm phát toàn cầu. Người dân cần cân nhắc kỹ khi đầu tư vào vàng trong thời điểm này.'
        }
    ],
    
    getHomepageNews(limit = 3) {
        return this.demoNews.slice(0, limit);
    },
    
    renderNewsCard(news) {
        const categoryColors = {
            domestic: 'bg-blue-100 text-blue-700',
            international: 'bg-purple-100 text-purple-700',
            technology: 'bg-green-100 text-green-700',
            economy: 'bg-yellow-100 text-yellow-700',
            sports: 'bg-red-100 text-red-700'
        };
        
        const colorClass = categoryColors[news.category] || 'bg-gray-100 text-gray-700';
        
        return `
            <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer fade-in" onclick="showNewsDetail(${news.id})">
                <img src="${news.image}" alt="${news.title}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <span class="inline-block px-3 py-1 ${colorClass} text-xs font-medium rounded-full mb-2">
                        ${news.categoryName}
                    </span>
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">${news.title}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">${news.summary}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-500">${news.date}</p>
                </div>
            </article>
        `;
    },
    
    renderFeaturedNews(news) {
        const categoryColors = {
            domestic: 'bg-blue-100 text-blue-700',
            international: 'bg-purple-100 text-purple-700',
            technology: 'bg-green-100 text-green-700',
            economy: 'bg-yellow-100 text-yellow-700',
            sports: 'bg-red-100 text-red-700'
        };
        
        const colorClass = categoryColors[news.category] || 'bg-gray-100 text-gray-700';
        
        return `
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer" onclick="showNewsDetail(${news.id})">
                <div class="md:flex">
                    <div class="md:w-1/2">
                        <img src="${news.image}" alt="${news.title}" class="w-full h-64 md:h-full object-cover">
                    </div>
                    <div class="p-6 md:w-1/2 flex flex-col justify-center">
                        <span class="inline-block px-3 py-1 ${colorClass} text-xs font-medium rounded-full mb-3 w-fit">
                            ${news.categoryName}
                        </span>
                        <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-3">${news.title}</h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-4">${news.summary}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-500">${news.date}</p>
                    </div>
                </div>
            </div>
        `;
    },
    
    updateHomepageNews() {
        const container = document.getElementById('newsGrid');
        if (container) {
            const news = this.getHomepageNews(3);
            container.innerHTML = news.map(n => this.renderNewsCard(n)).join('');
        }
    }
};

// ============================================
// LOADING MANAGER
// ============================================
const LoadingManager = {
    hide() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }
};

// ============================================
// INITIALIZE HOME PAGE
// ============================================
function initHomePage() {
    ThemeManager.init();
    ClockManager.init();
    DateManager.updateTodayDisplay();
    CountdownManager.init();
    NewsManager.updateHomepageNews();
    WeatherWidget.updateWidget();
    
    // Hide loading after everything is ready
    setTimeout(() => LoadingManager.hide(), 500);
}

// ============================================
// INITIALIZE ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    LoadingManager.hide();
    
    // Update date display for all pages
    DateManager.updateTodayDisplay();
});

// Expose functions globally for HTML onclick handlers
window.showNewsDetail = function(id) {
    // This will be implemented in news.js
    if (typeof openNewsModal === 'function') {
        openNewsModal(id);
    }
};
