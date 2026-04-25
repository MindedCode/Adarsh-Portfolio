// 1. ID वही रखें जो HTML में है
var contactForm = document.getElementById("contact-form");

async function handleSubmit(event) {
    event.preventDefault();
    var status = document.getElementById("my-form-status");
    var data = new FormData(event.target);

    // 2. बटन की सही ID का उपयोग करें
    var button = document.getElementById("submit-btn");

    button.disabled = true;
    status.innerHTML = "Processing...";

    fetch(event.target.action, {
        method: contactForm.method, // यहाँ contactForm का उपयोग करें
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            status.style.color = "#28a745";
            status.innerHTML = "शुक्रिया! आपका संदेश हमें मिल गया है। 😊";
            contactForm.reset();
        } else {
            status.style.color = "red";
            status.innerHTML = "ओह! कुछ गड़बड़ हो गई।";
        }
    }).catch(error => {
        status.style.color = "red";
        status.innerHTML = "इंटरनेट कनेक्शन चेक करें।";
    }).finally(() => {
        button.disabled = false;
    });
}

contactForm.addEventListener("submit", handleSubmit);