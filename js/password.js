const correctPassword = "gsepspot123";

const passwordScreen = document.getElementById("password-screen");
const websiteContent = document.getElementById("website-content");
const passwordForm = document.getElementById("password-form");
const passwordInput = document.getElementById("site-password");
const passwordError = document.getElementById("password-error");

// Keep the page unlocked during this browser tab's session
if (sessionStorage.getItem("website-unlocked") === "true") {
    showWebsite();
}

passwordForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (passwordInput.value === correctPassword) {
        sessionStorage.setItem("website-unlocked", "true");
        showWebsite();
    } else {
        passwordError.textContent = "Incorrect password. Please try again.";
        passwordInput.value = "";
        passwordInput.focus();
    }
});

function showWebsite() {
    passwordScreen.hidden = true;
    websiteContent.hidden = false;
}
