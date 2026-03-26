/**
 * Utility Studio - Embeddable Nepali Date Widget
 * Author: Kishor Aryal
 */
(function() {
    const devMap = {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'};
    const toDevanagari = (num) => String(num).split('').map(c => devMap[c] || c).join('');
    
    const engMonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const nepMonthsDevanagari = ['वैशाख','जेष्ठ','आषाढ','श्रावण','भाद्र','आश्विन','कार्तिक','मंसिर','पौष','माघ','फाल्गुण','चैत्र'];
    const engWeekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const nepWeekdays = ['आइतबार','सोमबार','मंगलबार','बुधबार','बिहीबार','शुक्रबार','शनिबार'];

    // Compressed matrix for accurate dates (2079 to 2090 for lightweight embed)
    const recentNepDays = {
        2079: [31,31,32,31,31,31,30,29,30,29,30,30], 2080: [31,32,31,32,31,30,30,30,29,29,30,30],
        2081: [31,32,31,32,31,30,30,30,29,30,29,31], 2082: [31,31,32,31,31,31,30,29,30,29,30,30],
        2083: [31,31,32,31,31,30,30,30,29,30,30,30], 2084: [31,31,32,31,31,30,30,30,29,30,30,30],
        2085: [31,32,31,32,30,31,30,30,29,30,30,30], 2086: [30,32,31,32,31,30,30,30,29,30,30,30],
        2087: [31,31,32,31,31,31,30,30,29,30,30,30], 2088: [30,31,32,32,30,31,30,30,29,30,30,30],
        2089: [30,32,31,32,31,30,30,30,29,30,30,30], 2090: [30,32,31,32,31,30,30,30,29,30,30,30]
    };

    function getAdToBs(adDate) {
        const refAd = new Date(Date.UTC(2022, 3, 14)); // Ref: April 14, 2022 -> Baisakh 1, 2079
        let daysPassed = Math.floor(Date.UTC(adDate.getFullYear(), adDate.getMonth(), adDate.getDate()) / 86400000) - Math.floor(refAd.getTime() / 86400000);
        
        let bsY = 2079, bsM = 0, bsD = 1;
        while (daysPassed > 0) {
            if (!recentNepDays[bsY]) return null;
            let daysLeft = recentNepDays[bsY][bsM] - bsD + 1;
            if (daysPassed >= daysLeft) { daysPassed -= daysLeft; bsD = 1; bsM++; if (bsM > 11) { bsM = 0; bsY++; } } 
            else { bsD += daysPassed; daysPassed = 0; }
        }
        return { year: bsY, month: bsM, day: bsD, w: adDate.getDay() };
    }

    // Auto-inject on load
    window.addEventListener('DOMContentLoaded', () => {
        const targetDiv = document.getElementById('us-nepali-date-widget');
        if (!targetDiv) return;

        const today = new Date();
        const bsDate = getAdToBs(today) || { year: 2082, month: 11, day: 13, w: 5 }; // Fallback

        const textString = `आज: मिति ${toDevanagari(bsDate.year)} साल ${nepMonthsDevanagari[bsDate.month]} ${toDevanagari(bsDate.day)} गते, ${nepWeekdays[bsDate.w]} | ${engMonths[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}, ${engWeekdays[today.getDay()]}`;

        // Apply styles if the user didn't write their own CSS
        targetDiv.style.fontFamily = "sans-serif";
        targetDiv.style.padding = "10px 15px";
        targetDiv.style.borderRadius = "8px";
        targetDiv.style.display = "inline-flex";
        targetDiv.style.alignItems = "center";
        targetDiv.style.gap = "8px";
        targetDiv.innerHTML = `<span style="display:inline-block; width:10px; height:10px; background:#10b981; border-radius:50%; box-shadow:0 0 8px #10b981;"></span> <span>${textString}</span>`;
    });
})();