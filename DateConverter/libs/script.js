// --- Constants & Data ---
const engMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const nepMonths = ['Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'];
const nepMonthsDevanagari = ['वैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत'];
const engWeekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const nepWeekdays = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];

// Reference Date Map based on user logic: 
// B.S. 2000 Baisakh 1 = 1943 April 14 A.D.
const REF_AD_YEAR = 1943;
const REF_AD_MONTH = 3; // April (0-indexed)
const REF_AD_DAY = 14;

const REF_BS_YEAR = 2000;
const REF_BS_MONTH = 0; // Baisakh
const REF_BS_DAY = 1;

// Exact matrix extracted from the attached CSV logic (B.S. 2000 to 2090)
const nepaliMonthDays = {
    2000: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2001: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2002: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2003: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2004: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2005: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2006: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2007: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2008: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
    2009: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2010: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2011: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2012: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    2013: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2014: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2015: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2016: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    2017: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2018: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2019: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2020: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2021: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2022: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    2023: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2024: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2025: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2026: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2027: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2028: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2029: [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
    2030: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2031: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2032: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2033: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2034: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2035: [30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
    2036: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2037: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2038: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2039: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    2040: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2041: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2042: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2043: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    2044: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2045: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2046: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2047: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2048: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2049: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    2050: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2051: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2052: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2053: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    2054: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2055: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2056: [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
    2057: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2058: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2059: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2060: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2061: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2062: [30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31],
    2063: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2064: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2065: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2066: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
    2067: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2068: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2069: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2070: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    2071: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2072: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2073: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2074: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2075: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2076: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    2077: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2078: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2079: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    2081: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2082: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2083: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
    2084: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
    2085: [31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30],
    2086: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2087: [31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
    2088: [30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30],
    2089: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2090: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
};

// --- Core Helper Functions ---
const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

const getAdDaysInMonth = (year, month) => {
    const days = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return days[month];
};

const getUTCDays = (year, month, day) => {
    return Math.floor(Date.UTC(year, month, day) / (1000 * 60 * 60 * 24));
};

const convertADtoBS = (adYear, adMonth, adDay) => {
    const targetUTCDays = getUTCDays(adYear, adMonth, adDay);
    const refUTCDays = getUTCDays(REF_AD_YEAR, REF_AD_MONTH, REF_AD_DAY);
    
    let daysPassed = targetUTCDays - refUTCDays;
    if (daysPassed < 0) return null;
    
    let bsYear = REF_BS_YEAR;
    let bsMonth = REF_BS_MONTH;
    let bsDay = REF_BS_DAY;

    while (daysPassed > 0) {
        if (!nepaliMonthDays[bsYear]) return null;
        
        const daysInCurrentMonth = nepaliMonthDays[bsYear][bsMonth];
        const daysLeftInMonth = daysInCurrentMonth - bsDay + 1;

        if (daysPassed >= daysLeftInMonth) {
            daysPassed -= daysLeftInMonth;
            bsDay = 1;
            bsMonth++;
            if (bsMonth > 11) {
                bsMonth = 0;
                bsYear++;
            }
        } else {
            bsDay += daysPassed;
            daysPassed = 0;
        }
    }
    
    const originalDate = new Date(adYear, adMonth, adDay);
    return { year: bsYear, month: bsMonth, day: bsDay, weekdayIndex: originalDate.getDay() };
};

const convertBStoAD = (bsYear, bsMonth, bsDay) => {
    if (bsYear < 2000 || bsYear > 2090) return null;

    let daysPassed = 0;
    let currentY = REF_BS_YEAR;
    let currentM = REF_BS_MONTH;
    
    while (currentY < bsYear || (currentY === bsYear && currentM < bsMonth)) {
        daysPassed += nepaliMonthDays[currentY][currentM];
        currentM++;
        if (currentM > 11) { 
            currentM = 0; 
            currentY++; 
        }
    }
    
    daysPassed += bsDay - REF_BS_DAY; 

    const targetAD = new Date(Date.UTC(REF_AD_YEAR, REF_AD_MONTH, REF_AD_DAY));
    targetAD.setUTCDate(targetAD.getUTCDate() + daysPassed);
    
    return {
        year: targetAD.getUTCFullYear(),
        month: targetAD.getUTCMonth(),
        day: targetAD.getUTCDate(),
        weekdayIndex: targetAD.getUTCDay()
    };
};

// --- Number Localization Tools ---
const devanagariMap = {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'};
const englishMap = {'०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9'};

const toDevanagari = (num) => String(num).split('').map(char => devanagariMap[char] || char).join('');
const toEnglish = (str) => String(str).split('').map(char => englishMap[char] || char).join('');

// --- UI Logic & Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Live Date Initialization
    const updateLiveDate = () => {
        const now = new Date();
        const bsDate = convertADtoBS(now.getFullYear(), now.getMonth(), now.getDate());
        const adString = `${engMonths[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
        
        // Show Live BS date fully localized in Devanagari
        const bsString = bsDate ? `${toDevanagari(bsDate.year)} ${nepMonthsDevanagari[bsDate.month]} ${toDevanagari(bsDate.day)}` : '';
        document.getElementById('current-date-text').textContent = `Today: ${adString} | वि.सं. ${bsString}`;
    };
    updateLiveDate();

    // 2. Populate Dropdowns
    const populateDropdowns = () => {
        const adMonthSelect = document.getElementById('ad-month');
        const bsMonthSelect = document.getElementById('bs-month');
        const adDaySelect = document.getElementById('ad-day');
        const bsDaySelect = document.getElementById('bs-day');

        engMonths.forEach((m, i) => adMonthSelect.add(new Option(m, i)));
        // Populate BS Month using Devanagari Names
        nepMonthsDevanagari.forEach((m, i) => bsMonthSelect.add(new Option(m, i)));
        
        const populateAdDays = (selectElem, maxDays) => {
            selectElem.innerHTML = '';
            for(let i=1; i<=maxDays; i++) selectElem.add(new Option(i, i));
        };
        const populateBsDays = (selectElem, maxDays) => {
            selectElem.innerHTML = '';
            // Display Devanagari number in UI, but keep standard value for background logic
            for(let i=1; i<=maxDays; i++) selectElem.add(new Option(toDevanagari(i), i));
        };
        
        populateAdDays(adDaySelect, 31);
        populateBsDays(bsDaySelect, 32);

        adMonthSelect.value = 2; // March
        adDaySelect.value = 22;
        document.getElementById('ad-year').value = 2026;

        bsMonthSelect.value = 11; // Chaitra
        bsDaySelect.value = 8;
        // Seed default Devanagari Year
        document.getElementById('bs-year').value = "२०८२"; 
    };
    populateDropdowns();

    // 3. Dynamic Day Updates based on Month/Year Selection
    const updateAdDays = () => {
        const y = parseInt(document.getElementById('ad-year').value);
        const m = parseInt(document.getElementById('ad-month').value);
        if(!isNaN(y) && !isNaN(m)) {
            const maxDays = getAdDaysInMonth(y, m);
            const select = document.getElementById('ad-day');
            const currentVal = parseInt(select.value);
            select.innerHTML = '';
            for(let i=1; i<=maxDays; i++) select.add(new Option(i, i));
            select.value = currentVal <= maxDays ? currentVal : maxDays;
        }
    };

    const updateBsDays = () => {
        // Parse the Devanagari (or mixed) string securely back into English digits for logic
        const y = parseInt(toEnglish(document.getElementById('bs-year').value));
        const m = parseInt(document.getElementById('bs-month').value);
        
        if(nepaliMonthDays[y] && !isNaN(m)) {
            const maxDays = nepaliMonthDays[y][m];
            const select = document.getElementById('bs-day');
            const currentVal = parseInt(select.value);
            select.innerHTML = '';
            
            // Re-populate with Devanagari labels
            for(let i=1; i<=maxDays; i++) select.add(new Option(toDevanagari(i), i));
            
            select.value = currentVal <= maxDays ? currentVal : maxDays;
        }
    };

    // Auto-Format B.S. Year typing to strict Devanagari numerals
    document.getElementById('bs-year').addEventListener('input', (e) => {
        // Strip out anything that isn't a digit (English or Devanagari)
        let cleanVal = e.target.value.replace(/[^0-9०-९]/g, '');
        // Convert to English temporarily, then convert to Devanagari 
        e.target.value = toDevanagari(toEnglish(cleanVal));
        updateBsDays();
    });

    document.getElementById('ad-year').addEventListener('change', updateAdDays);
    document.getElementById('ad-month').addEventListener('change', updateAdDays);
    document.getElementById('bs-month').addEventListener('change', updateBsDays);

    // 4. Tab Switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            e.target.classList.add('active');
            document.getElementById(e.target.dataset.tab).classList.add('active');
            document.getElementById('output-section').classList.add('hidden');
        });
    });

    // 5. Form Submissions
    const showResult = (text) => {
        const output = document.getElementById('output-section');
        const error = document.getElementById('error-message');
        const resText = document.getElementById('result-text');
        
        error.classList.add('hidden');
        resText.textContent = text;
        output.classList.remove('hidden');
    };

    const showError = (text) => {
        const output = document.getElementById('output-section');
        const error = document.getElementById('error-message');
        
        output.classList.remove('hidden');
        document.getElementById('result-text').textContent = '';
        error.textContent = text;
        error.classList.remove('hidden');
    };

    document.getElementById('form-ad-to-bs').addEventListener('submit', (e) => {
        e.preventDefault();
        const y = parseInt(document.getElementById('ad-year').value);
        const m = parseInt(document.getElementById('ad-month').value);
        const d = parseInt(document.getElementById('ad-day').value);
        
        const result = convertADtoBS(y, m, d);
        if(result) {
            const formatted = `${toDevanagari(result.year)} ${nepMonthsDevanagari[result.month]} ${toDevanagari(result.day)}, ${nepWeekdays[result.weekdayIndex]}`;
            showResult(formatted);
        } else {
            showError("Date out of supported range (Requires after 1943 AD).");
        }
    });

    document.getElementById('form-bs-to-ad').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Grab values and convert Devanagari year back to math-friendly English digits
        const bsYearText = document.getElementById('bs-year').value;
        const y = parseInt(toEnglish(bsYearText));
        const m = parseInt(document.getElementById('bs-month').value);
        const d = parseInt(document.getElementById('bs-day').value);
        
        if (isNaN(y)) {
            showError("Please enter a valid B.S. year.");
            return;
        }

        const result = convertBStoAD(y, m, d);
        if(result) {
            const formatted = `${result.year} ${engMonths[result.month]} ${result.day}, ${engWeekdays[result.weekdayIndex]}`;
            showResult(formatted);
        } else {
            showError("Date out of supported range (२००० to २०९० B.S.).");
        }
    });

    // 6. Resets & Utilities
    document.querySelectorAll('.reset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('output-section').classList.add('hidden');
        });
    });

    document.getElementById('copy-btn').addEventListener('click', () => {
        const text = document.getElementById('result-text').textContent;
        if(text) {
            navigator.clipboard.writeText(text);
            const btn = document.getElementById('copy-btn');
            btn.style.color = 'var(--color-success)';
            setTimeout(() => btn.style.color = 'var(--text-secondary)', 2000);
        }
    });
});