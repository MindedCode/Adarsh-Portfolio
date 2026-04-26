// 1. Firebase को सीधे लोड करने के लिए (CDN तरीका)
const dbURL = "https://adarsh-awesome-portfolio-default-rtdb.firebaseio.com";

async function trackVisitor() {
    try {
        // विजिटर डेटा (IPAPI से)
        const geoRes = await fetch('https://ipapi.co/json/');
        const geoData = await geoRes.json();
        
        const visitData = {
            city: geoData.city || "Unknown",
            country: geoData.country_name || "Unknown",
            time: new Date().toLocaleString()
        };

        // 2. पुराने काउंट को पढ़ना
        const countRes = await fetch(`${dbURL}/totalCount.json`);
        let currentCount = await countRes.json() || 0;
        
        // 3. काउंट बढ़ाना (PUT)
        await fetch(`${dbURL}/totalCount.json`, {
            method: 'PUT',
            body: JSON.stringify(currentCount + 1)
        });

        // 4. लॉग्स सेव करना (POST)
        await fetch(`${dbURL}/logs.json`, {
            method: 'POST',
            body: JSON.stringify(visitData)
        });

    } catch (e) {
        console.log("Tracking skip...");
    }
}

// एडमिन चेक (URL में ?show=admin होने पर)
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('show') === 'admin') {
    showMyStats();
}

async function showMyStats() {
    const res = await fetch(`${dbURL}/.json`);
    const data = await res.json();
    
    const div = document.createElement('div');
    div.style = "position:fixed; top:10px; left:10px; background:rgba(0,0,0,0.9); color:#00ff00; padding:15px; border-radius:8px; z-index:9999; font-family:monospace; border:1px solid #00ff00; max-height:80vh; overflow-y:auto; width:250px;";
    
    div.innerHTML = `
        <h3 style="margin:0 0 10px 0;">📊 Admin Panel</h3>
        <p style="font-size:20px;">Visits: <b>${data.totalCount || 0}</b></p>
        <hr style="border:0.5px solid #333;">
        <p>Recent Logs:</p>
        <div id="logs-list" style="font-size:11px;"></div>
        <button onclick="this.parentElement.remove()" style="margin-top:10px; width:100%; cursor:pointer;">Close</button>
    `;
    
    document.body.appendChild(div);
    
    if(data.logs) {
        const logsDiv = document.getElementById('logs-list');
        Object.values(data.logs).reverse().slice(0, 5).forEach(log => {
            logsDiv.innerHTML += `<div>📍 ${log.city} (${log.time})</div><br>`;
        });
    }
}

trackVisitor();

$(document).ready(function() {
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
times.addEventListener('click', function(){
    mobileNav.classList.remove('open');
});
mobileNav.addEventListener('click', function(){
    mobileNav.classList.remove('open');
});

about.addEventListener('click', function(){
    mobileNav.classList.remove('open');
})
hamberger.addEventListener('click', function () {
    mobileNav.classList.add('open');
});

times.addEventListener('click', function(){
    mobileNav.classList.remove('open');
});

about.addEventListener('click', function(){
    mobileNav.classList.remove('open');
});

home.addEventListener('click', function(){
    mobileNav.classList.remove('open');
});

skills.addEventListener('click', function(){
    mobileNav.classList.remove('open');
});

certificates.addEventListener('click', function(){
    mobileNav.classList.remove('open');
});

projects.addEventListener('click', function(){
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