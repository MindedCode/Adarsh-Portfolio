// --- CONFIGURATION ---
const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

// --- VISITOR TRACKING (BACKEND) ---
async function trackVisitor() {
    try {
        const urlParams = new URLSearchParams(window.location.search);

        // 1. मालिक की पहचान: अगर ?show=admin है, तो ब्राउज़र में निशान लगा दो
        if (urlParams.get('show') === 'admin') {
            localStorage.setItem('is_malik', 'true');
        }

        // 2. अगर मालिक है, तो काउंटिंग यहीं रोक दो
        if (localStorage.getItem('is_malik') === 'true') {
            console.log("Pranaam Malik! Tracking disabled for you.");
            return;
        }

        const now = new Date();
        const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
        const mK = `${now.getMonth() + 1}-${now.getFullYear()}`;
        const yK = now.getFullYear();

        // 3. कहाँ से आया (Referrer)
        const ref = document.referrer.toLowerCase();
        let source = "Direct / WhatsApp";
        if (ref.includes("linkedin")) source = "LinkedIn";
        else if (ref.includes("facebook") || ref.includes("fb.me")) source = "Facebook";
        else if (ref.includes("instagram")) source = "Instagram";
        else if (ref.includes("github")) source = "GitHub";

        // 4. लोकेशन डेटा (IP API)
        const geoRes = await fetch('https://ipapi.co/json/');
        const geoData = await geoRes.json();

        const visitData = {
            source,
            city: geoData.city || "Unknown",
            country: geoData.country_name || "Unknown",
            time: now.toLocaleTimeString(),
            fullDate: now.toLocaleDateString()
        };

        // 5. Firebase में काउंट बढ़ाना
        const updateCount = async (path) => {
            const r = await fetch(`${dbURL}/stats/${path}.json`);
            const c = await r.json() || 0;
            await fetch(`${dbURL}/stats/${path}.json`, { method: 'PUT', body: JSON.stringify(c + 1) });
        };

        await updateCount('total');
        await updateCount(`years/${yK}`);
        await updateCount(`months/${mK}`);
        await updateCount(`days/${dK}`);

        // 6. लॉग्स सेव करना (History)
        await fetch(`${dbURL}/logs.json`, { method: 'POST', body: JSON.stringify(visitData) });

    } catch (e) { console.log("Tracking error..."); }
}

// --- ADMIN PANEL UI (FRONTEND) ---
async function showAdminPanel() {
    try {
        const res = await fetch(`${dbURL}/.json`);
        const data = await res.json();
        const stats = data.stats || {};
        const now = new Date();
        const dK = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
        const mK = `${now.getMonth() + 1}-${now.getFullYear()}`;

        const div = document.createElement('div');
        div.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); color:#0f0; z-index:99999; font-family:monospace; padding:20px; overflow-y:auto; box-sizing:border-box;";

        div.innerHTML = `
            <div style="max-width:550px; margin:auto; border:2px solid #0f0; padding:20px; border-radius:15px; box-shadow: 0 0 20px #0f0;">
                <h1 style="text-align:center; color:#fff; text-shadow: 0 0 10px #0f0; margin-top:0;">👑 MASTER DASHBOARD</h1>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin:25px 0;">
                    <div style="background:#111; border:1px solid #333; padding:15px; text-align:center; border-radius:10px;">
                        <small style="color:#888;">TODAY</small><br><b style="font-size:24px;">${stats.days?.[dK] || 0}</b>
                    </div>
                    <div style="background:#111; border:1px solid #333; padding:15px; text-align:center; border-radius:10px;">
                        <small style="color:#888;">MONTH</small><br><b style="font-size:24px;">${stats.months?.[mK] || 0}</b>
                    </div>
                    <div style="background:#020; border:1px solid #0f0; padding:15px; text-align:center; border-radius:10px; grid-column: span 2;">
                        <small style="color:#ccc;">TOTAL ALL TIME</small><br><b style="font-size:32px; color:#fff;">${stats.total || 0}</b>
                    </div>
                </div>

                <h3 style="border-bottom:1px solid #333; padding-bottom:5px;">RECENT ACTIVITY</h3>
                <div style="background:#0a0a0a; padding:10px; border-radius:8px; max-height:300px; overflow-y:auto;">
                    ${Object.values(data.logs || {}).reverse().slice(0, 15).map(log => `
                        <div style="margin-bottom:10px; border-bottom:1px solid #222; padding-bottom:8px; font-size:12px;">
                            <span style="color:#f0f; font-weight:bold;">[${log.source}]</span> 
                            <span style="color:#fff;">${log.city}, ${log.country}</span>
                            <div style="color:#888; margin-top:3px;">⏰ ${log.time} | ${log.fullDate || ''}</div>
                        </div>
                    `).join('')}
                </div>

                <button onclick="this.parentElement.parentElement.remove()" style="margin-top:25px; width:100%; background:#0f0; color:#000; border:none; padding:15px; font-weight:bold; border-radius:8px; cursor:pointer; font-size:16px;">EXIT PANEL</button>
            </div>`;
        document.body.appendChild(div);
    } catch (e) { alert("Data load fail!"); }
}

// --- EXECUTION ---
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('show') === 'admin') {
    showAdminPanel();
}
trackVisitor();

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