/* ============================================
   NEWS PAGE JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('newsGrid')) return;
    
    const NewsApp = {
        apiKey: 'd664afe835da444db7286409f0a6754b', // NewsAPI key (optional - using demo data if empty)
        currentCategory: 'all',
        searchQuery: '',
        displayedCount: 6,
        allNews: [],
        
        // Demo news data
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
                date: new Date(Date.now() - 86400000).toLocaleDateString('vi-VN'),
                content: 'Trí tuệ nhân tạo đang tạo ra những thay đổi sâu rộng trong ngành công nghiệp công nghệ. Các công ty lớn như Google, Microsoft, OpenAI đang đua nhau phát triển các mô hình AI ngày càng mạnh mẽ.'
            },
            {
                id: 3,
                title: 'Đội tuyển Việt Nam chuẩn bị cho vòng loại World Cup 2026',
                summary: 'Huấn luyện viên Kim Sang-sik đang đặt kỳ vọng cao vào đội tuyển...',
                category: 'sports',
                categoryName: 'Thể thao',
                image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
                date: new Date(Date.now() - 172800000).toLocaleDateString('vi-VN'),
                content: 'Đội tuyển Việt Nam đang trong giai đoạn chuẩn bị nước rút cho vòng loại World Cup 2026. Huấn luyện viên Kim Sang-sik đã triệu tập đội hình mạnh nhất.'
            },
            {
                id: 4,
                title: 'Bão nhiệt đới mới hình thành trên Biển Đông',
                summary: 'Cơ quan khí tượng cảnh báo về diễn biến phức tạp của bão...',
                category: 'domestic',
                categoryName: 'Trong nước',
                image: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=400',
                date: new Date(Date.now() - 259200000).toLocaleDateString('vi-VN'),
                content: 'Trung tâm Dự báo Khí tượng Thủy văn Quốc gia vừa phát đi thông báo về một áp thấp nhiệt đới mới hình thành trên Biển Đông.'
            },
            {
                id: 5,
                title: 'Liên Hợp Quốc thông qua nghị quyết về biến đổi khí hậu',
                summary: 'Các quốc gia đạt được đồng thuận về hành động khẩn cấp...',
                category: 'international',
                categoryName: 'Quốc tế',
                image: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=400',
                date: new Date(Date.now() - 345600000).toLocaleDateString('vi-VN'),
                content: 'Tại Hội nghị Khí hậu COP mới nhất, các quốc gia thành viên đã đạt được đồng thuận về nghị quyết tăng cường hành động chống biến đổi khí hậu.'
            },
            {
                id: 6,
                title: 'Giá vàng trong nước tiếp tục tăng cao',
                summary: 'Thị trường vàng đang chứng kiến những biến động mạnh...',
                category: 'economy',
                categoryName: 'Kinh tế',
                image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400',
                date: new Date(Date.now() - 432000000).toLocaleDateString('vi-VN'),
                content: 'Giá vàng trong nước hôm nay tiếp tục xu hướng tăng, vượt mức 75 triệu đồng/lượng.'
            },
            {
                id: 7,
                title: 'Microsoft ra mắt Windows 12 với nhiều tính năng AI',
                summary: 'Hệ điều hành mới tích hợp sâu Copilot và các công cụ AI...',
                category: 'technology',
                categoryName: 'Công nghệ',
                image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400',
                date: new Date(Date.now() - 518400000).toLocaleDateString('vi-VN'),
                content: 'Microsoft vừa công bố Windows 12 với nhiều cải tiến về AI và bảo mật. Copilot giờ đây được tích hợp sâu vào hệ thống.'
            },
            {
                id: 8,
                title: 'U23 Việt Nam vào bán kết giải châu Á',
                summary: 'Chiến thắng ấn tượng trước đối thủ mạnh...',
                category: 'sports',
                categoryName: 'Thể thao',
                image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400',
                date: new Date(Date.now() - 604800000).toLocaleDateString('vi-VN'),
                content: 'U23 Việt Nam đã có chiến thắng xứng đáng để vào bán kết giải U23 châu Á 2024.'
            },
            {
                id: 9,
                title: 'Chính phủ phê duyệt dự án cao tốc Bắc-Nam mới',
                summary: 'Tuyến đường sẽ rút ngắn thời gian di chuyển đáng kể...',
                category: 'domestic',
                categoryName: 'Trong nước',
                image: 'https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=400',
                date: new Date(Date.now() - 691200000).toLocaleDateString('vi-VN'),
                content: 'Chính phủ vừa phê duyệt dự án đầu tư xây dựng tuyến cao tốc Bắc-Nam mới với tổng vốn đầu tư hàng chục nghìn tỷ đồng.'
            },
            {
                id: 10,
                title: 'Mỹ và Trung Quốc đạt thỏa thuận thương mại mới',
                summary: 'Thỏa thuận sẽ có hiệu lực từ đầu năm sau...',
                category: 'international',
                categoryName: 'Quốc tế',
                image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400',
                date: new Date(Date.now() - 777600000).toLocaleDateString('vi-VN'),
                content: 'Hai nền kinh tế lớn nhất thế giới đã đạt được thỏa thuận thương mại mới sau nhiều tháng đàm phán.'
            },
            {
                id: 11,
                title: 'Apple công bố iPhone 16 với chip A18',
                summary: 'Dòng iPhone mới có nhiều cải tiến về camera và AI...',
                category: 'technology',
                categoryName: 'Công nghệ',
                image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400',
                date: new Date(Date.now() - 864000000).toLocaleDateString('vi-VN'),
                content: 'Apple vừa công bố dòng iPhone 16 với chip A18 mới, camera cải tiến và nhiều tính năng AI.'
            },
            {
                id: 12,
                title: 'Lãi suất ngân hàng có thể giảm trong quý tới',
                summary: 'NHNN dự kiến điều chỉnh lãi suất điều hành...',
                category: 'economy',
                categoryName: 'Kinh tế',
                image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
                date: new Date(Date.now() - 950400000).toLocaleDateString('vi-VN'),
                content: 'Ngân hàng Nhà nước đang xem xét điều chỉnh giảm lãi suất điều hành trong quý tới để hỗ trợ tăng trưởng kinh tế.'
            }
        ],
        
        init() {
            this.allNews = [...this.demoNews];
            this.bindEvents();
            this.render();
        },
        
        bindEvents() {
            // Category filters
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.category-btn').forEach(b => {
                        b.classList.remove('bg-primary', 'text-white');
                        b.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
                    });
                    e.target.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
                    e.target.classList.add('bg-primary', 'text-white');
                    
                    this.currentCategory = e.target.dataset.category;
                    this.displayedCount = 6;
                    this.render();
                });
            });
            
            // Search
            const searchInput = document.getElementById('newsSearch');
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchQuery = e.target.value.toLowerCase();
                    this.displayedCount = 6;
                    this.render();
                }, 300);
            });
            
            // Load more
            document.getElementById('loadMoreBtn').addEventListener('click', () => {
                this.displayedCount += 3;
                this.render();
            });
        },
        
        getFilteredNews() {
            let filtered = this.allNews;
            
            // Filter by category
            if (this.currentCategory !== 'all') {
                filtered = filtered.filter(n => n.category === this.currentCategory);
            }
            
            // Filter by search
            if (this.searchQuery) {
                filtered = filtered.filter(n => 
                    n.title.toLowerCase().includes(this.searchQuery) ||
                    n.summary.toLowerCase().includes(this.searchQuery)
                );
            }
            
            return filtered;
        },
        
        render() {
            const filtered = this.getFilteredNews();
            
            // Featured news (first item)
            const featuredContainer = document.getElementById('featuredNews');
            if (filtered.length > 0) {
                featuredContainer.innerHTML = this.renderFeaturedNews(filtered[0]);
            } else {
                featuredContainer.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400 py-8">Không tìm thấy tin tức nào</p>';
            }
            
            // News grid
            const gridContainer = document.getElementById('newsGrid');
            const gridNews = filtered.slice(1, this.displayedCount);
            
            if (gridNews.length > 0) {
                gridContainer.innerHTML = gridNews.map(n => this.renderNewsCard(n)).join('');
            } else if (filtered.length <= 1) {
                gridContainer.innerHTML = '';
            }
            
            // Load more button visibility
            const loadMoreBtn = document.getElementById('loadMoreBtn');
            if (filtered.length <= this.displayedCount) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'inline-block';
            }
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
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer" onclick="openNewsModal(${news.id})">
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
                <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer" onclick="openNewsModal(${news.id})">
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
        }
    };
    
    // Global modal functions
    window.openNewsModal = function(id) {
        const news = NewsApp.allNews.find(n => n.id === id);
        if (!news) return;
        
        document.getElementById('modalCategory').textContent = news.categoryName;
        document.getElementById('modalImage').src = news.image;
        document.getElementById('modalImage').alt = news.title;
        document.getElementById('modalTitle').textContent = news.title;
        document.getElementById('modalDate').textContent = news.date;
        document.getElementById('modalContent').innerHTML = `<p>${news.content}</p><p class="mt-4">${news.summary}</p><p class="mt-4">Nội dung chi tiết sẽ được cập nhật khi có dữ liệu từ API thực. Hiện tại đây là dữ liệu demo để minh họa giao diện.</p>`;
        
        document.getElementById('newsModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };
    
    window.closeNewsModal = function() {
        document.getElementById('newsModal').classList.add('hidden');
        document.body.style.overflow = '';
    };
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeNewsModal();
        }
    });
    
    // Initialize
    NewsApp.init();
});
