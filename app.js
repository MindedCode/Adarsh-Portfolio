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

contact.addEventListener('click', function(){
    mobileNav.classList.remove('open');
});