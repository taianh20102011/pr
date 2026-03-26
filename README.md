# Portal - Website Thông Tin Tổng Hợp

Website hiện đại cung cấp lịch âm dương, thời tiết và tin tức.

## Tính năng chính

### Trang chủ
- Hiển thị ngày dương lịch và âm lịch hiện tại
- Đồng hồ thời gian thực
- Widget thời tiết nhanh
- Tin tức nổi bật
- Đếm ngược các sự kiện đặc biệt (Tết, cuối tuần)

### Trang Lịch
- Lịch tháng dạng grid
- Hiển thị âm lịch cho mỗi ngày
- Chuyển đổi tháng trước/sau
- Highlight ngày hiện tại
- Thêm ghi chú cá nhân (lưu trong LocalStorage)
- Danh sách ngày lễ sắp tới

### Trang Thời tiết
- Tìm kiếm thời tiết theo thành phố
- Tự động xác định vị trí (GPS)
- Nhiệt độ hiện tại và cảm giác như
- Độ ẩm, tốc độ gió, áp suất, tầm nhìn
- Dự báo 7 ngày
- Lưu thành phố yêu thích
- Sử dụng Open-Meteo API (miễn phí, không cần API key)

### Trang Thời sự
- Tin tức theo danh mục: Trong nước, Quốc tế, Công nghệ, Kinh tế, Thể thao
- Tìm kiếm tin tức
- Modal xem chi tiết bài viết
- Dữ liệu demo (có thể tích hợp NewsAPI)

### Trang Liên hệ
- Form góp ý với validation
- Thông tin liên hệ
- FAQ (Câu hỏi thường gặp)
- Liên kết mạng xã hội

## Công nghệ sử dụng

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **CSS Framework**: Tailwind CSS (via CDN)
- **Icons**: SVG inline (không cần thư viện icon)
- **APIs**:
  - Open-Meteo API (thời tiết, miễn phí)
  - BigDataCloud (reverse geocoding)
  - NewsAPI (tùy chọn, cần API key)

## Cấu trúc thư mục

```
portal/
├── index.html          # Trang chủ
├── calendar.html       # Trang lịch
├── weather.html        # Trang thời tiết
├── news.html           # Trang thời sự
├── contact.html        # Trang liên hệ
├── css/
│   └── style.css       # Styles tùy chỉnh
├── js/
│   ├── main.js         # JavaScript chính
│   ├── lunar.js        # Thuật toán tính âm lịch
│   ├── calendar.js     # Chức năng lịch
│   ├── weather.js      # Chức năng thời tiết
│   └── news.js         # Chức năng tin tức
├── images/             # Hình ảnh (tạo sau)
└── manifest.json       # PWA manifest
```

## Tính năng nâng cao

### Dark Mode
- Chuyển đổi giữa light/dark mode
- Lưu preference trong LocalStorage
- CSS variables cho smooth transition

### PWA (Progressive Web App)
- Có thể cài đặt như app
- Manifest.json đầy đủ
- Shortcuts cho các trang chính
- Responsive 100%

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Menu mobile với hamburger icon
- Touch-friendly interface

### SEO
- Meta tags đầy đủ
- Semantic HTML
- Open Graph tags
- Loading states

## Hướng dẫn sử dụng

### Chạy local
1. Mở thư mục `portal` trong VS Code
2. Cài đặt extension "Live Server"
3. Right-click vào `index.html` → "Open with Live Server"
4. Hoặc mở trực tiếp file trong trình duyệt

### Triển khai
Có thể triển khai lên bất kỳ hosting tĩnh nào:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

### Tích hợp API thực

#### OpenWeatherMap (Thời tiết)
1. Đăng ký tại [openweathermap.org](https://openweathermap.org/api)
2. Lấy API key
3. Cập nhật trong `js/weather.js`:
```javascript
apiKey: 'YOUR_API_KEY'
```

#### NewsAPI (Tin tức)
1. Đăng ký tại [newsapi.org](https://newsapi.org)
2. Lấy API key
3. Cập nhật trong `js/news.js`:
```javascript
apiKey: 'YOUR_API_KEY'
```

## Lưu ý

- Thuật toán âm lịch chính xác cho năm 1800-2199
- Dữ liệu ghi chú lịch lưu trong LocalStorage (không đồng bộ giữa thiết bị)
- Thời tiết sử dụng Open-Meteo API miễn phí, không cần API key

## License

MIT License - Tự do sử dụng và chỉnh sửa.

## Tác giả

Tạo bởi AI Assistant với yêu cầu từ người dùng.
