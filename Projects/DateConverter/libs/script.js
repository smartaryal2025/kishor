// --- Constants & Data ---
const engMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const nepMonths = ['Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'];
const nepMonthsDevanagari = ['वैशाख', 'जेष्ठ', 'आषाढ', 'श्रावण', 'भाद्र', 'आश्विन', 'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुण', 'चैत्र'];
const engWeekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const nepWeekdays = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];

// Reference Date Map
const REF_AD_YEAR = 1943;
const REF_AD_MONTH = 3; 
const REF_AD_DAY = 14;

const REF_BS_YEAR = 2000;
const REF_BS_MONTH = 0; 
const REF_BS_DAY = 1;

// Exact Matrix 2000 to 2090
const nepaliMonthDays = {
    2000: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], 2001: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2002: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], 2003: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2004: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], 2005: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2006: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], 2007: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2008: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31], 2009: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2010: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], 2011: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2012: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], 2013: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2014: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], 2015: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2016: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], 2017: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2018: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30], 2019: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2020: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], 2021: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2022: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], 2023: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2024: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], 2025: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2026: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], 2027: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2028: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], 2029: [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
    2030: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], 2031: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2032: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], 2033: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2034: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], 2035: [30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
    2036: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], 2037: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2038: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], 2039: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    2040: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], 2041: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2042: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], 2043: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    2044: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], 2045: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2046: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31], 2047: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2048: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], 2049: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    2050: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], 2051: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2052: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], 2053: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    2054: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], 2055: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2056: [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30], 2057: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2058: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31], 2059: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2060: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], 2061: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2062: [30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31], 2063: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2064: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], 2065: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2066: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31], 2067: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2068: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], 2069: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2070: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30], 2071: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2072: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30], 2073: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2074: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], 2075: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2076: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], 2077: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2078: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30], 2079: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], 2081: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2082: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30], 2083: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
    2084: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30], 2085: [31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30],
    2086: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30], 2087: [31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
    2088: [30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30], 2089: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2090: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
};

const isLeapYear = (y) => (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
const getAdDaysInMonth = (y, m) => [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];
const getUTCDays = (y, m, d) => Math.floor(Date.UTC(y, m, d) / 86400000);

const convertADtoBS = (adY, adM, adD) => {
    let daysPassed = getUTCDays(adY, adM, adD) - getUTCDays(REF_AD_YEAR, REF_AD_MONTH, REF_AD_DAY);
    if (daysPassed < 0) return null;
    let bsY = REF_BS_YEAR, bsM = REF_BS_MONTH, bsD = REF_BS_DAY;

    while (daysPassed > 0) {
        if (!nepaliMonthDays[bsY]) return null;
        const daysLeft = nepaliMonthDays[bsY][bsM] - bsD + 1;
        if (daysPassed >= daysLeft) {
            daysPassed -= daysLeft;
            bsD = 1; bsM++;
            if (bsM > 11) { bsM = 0; bsY++; }
        } else {
            bsD += daysPassed; daysPassed = 0;
        }
    }
    return { year: bsY, month: bsM, day: bsD, weekdayIndex: new Date(adY, adM, adD).getDay() };
};

const convertBStoAD = (bsY, bsM, bsD) => {
    if (bsY < 2000 || bsY > 2090) return null;
    let daysPassed = 0, currY = REF_BS_YEAR, currM = REF_BS_MONTH;
    while (currY < bsY || (currY === bsY && currM < bsM)) {
        daysPassed += nepaliMonthDays[currY][currM];
        currM++;
        if (currM > 11) { currM = 0; currY++; }
    }
    daysPassed += bsD - REF_BS_DAY;
    const targetAD = new Date(Date.UTC(REF_AD_YEAR, REF_AD_MONTH, REF_AD_DAY));
    targetAD.setUTCDate(targetAD.getUTCDate() + daysPassed);
    return { year: targetAD.getUTCFullYear(), month: targetAD.getUTCMonth(), day: targetAD.getUTCDate(), weekdayIndex: targetAD.getUTCDay() };
};

const devMap = {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'};
const toDevanagari = (num) => String(num).split('').map(c => devMap[c] || c).join('');

document.addEventListener('DOMContentLoaded', () => {
    
    const now = new Date();
    const todayAd = { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
    const todayBsRaw = convertADtoBS(todayAd.year, todayAd.month, todayAd.day);
    const todayBs = todayBsRaw || { year: 2082, month: 11, day: 8 };

    let calBsYear = todayBs.year, calBsMonth = todayBs.month;
    let calAdYear = todayAd.year, calAdMonth = todayAd.month;

    // 1. Live Date (Updated Format with Bug Fix)
    document.getElementById('current-date-text').textContent = 
        `आज: मिति ${toDevanagari(todayBs.year)} साल ${nepMonthsDevanagari[todayBs.month]} ${toDevanagari(todayBs.day)} गते, ${nepWeekdays[todayBs.weekdayIndex]} | ${engMonths[todayAd.month]} ${todayAd.day}, ${todayAd.year}, ${engWeekdays[now.getDay()]}`;

    // 2. Populate Dropdowns (Forms + Calendars)
    const populateAllDropdowns = () => {
        const adY = document.getElementById('ad-year');
        const adM = document.getElementById('ad-month');
        const adD = document.getElementById('ad-day');
        const bsY = document.getElementById('bs-year');
        const bsM = document.getElementById('bs-month');
        const bsD = document.getElementById('bs-day');
        
        const calAdY = document.getElementById('cal-ad-year-select');
        const calAdM = document.getElementById('cal-ad-month-select');
        const calBsY = document.getElementById('cal-bs-year-select');
        const calBsM = document.getElementById('cal-bs-month-select');

        // Populate Years
        for(let y=1944; y<=2033; y++) {
            adY.add(new Option(y, y));
            calAdY.add(new Option(y, y));
        }
        for(let y=2000; y<=2090; y++) {
            bsY.add(new Option(toDevanagari(y), y));
            calBsY.add(new Option(toDevanagari(y), y));
        }

        // Populate Months
        engMonths.forEach((m, i) => {
            adM.add(new Option(m, i));
            calAdM.add(new Option(m, i));
        });
        nepMonthsDevanagari.forEach((m, i) => {
            bsM.add(new Option(m, i));
            calBsM.add(new Option(m, i));
        });

        // Set Form Defaults
        adY.value = todayAd.year;
        adM.value = todayAd.month;
        for(let i=1; i<=31; i++) adD.add(new Option(i, i));
        adD.value = todayAd.day;

        bsY.value = todayBs.year;
        bsM.value = todayBs.month;
        for(let i=1; i<=32; i++) bsD.add(new Option(toDevanagari(i), i));
        bsD.value = todayBs.day;
    };
    populateAllDropdowns();

    // 3. Dynamic Form Days Update
    const updateAdDays = () => {
        const dSel = document.getElementById('ad-day');
        const curr = dSel.value;
        const max = getAdDaysInMonth(parseInt(document.getElementById('ad-year').value), parseInt(document.getElementById('ad-month').value));
        dSel.innerHTML = '';
        for(let i=1; i<=max; i++) dSel.add(new Option(i, i));
        dSel.value = curr <= max ? curr : max;
    };
    const updateBsDays = () => {
        const dSel = document.getElementById('bs-day');
        const curr = dSel.value;
        const y = parseInt(document.getElementById('bs-year').value);
        const m = parseInt(document.getElementById('bs-month').value);
        if(nepaliMonthDays[y]) {
            const max = nepaliMonthDays[y][m];
            dSel.innerHTML = '';
            for(let i=1; i<=max; i++) dSel.add(new Option(toDevanagari(i), i));
            dSel.value = curr <= max ? curr : max;
        }
    };
    document.getElementById('ad-year').addEventListener('change', updateAdDays);
    document.getElementById('ad-month').addEventListener('change', updateAdDays);
    document.getElementById('bs-year').addEventListener('change', updateBsDays);
    document.getElementById('bs-month').addEventListener('change', updateBsDays);

    // 4. Tab Logic
    const setupTabs = (btnClass) => {
        document.querySelectorAll(btnClass).forEach(btn => {
            btn.addEventListener('click', (e) => {
                const parent = e.target.closest('.card-container');
                parent.querySelectorAll(btnClass).forEach(b => b.classList.remove('active'));
                parent.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                document.getElementById(e.target.dataset.tab).classList.add('active');
                if (btnClass === '.main-tab') document.getElementById('output-section').classList.add('hidden');
            });
        });
    };
    setupTabs('.main-tab'); setupTabs('.cal-tab');

    // 5. Form Submission
    const showResult = (text) => {
        document.getElementById('error-message').classList.add('hidden');
        document.getElementById('result-text').textContent = text;
        document.getElementById('output-section').classList.remove('hidden');
    };
    const showError = (text) => {
        document.getElementById('result-text').textContent = '';
        document.getElementById('error-message').textContent = text;
        document.getElementById('error-message').classList.remove('hidden');
        document.getElementById('output-section').classList.remove('hidden');
    };

    document.getElementById('form-ad-to-bs').addEventListener('submit', (e) => {
        e.preventDefault();
        const res = convertADtoBS(parseInt(document.getElementById('ad-year').value), parseInt(document.getElementById('ad-month').value), parseInt(document.getElementById('ad-day').value));
        if(res) showResult(`${toDevanagari(res.year)} ${nepMonthsDevanagari[res.month]} ${toDevanagari(res.day)}, ${nepWeekdays[res.weekdayIndex]}`);
        else showError("Out of range.");
    });

    document.getElementById('form-bs-to-ad').addEventListener('submit', (e) => {
        e.preventDefault();
        const res = convertBStoAD(parseInt(document.getElementById('bs-year').value), parseInt(document.getElementById('bs-month').value), parseInt(document.getElementById('bs-day').value));
        if(res) showResult(`${res.year} ${engMonths[res.month]} ${res.day}, ${engWeekdays[res.weekdayIndex]}`);
        else showError("Out of range.");
    });

    document.querySelectorAll('.reset-btn').forEach(b => b.addEventListener('click', () => document.getElementById('output-section').classList.add('hidden')));

    document.getElementById('copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(document.getElementById('result-text').textContent);
        document.getElementById('copy-btn').style.color = 'var(--color-success)';
        setTimeout(() => document.getElementById('copy-btn').style.color = '', 2000);
    });

    // 6. Calendar Logic
    const renderBsCalendar = () => {
        document.getElementById('cal-bs-year-select').value = calBsYear;
        document.getElementById('cal-bs-month-select').value = calBsMonth;
        
        const firstDayAd = convertBStoAD(calBsYear, calBsMonth, 1);
        if(!firstDayAd) return;
        
        const totalDays = nepaliMonthDays[calBsYear][calBsMonth];
        const cont = document.getElementById('bs-cal-days');
        cont.innerHTML = '';

        // Detect if we are on the new Pro Calendar (cal.html)
        const isPro = document.querySelector('.pro-date-grid') !== null;

        // 1. Render Previous Month (Muted or Empty)
        let prevY = calBsYear, prevM = calBsMonth - 1;
        if (prevM < 0) { prevM = 11; prevY--; }
        
        if (isPro && nepaliMonthDays[prevY]) {
            const prevTotalDays = nepaliMonthDays[prevY][prevM];
            const startPrevDay = prevTotalDays - firstDayAd.weekdayIndex + 1;
            for (let i = 0; i < firstDayAd.weekdayIndex; i++) {
                let pDay = startPrevDay + i;
                const pAdDate = convertBStoAD(prevY, prevM, pDay);
                let engLabel = pAdDate ? pAdDate.day : '';
                if (pAdDate && pAdDate.day === 1) engLabel = engMonths[pAdDate.month].substring(0,3) + " " + pAdDate.day;
                
                cont.innerHTML += `<div class="cal-day muted">${toDevanagari(pDay)}<span class="eng-date-small">${engLabel}</span></div>`;
            }
        } else {
            for (let i = 0; i < firstDayAd.weekdayIndex; i++) cont.innerHTML += `<div class="cal-day empty"></div>`;
        }

        // 2. Render Current Month
        for (let i = 1; i <= totalDays; i++) {
            const isToday = (todayBs.year === calBsYear && todayBs.month === calBsMonth && todayBs.day === i);
            
            if (isPro) {
                const adDate = convertBStoAD(calBsYear, calBsMonth, i);
                let engLabel = adDate ? adDate.day : '';
                if (adDate && adDate.day === 1) engLabel = engMonths[adDate.month].substring(0,3) + " " + adDate.day;

                cont.innerHTML += `<div class="cal-day ${isToday ? 'today' : ''}">${toDevanagari(i)}<span class="eng-date-small">${engLabel}</span></div>`;
            } else {
                cont.innerHTML += `<div class="cal-day ${isToday ? 'today' : ''}">${toDevanagari(i)}</div>`;
            }
        }

        // 3. Render Next Month to fill out the grid nicely (Pro Only)
        if (isPro) {
            const totalCells = firstDayAd.weekdayIndex + totalDays;
            const remainingCells = (7 - (totalCells % 7)) % 7;
            
            if (remainingCells > 0) {
                let nextY = calBsYear, nextM = calBsMonth + 1;
                if (nextM > 11) { nextM = 0; nextY++; }
                for (let i = 1; i <= remainingCells; i++) {
                    const nAdDate = convertBStoAD(nextY, nextM, i);
                    let engLabel = nAdDate ? nAdDate.day : '';
                    if (nAdDate && nAdDate.day === 1) engLabel = engMonths[nAdDate.month].substring(0,3) + " " + nAdDate.day;
                    
                    cont.innerHTML += `<div class="cal-day muted">${toDevanagari(i)}<span class="eng-date-small">${engLabel}</span></div>`;
                }
            }
        }
    };

    const renderAdCalendar = () => {
        document.getElementById('cal-ad-year-select').value = calAdYear;
        document.getElementById('cal-ad-month-select').value = calAdMonth;
        
        const firstDay = new Date(calAdYear, calAdMonth, 1).getDay();
        const totalDays = new Date(calAdYear, calAdMonth + 1, 0).getDate();
        const cont = document.getElementById('ad-cal-days');
        cont.innerHTML = '';

        for (let i = 0; i < firstDay; i++) cont.innerHTML += `<div class="cal-day empty"></div>`;
        for (let i = 1; i <= totalDays; i++) {
            const isToday = (todayAd.year === calAdYear && todayAd.month === calAdMonth && todayAd.day === i);
            cont.innerHTML += `<div class="cal-day ${isToday ? 'today' : ''}">${i}</div>`;
        }
    };

    renderBsCalendar(); renderAdCalendar();

    // Sync Calendar Dropdowns
    document.getElementById('cal-bs-year-select').addEventListener('change', (e) => { calBsYear = parseInt(e.target.value); renderBsCalendar(); });
    document.getElementById('cal-bs-month-select').addEventListener('change', (e) => { calBsMonth = parseInt(e.target.value); renderBsCalendar(); });
    
    document.getElementById('cal-ad-year-select').addEventListener('change', (e) => { calAdYear = parseInt(e.target.value); renderAdCalendar(); });
    document.getElementById('cal-ad-month-select').addEventListener('change', (e) => { calAdMonth = parseInt(e.target.value); renderAdCalendar(); });

    // Sync Prev/Next Buttons
    document.getElementById('bs-cal-prev').addEventListener('click', () => {
        calBsMonth--; if (calBsMonth < 0) { calBsMonth = 11; calBsYear--; }
        if(calBsYear >= 2000) renderBsCalendar(); else calBsMonth = 0;
    });
    document.getElementById('bs-cal-next').addEventListener('click', () => {
        calBsMonth++; if (calBsMonth > 11) { calBsMonth = 0; calBsYear++; }
        if(calBsYear <= 2090) renderBsCalendar(); else calBsMonth = 11;
    });
    document.getElementById('ad-cal-prev').addEventListener('click', () => {
        calAdMonth--; if (calAdMonth < 0) { calAdMonth = 11; calAdYear--; }
        if(calAdYear >= 1944) renderAdCalendar(); else calAdMonth = 0;
    });
    document.getElementById('ad-cal-next').addEventListener('click', () => {
        calAdMonth++; if (calAdMonth > 11) { calAdMonth = 0; calAdYear++; }
        if(calAdYear <= 2033) renderAdCalendar(); else calAdMonth = 11;
    });
});