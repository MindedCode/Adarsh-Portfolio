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
    // अक्षर हटाना
    textElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 100; // डिलीट करते समय स्पीड थोड़ी बढ़ जाती है
  } else {
    // अक्षर जोड़ना
    textElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 200;
  }

  // Logic: जब शब्द पूरा टाइप हो जाए
  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    typeSpeed = 2000; // पूरा शब्द होने पर 2 सेकंड रुकें
  } 
  // Logic: जब शब्द पूरा डिलीट हो जाए
  else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length; // अगले शब्द पर जाएँ
    typeSpeed = 500;
  }

  setTimeout(type, typeSpeed);
}

// शुरू करें
document.addEventListener('DOMContentLoaded', type);