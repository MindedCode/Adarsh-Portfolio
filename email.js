var contactForm = document.getElementById("contact-form");
var thankYouBox = document.getElementById("thank-you-message");
var statusMsg = document.getElementById("my-form-status");

async function handleSubmit(event) {
    event.preventDefault();
    var data = new FormData(event.target);
    var button = document.getElementById("submit-btn");
    
    // Disable the button to prevent repeated clicking
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
            // --- Here's where the magic begins ---
            contactForm.style.display = "none"; //form missing
            thankYouBox.style.display = "block"; // Thank you message appears
            thankYouBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // If an error occurs, return the correct button
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
// Add an event listener to the form
if (contactForm) {
    contactForm.addEventListener("submit", handleSubmit);
}