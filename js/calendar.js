/* ============================================
   CALENDAR PAGE JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('calendarGrid')) return;
    
    const CalendarApp = {
        currentDate: new Date(),
        selectedDate: new Date(),
        notes: JSON.parse(localStorage.getItem('calendarNotes') || '{}'),
        
        monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                     'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        
        weekdays: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
        
        holidays: [
            { month: 1, day: 1, name: 'Tết Dương Lịch' },
            { month: 2, day: 14, name: 'Valentine' },
            { month: 3, day: 8, name: 'Quốc Tế Phụ Nữ' },
            { month: 4, day: 30, name: 'Ngày Giải Phóng' },
            { month: 5, day: 1, name: 'Quốc Tế Lao Động' },
            { month: 6, day: 1, name: 'Quốc Tế Thiếu Nhi' },
            { month: 9, day: 2, name: 'Quốc Khánh' },
            { month: 11, day: 20, name: 'Ngày Nhà Giáo' },
            { month: 12, day: 25, name: 'Giáng Sinh' }
        ],
        
        init() {
            this.bindEvents();
            this.render();
            this.updateHolidays();
        },
        
        bindEvents() {
            document.getElementById('prevMonth').addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.render();
            });
            
            document.getElementById('nextMonth').addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.render();
            });
            
            document.getElementById('todayBtn').addEventListener('click', () => {
                this.currentDate = new Date();
                this.selectedDate = new Date();
                this.render();
                this.showSelectedDateInfo();
            });
            
            document.getElementById('addNoteBtn').addEventListener('click', () => {
                this.addNote();
            });
            
            document.getElementById('noteInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addNote();
            });
        },
        
        render() {
            this.updateHeader();
            this.renderGrid();
        },
        
        updateHeader() {
            const header = document.getElementById('currentMonthYear');
            header.textContent = `${this.monthNames[this.currentDate.getMonth()]}, ${this.currentDate.getFullYear()}`;
        },
        
        renderGrid() {
            const grid = document.getElementById('calendarGrid');
            grid.innerHTML = '';
            
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth();
            
            // Get first day of month and number of days
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const daysInPrevMonth = new Date(year, month, 0).getDate();
            
            // Previous month days
            for (let i = firstDay - 1; i >= 0; i--) {
                const day = daysInPrevMonth - i;
                const cell = this.createDayCell(day, true);
                grid.appendChild(cell);
            }
            
            // Current month days
            const today = new Date();
            for (let day = 1; day <= daysInMonth; day++) {
                const isToday = year === today.getFullYear() && 
                               month === today.getMonth() && 
                               day === today.getDate();
                const isSelected = year === this.selectedDate.getFullYear() && 
                                  month === this.selectedDate.getMonth() && 
                                  day === this.selectedDate.getDate();
                
                const cell = this.createDayCell(day, false, isToday, isSelected, year, month);
                cell.addEventListener('click', () => {
                    this.selectedDate = new Date(year, month, day);
                    this.render();
                    this.showSelectedDateInfo();
                });
                grid.appendChild(cell);
            }
            
            // Next month days
            const remainingCells = 42 - (firstDay + daysInMonth);
            for (let day = 1; day <= remainingCells; day++) {
                const cell = this.createDayCell(day, true);
                grid.appendChild(cell);
            }
        },
        
        createDayCell(day, isOtherMonth, isToday = false, isSelected = false, year, month) {
            const cell = document.createElement('div');
            cell.className = `min-h-[80px] p-2 border border-gray-100 dark:border-gray-700 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                isOtherMonth ? 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-600' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
            } ${isToday ? 'ring-2 ring-primary ring-inset' : ''} ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`;
            
            const dayNum = document.createElement('div');
            dayNum.className = `font-semibold ${isToday ? 'text-primary' : ''}`;
            dayNum.textContent = day;
            cell.appendChild(dayNum);
            
            // Add lunar date
            if (!isOtherMonth && typeof LunarCalendar !== 'undefined') {
                const lunar = LunarCalendar.convertSolarToLunar(day, month + 1, year);
                const lunarEl = document.createElement('div');
                lunarEl.className = 'text-xs text-gray-500 dark:text-gray-400 mt-1';
                lunarEl.textContent = `${lunar.day}`;
                cell.appendChild(lunarEl);
            }
            
            // Add note indicator
            if (!isOtherMonth) {
                const dateKey = `${year}-${month}-${day}`;
                if (this.notes[dateKey] && this.notes[dateKey].length > 0) {
                    const indicator = document.createElement('div');
                    indicator.className = 'mt-1 flex flex-wrap gap-1';
                    this.notes[dateKey].slice(0, 2).forEach(() => {
                        const dot = document.createElement('div');
                        dot.className = 'w-1.5 h-1.5 bg-accent rounded-full';
                        indicator.appendChild(dot);
                    });
                    if (this.notes[dateKey].length > 2) {
                        const more = document.createElement('span');
                        more.className = 'text-xs text-accent';
                        more.textContent = '+';
                        indicator.appendChild(more);
                    }
                    cell.appendChild(indicator);
                }
            }
            
            // Add holiday indicator
            if (!isOtherMonth) {
                const holiday = this.holidays.find(h => h.month === month + 1 && h.day === day);
                if (holiday) {
                    cell.classList.add('bg-red-50', 'dark:bg-red-900/20');
                    const holidayEl = document.createElement('div');
                    holidayEl.className = 'text-xs text-red-600 dark:text-red-400 mt-1 truncate';
                    holidayEl.textContent = holiday.name;
                    cell.appendChild(holidayEl);
                }
            }
            
            return cell;
        },
        
        showSelectedDateInfo() {
            const info = document.getElementById('selectedDateInfo');
            const date = this.selectedDate;
            const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            
            let html = '';
            
            // Solar date
            const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
            html += `<p class="font-medium text-gray-800 dark:text-white mb-2">${weekdays[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}</p>`;
            
            // Lunar date
            if (typeof LunarCalendar !== 'undefined') {
                const lunar = LunarCalendar.convertSolarToLunar(date.getDate(), date.getMonth() + 1, date.getFullYear());
                html += `<p class="text-sm text-green-600 dark:text-green-400 mb-2">Âm lịch: ${lunar.day}/${lunar.month}</p>`;
                html += `<p class="text-sm text-purple-600 dark:text-purple-400">Ngày ${lunar.dayInMonth}</p>`;
            }
            
            // Holiday
            const holiday = this.holidays.find(h => h.month === date.getMonth() + 1 && h.day === date.getDate());
            if (holiday) {
                html += `<p class="text-sm text-red-600 dark:text-red-400 mt-2 font-medium">🎉 ${holiday.name}</p>`;
            }
            
            info.innerHTML = html;
            
            // Update notes list
            this.updateNotesList();
        },
        
        updateNotesList() {
            const list = document.getElementById('notesList');
            const date = this.selectedDate;
            const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            const dayNotes = this.notes[dateKey] || [];
            
            if (dayNotes.length === 0) {
                list.innerHTML = '<p class="text-sm text-gray-500 dark:text-gray-400 italic">Chưa có ghi chú</p>';
            } else {
                list.innerHTML = dayNotes.map((note, index) => `
                    <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <span class="text-sm text-gray-700 dark:text-gray-300">${note}</span>
                        <button onclick="calendarApp.deleteNote(${index})" class="text-red-500 hover:text-red-700">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                `).join('');
            }
        },
        
        addNote() {
            const input = document.getElementById('noteInput');
            const note = input.value.trim();
            
            if (!note) return;
            
            const date = this.selectedDate;
            const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            
            if (!this.notes[dateKey]) {
                this.notes[dateKey] = [];
            }
            
            this.notes[dateKey].push(note);
            localStorage.setItem('calendarNotes', JSON.stringify(this.notes));
            
            input.value = '';
            this.updateNotesList();
            this.render();
        },
        
        deleteNote(index) {
            const date = this.selectedDate;
            const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            
            this.notes[dateKey].splice(index, 1);
            if (this.notes[dateKey].length === 0) {
                delete this.notes[dateKey];
            }
            
            localStorage.setItem('calendarNotes', JSON.stringify(this.notes));
            this.updateNotesList();
            this.render();
        },
        
        updateHolidays() {
            const list = document.getElementById('upcomingHolidays');
            const today = new Date();
            
            const upcoming = this.holidays
                .map(h => {
                    const date = new Date(today.getFullYear(), h.month - 1, h.day);
                    if (date < today) {
                        date.setFullYear(today.getFullYear() + 1);
                    }
                    return { ...h, date, daysUntil: Math.ceil((date - today) / (1000 * 60 * 60 * 24)) };
                })
                .sort((a, b) => a.daysUntil - b.daysUntil)
                .slice(0, 5);
            
            list.innerHTML = upcoming.map(h => `
                <li class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span class="text-gray-700 dark:text-gray-300">${h.name}</span>
                    <span class="text-xs ${h.daysUntil <= 7 ? 'text-red-500 font-medium' : 'text-gray-500 dark:text-gray-400'}">
                        ${h.daysUntil === 0 ? 'Hôm nay!' : `${h.daysUntil} ngày`}
                    </span>
                </li>
            `).join('');
        }
    };
    
    // Initialize and expose
    window.calendarApp = CalendarApp;
    CalendarApp.init();
    CalendarApp.showSelectedDateInfo();
});
