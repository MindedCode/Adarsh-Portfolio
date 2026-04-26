const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

async function trackEverything() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const isAdminEntry = urlParams.get('show') === 'admin';

        const now = new Date();
        const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;

        // लोकेशन डेटा निकालें
        const geoRes = await fetch('https://ipapi.co/json/');
        const geoData = await geoRes.json();
        const loc = `${geoData.city || 'Unknown'}, ${geoData.region || 'India'}`;

        const commonData = {
            location: loc,
            time: now.toLocaleTimeString(),
            date: now.toLocaleDateString(),
            userAgent: navigator.userAgent.slice(0, 50) // डिवाइस की जानकारी
        };

        // --- SCENARIO 1: किसी ने ADMIN PANEL खोला ---
        if (isAdminEntry) {
            // एडमिन लॉग्स में सेव करें (ताकि पता चले किसने चोरी-छिपे पैनल देखा)
            await fetch(`${dbURL}/admin_access_logs.json`, {
                method: 'POST',
                body: JSON.stringify({ ...commonData, type: "Admin Access" })
            });

            // खुद को 'Malik' मार्क करें ताकि नॉर्मल काउंटिंग में डिस्टर्ब न हो
            localStorage.setItem('is_malik', 'true');
            return;
        }

        // --- SCENARIO 2: नॉर्मल विज़िटर आया ---
        if (localStorage.getItem('is_malik') === 'true') return; // अगर आप खुद नॉर्मल ब्राउज़ कर रहे हैं

        // काउंट बढ़ाना
        const updateStat = async (path) => {
            const r = await fetch(`${dbURL}/stats/${path}.json`);
            const c = await r.json() || 0;
            await fetch(`${dbURL}/stats/${path}.json`, { method: 'PUT', body: JSON.stringify(c + 1) });
        };

        await updateStat('total');
        await updateStat(`days/${dK}`);

        // नॉर्मल विज़िटर लॉग्स
        await fetch(`${dbURL}/logs.json`, {
            method: 'POST',
            body: JSON.stringify({ ...commonData, source: document.referrer || "Direct" })
        });

    } catch (e) { console.log("KaaZra Tracking System Error"); }
}

async function showMasterDashboard() {
    const res = await fetch(`${dbURL}/.json`);
    const data = await res.json() || {};
    const stats = data.stats || {};
    const adminLogs = data.admin_access_logs || {};
    const normalLogs = data.logs || {};

    const div = document.createElement('div');
    div.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:#000; color:#0f0; z-index:999999; font-family:monospace; padding:15px; overflow-y:auto; box-sizing:border-box;";

    // ग्राफ (Last 5 Days)
    let graphHtml = "";
    const days = stats.days || {};
    Object.keys(days).slice(-5).forEach(day => {
        const val = days[day];
        graphHtml += `<div style="margin:5px 0; font-size:10px;">${day} <div style="background:#0f0; display:inline-block; height:8px; width:${val * 5}px;"></div> ${val}</div>`;
    });

    div.innerHTML = `
        <div style="max-width:600px; margin:auto; border:2px solid #0f0; padding:15px; background:#0a0a0a; border-radius:10px;">
            <h2 style="text-align:center; color:#fff; text-shadow:0 0 10px #0f0; margin-top:0;">👑 CONTROL CENTER</h2>
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px;">
                <div style="background:#111; padding:10px; text-align:center; border:1px solid #222;">
                    <small>TOTAL VISITS</small><br><b style="font-size:24px;">${stats.total || 0}</b>
                </div>
                <div style="background:#111; padding:10px; text-align:center; border:1px solid #222;">
                    <small>GRAPH TRACKER</small><br>${graphHtml || 'Wait for data...'}
                </div>
            </div>

            <h4 style="color:red; border-bottom:1px solid red;">🚨 ADMIN PANEL ACCESS HISTORY (Who opened this?)</h4>
            <div style="height:150px; overflow-y:auto; background:#1a0000; padding:5px; font-size:11px; margin-bottom:20px; border:1px solid red;">
                ${Object.values(adminLogs).reverse().map(l => `
                    <div style="border-bottom:1px solid #400; padding:5px 0;">
                        📍 <b>${l.location}</b> | ⏰ ${l.time} | 📅 ${l.date}
                    </div>
                `).join('') || 'No admin access recorded yet.'}
            </div>

            <h4 style="color:#f0f; border-bottom:1px solid #f0f;">📍 RECENT NORMAL VISITORS</h4>
            <div style="height:250px; overflow-y:auto; background:#050505; padding:5px; font-size:11px; border:1px solid #333;">
                ${Object.values(normalLogs).reverse().slice(0, 30).map(l => `
                    <div style="border-bottom:1px solid #222; padding:8px 0;">
                        🌍 [${l.source || 'Direct'}] <b>${l.location}</b><br>
                        <span style="color:#666;">${l.date} at ${l.time}</span>
                    </div>
                `).join('')}
            </div>

            <div style="display:flex; gap:10px; margin-top:20px;">
                <button onclick="location.reload()" style="flex:1; padding:12px; background:#0f0; color:#000; font-weight:bold; border:none; cursor:pointer;">REFRESH</button>
                <button onclick="this.parentElement.parentElement.remove()" style="flex:1; padding:12px; background:#333; color:#fff; border:none; cursor:pointer;">CLOSE</button>
            </div>
        </div>
    `;
    document.body.appendChild(div);
}

// --- START ---
const params = new URLSearchParams(window.location.search);
if (params.get('show') === 'admin') showMasterDashboard();
trackEverything();

// // --- CONFIGURATION ---
// const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

// // --- VISITOR TRACKING (BACKEND) ---
// async function trackVisitor() {
//     try {
//         const urlParams = new URLSearchParams(window.location.search);

//         // 1. मालिक की पहचान: अगर ?show=admin है, तो ब्राउज़र में निशान लगा दो
//         if (urlParams.get('show') === 'admin') {
//             localStorage.setItem('is_malik', 'true');
//         }

//         // 2. अगर मालिक है, तो काउंटिंग यहीं रोक दो
//         if (localStorage.getItem('is_malik') === 'true') {
//             console.log("Pranaam Malik! Tracking disabled for you.");
//             return;
//         }

//         const now = new Date();
//         const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
//         const mK = `${now.getMonth() + 1}-${now.getFullYear()}`;
//         const yK = now.getFullYear();

//         // 3. कहाँ से आया (Referrer)
//         const ref = document.referrer.toLowerCase();
//         let source = "Direct / WhatsApp";
//         if (ref.includes("linkedin")) source = "LinkedIn";
//         else if (ref.includes("facebook") || ref.includes("fb.me")) source = "Facebook";
//         else if (ref.includes("instagram")) source = "Instagram";
//         else if (ref.includes("github")) source = "GitHub";

//         // 4. लोकेशन डेटा (IP API)
//         const geoRes = await fetch('https://ipapi.co/json/');
//         const geoData = await geoRes.json();

//         const visitData = {
//             source,
//             city: geoData.city || "Unknown",
//             country: geoData.country_name || "Unknown",
//             time: now.toLocaleTimeString(),
//             fullDate: now.toLocaleDateString()
//         };

//         // 5. Firebase में काउंट बढ़ाना
//         const updateCount = async (path) => {
//             const r = await fetch(`${dbURL}/stats/${path}.json`);
//             const c = await r.json() || 0;
//             await fetch(`${dbURL}/stats/${path}.json`, { method: 'PUT', body: JSON.stringify(c + 1) });
//         };

//         await updateCount('total');
//         await updateCount(`years/${yK}`);
//         await updateCount(`months/${mK}`);
//         await updateCount(`days/${dK}`);

//         // 6. लॉग्स सेव करना (History)
//         await fetch(`${dbURL}/logs.json`, { method: 'POST', body: JSON.stringify(visitData) });

//     } catch (e) { console.log("Tracking error..."); }
// }

// // --- ADMIN PANEL UI (FRONTEND) ---
// async function showAdminPanel() {
//     try {
//         const res = await fetch(`${dbURL}/.json`);
//         const data = await res.json();
//         const stats = data.stats || {};
//         const now = new Date();
//         const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
//         const mK = `${now.getMonth() + 1}-${now.getFullYear()}`;

//         const div = document.createElement('div');
//         div.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); color:#0f0; z-index:99999; font-family:monospace; padding:20px; overflow-y:auto; box-sizing:border-box;";

//         div.innerHTML = `
//             <div style="max-width:550px; margin:auto; border:2px solid #0f0; padding:20px; border-radius:15px; box-shadow: 0 0 20px #0f0;">
//                 <h1 style="text-align:center; color:#fff; text-shadow: 0 0 10px #0f0; margin-top:0;">👑 MASTER DASHBOARD</h1>

//                 <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin:25px 0;">
//                     <div style="background:#111; border:1px solid #333; padding:15px; text-align:center; border-radius:10px;">
//                         <small style="color:#888;">TODAY</small><br><b style="font-size:24px;">${stats.days?.[dK] || 0}</b>
//                     </div>
//                     <div style="background:#111; border:1px solid #333; padding:15px; text-align:center; border-radius:10px;">
//                         <small style="color:#888;">MONTH</small><br><b style="font-size:24px;">${stats.months?.[mK] || 0}</b>
//                     </div>
//                     <div style="background:#020; border:1px solid #0f0; padding:15px; text-align:center; border-radius:10px; grid-column: span 2;">
//                         <small style="color:#ccc;">TOTAL ALL TIME</small><br><b style="font-size:32px; color:#fff;">${stats.total || 0}</b>
//                     </div>
//                 </div>

//                 <h3 style="border-bottom:1px solid #333; padding-bottom:5px;">RECENT ACTIVITY</h3>
//                 <div style="background:#0a0a0a; padding:10px; border-radius:8px; max-height:300px; overflow-y:auto;">
//                     ${Object.values(data.logs || {}).reverse().slice(0, 15).map(log => `
//                         <div style="margin-bottom:10px; border-bottom:1px solid #222; padding-bottom:8px; font-size:12px;">
//                             <span style="color:#f0f; font-weight:bold;">[${log.source}]</span> 
//                             <span style="color:#fff;">${log.city}, ${log.country}</span>
//                             <div style="color:#888; margin-top:3px;">⏰ ${log.time} | ${log.fullDate || ''}</div>
//                         </div>
//                     `).join('')}
//                 </div>

//                 <button onclick="this.parentElement.parentElement.remove()" style="margin-top:25px; width:100%; background:#0f0; color:#000; border:none; padding:15px; font-weight:bold; border-radius:8px; cursor:pointer; font-size:16px;">EXIT PANEL</button>
//             </div>`;
//         document.body.appendChild(div);
//     } catch (e) { alert("Data load fail!"); }
// }

// // --- EXECUTION ---
// const urlParams = new URLSearchParams(window.location.search);
// if (urlParams.get('show') === 'admin') {
//     showAdminPanel();
// }
// trackVisitor();

// for slider code

$(document).ready(function () {
    $('.slider').slick({
        arrows: false,
        dots: true,
        appendDots: '.slider-dots',
        dotsClass: 'dots'
    })
})

let hamberger = document.querySelector('.hamberger');
let times = document.querySelector('.times');
let mobileNav = document.querySelector('.mobile-nav');
let about = document.querySelector('.about');
let home = document.querySelector('a[href="#home"]');
let skills = document.querySelector('a[href="#skills"]');
let certificates = document.querySelector('a[href="#certificates"]');
let projects = document.querySelector('a[href="#projects"]');
let contact = document.querySelector('a[href="#contact"]');

hamberger.addEventListener('click', function () {
    mobileNav.classList.add('open');
});
times.addEventListener('click', function () {
    mobileNav.classList.remove('open');
});
mobileNav.addEventListener('click', function () {
    mobileNav.classList.remove('open');
});

about.addEventListener('click', function () {
    mobileNav.classList.remove('open');
})
hamberger.addEventListener('click', function () {
    mobileNav.classList.add('open');
});

times.addEventListener('click', function () {
    mobileNav.classList.remove('open');
});

about.addEventListener('click', function () {
    mobileNav.classList.remove('open');
});

home.addEventListener('click', function () {
    mobileNav.classList.remove('open');
});

skills.addEventListener('click', function () {
    mobileNav.classList.remove('open');
});

certificates.addEventListener('click', function () {
    mobileNav.classList.remove('open');
});

projects.addEventListener('click', function () {
    mobileNav.classList.remove('open');
});

// contact.addEventListener('click', function(){
//     mobileNav.classList.remove('open');
// });

// for text animation
const textElement = document.getElementById('typewriter');
const words = ["Web Developer", "Web Designer", "Problem Solver"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 200;

function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
        // remove letter
        textElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 100; // Slight speed increase when deleting
    } else {
        // Add the Letter
        textElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 200;
    }

    // Logic: When the word is completely typed
    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typeSpeed = 1500; // Wait 1.5 seconds for the entire word to be written.
    }
    // Logic: when the word is completely delete
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length; // Go to next word
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// for start
document.addEventListener('DOMContentLoaded', type);