/* ============================================
   LUNAR CALCULATOR - Vietnamese Lunar Calendar
   ============================================ */

const LunarCalendar = {
    // Các tháng âm lịch
    months: ['Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Tháng 7', 'Tám', 'Chín', 'Mười', 'Mười một', 'Chạp'],
    
    // Can Chi
    can: ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'],
    chi: ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'],
    
    // Thuat toan tinh am lich
    // Credits: Based on Ho Ngoc Duc's algorithm
    
    jdFromDate(dd, mm, yy) {
        const a = Math.floor((14 - mm) / 12);
        const y = yy + 4800 - a;
        const m = mm + 12 * a - 3;
        let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y 
                 + Math.floor(y / 4) - Math.floor(y / 100) 
                 + Math.floor(y / 400) - 32045;
        if (jd < 2299161) {
            jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y 
                 + Math.floor(y / 4) - 32083;
        }
        return jd;
    },
    
    jdToDate(jd) {
        let a, b, c, d, e, m, day, month, year;
        if (jd > 2299160) {
            a = Math.floor((jd - 1867216.25) / 36524.25);
            a = jd + 1 + a - Math.floor(a / 4);
        } else {
            a = jd;
        }
        b = a + 1524;
        c = Math.floor((b - 122.1) / 365.25);
        d = Math.floor(365.25 * c);
        e = Math.floor((b - d) / 30.6001);
        day = Math.floor(b - d - Math.floor(30.6001 * e));
        if (e < 14) {
            month = e - 1;
        } else {
            month = e - 13;
        }
        if (month > 2) {
            year = c - 4716;
        } else {
            year = c - 4715;
        }
        return [day, month, year];
    },
    
    getNewMoonDay(k, timeZone) {
        const T = k / 1236.85;
        const T2 = T * T;
        const T3 = T2 * T;
        const dr = Math.PI / 180;
        let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
        Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
        const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
        const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
        const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
        let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
        C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
        C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
        C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
        C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
        C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
        C1 = C1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
        let deltat = 0;
        if (T < -11) {
            deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000846 * T3 - 0.000000082 * T * T3;
        } else {
            deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
        }
        const JdNew = Jd1 + C1 - deltat;
        return Math.floor(JdNew + 0.5 + timeZone / 24);
    },
    
    getSunLongitude(jdn, timeZone) {
        const T = (jdn - 2451545.5 - timeZone / 24) / 36525;
        const T2 = T * T;
        const dr = Math.PI / 180;
        let M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
        let L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
        let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
        DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
        let L = L0 + DL;
        L = L * dr;
        L = L - Math.PI * 2 * Math.floor(L / (Math.PI * 2));
        return Math.floor(L / Math.PI * 6);
    },
    
    getLunarMonth11(yy, timeZone) {
        const off = this.jdFromDate(31, 12, yy) - 2415021;
        const k = Math.floor(off / 29.530588853);
        let nm = this.getNewMoonDay(k, timeZone);
        const sunLong = this.getSunLongitude(nm, timeZone);
        if (sunLong >= 9) {
            nm = this.getNewMoonDay(k - 1, timeZone);
        }
        return nm;
    },
    
    getLeapMonthOffset(a11, timeZone) {
        const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
        let last = 0;
        let i = 1;
        let arc = this.getSunLongitude(this.getNewMoonDay(k + i, timeZone), timeZone);
        do {
            last = arc;
            i = i + 1;
            arc = this.getSunLongitude(this.getNewMoonDay(k + i, timeZone), timeZone);
        } while (arc !== last && i < 14);
        return i - 1;
    },
    
    // Chuyen doi duong lich sang am lich
    convertSolarToLunar(dd, mm, yy, timeZone = 7) {
        const dayNumber = this.jdFromDate(dd, mm, yy);
        const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
        let monthStart = this.getNewMoonDay(k + 1, timeZone);
        if (monthStart > dayNumber) {
            monthStart = this.getNewMoonDay(k, timeZone);
        }
        let a11 = this.getLunarMonth11(yy, timeZone);
        let b11 = a11;
        let lunarYear;
        if (a11 >= monthStart) {
            lunarYear = yy;
            a11 = this.getLunarMonth11(yy - 1, timeZone);
        } else {
            lunarYear = yy + 1;
            b11 = this.getLunarMonth11(yy + 1, timeZone);
        }
        let lunarDay = dayNumber - monthStart + 1;
        let diff = Math.floor((monthStart - a11) / 29);
        let lunarLeap = 0;
        let lunarMonth = diff + 11;
        if (b11 - a11 > 365) {
            const leapMonthDiff = this.getLeapMonthOffset(a11, timeZone);
            if (diff >= leapMonthDiff) {
                lunarMonth = diff + 10;
                lunarLeap = 1;
            }
        }
        if (lunarMonth > 12) {
            lunarMonth = lunarMonth - 12;
        }
        if (lunarMonth >= 11 && diff < 4) {
            lunarYear -= 1;
        }
        return {
            day: lunarDay,
            month: lunarMonth,
            year: lunarYear,
            leap: lunarLeap,
            monthName: this.months[lunarMonth - 1] + (lunarLeap ? ' (nhuận)' : ''),
            yearName: this.getCanChiYear(lunarYear),
            monthInYear: this.getCanChiMonth(lunarMonth, lunarYear),
            dayInMonth: this.getCanChiDay(dayNumber)
        };
    },
    
    getCanChiYear(year) {
        return this.can[(year + 6) % 10] + ' ' + this.chi[(year + 8) % 12];
    },
    
    getCanChiMonth(month, year) {
        return this.can[((year + 6) * 12 + month + 1) % 10] + ' ';
    },
    
    getCanChiDay(jd) {
        return this.can[(jd + 9) % 10] + ' ' + this.chi[(jd + 1) % 12];
    },
    
    // Tinh ngay Tet Nguyen Dan
    getTetDate(year) {
        const a11 = this.getLunarMonth11(year - 1, 7);
        const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
        const monthStart = this.getNewMoonDay(k + 1, 7);
        const date = this.jdToDate(monthStart);
        return new Date(date[2], date[1] - 1, date[0]);
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LunarCalendar;
}
