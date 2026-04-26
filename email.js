var contactForm = document.getElementById("contact-form");
var thankYouBox = document.getElementById("thank-you-message");
var statusMsg = document.getElementById("my-form-status");

async function handleSubmit(event) {
    event.preventDefault();
    var data = new FormData(event.target);
    var button = document.getElementById("submit-btn");
    
    // बटन को डिसेबल करें ताकि बार-बार क्लिक न हो
    button.disabled = true;
    button.innerHTML = "Sending...";

    fetch(event.target.action, {
        method: 'POST',
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            // --- यहाँ से मैजिक शुरू होता है ---
            contactForm.style.display = "none"; // फॉर्म गायब
            thankYouBox.style.display = "block"; // थैंक यू मैसेज प्रकट
            thankYouBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // अगर एरर आए तो बटन वापस ठीक करें
            button.disabled = false;
            button.innerHTML = "Send Message";
            statusMsg.style.color = "red";
            statusMsg.innerHTML = "Error! Please try again.";
        }
    }).catch(error => {
        button.disabled = false;
        button.innerHTML = "Send Message";
        statusMsg.style.color = "red";
        statusMsg.innerHTML = "Network connection problem.";
    });
}

// फॉर्म पर इवेंट लिसनर लगाएँ
if (contactForm) {
    contactForm.addEventListener("submit", handleSubmit);
}