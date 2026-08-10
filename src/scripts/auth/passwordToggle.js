import { togglePasswordVisibility } from '/src/scripts/auth/authUtils.js';

const passwordInput = document.getElementById("password");
const togglePasswordButton = document.querySelector(".login-form__password-toggle");

if (togglePasswordButton && passwordInput) {
    togglePasswordButton.addEventListener("click", () => {
        togglePasswordVisibility(togglePasswordButton, passwordInput);
    });
}