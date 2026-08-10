import { setupErrorClearing } from '/src/scripts/auth/authUtils.js';
import Toast from '/src/scripts/utils/toast.js';

const accountInput = document.getElementById("account");
const forgotForm = document.querySelector(".auth-subform");
const submitButton = document.querySelector(".auth-subform__submit");
const errorClass = "auth-subform__input--error";
const activeBtnClass = "auth-subform__submit--active";

if (accountInput && forgotForm && submitButton) {
    setupErrorClearing(forgotForm, errorClass);

    accountInput.addEventListener("input", () => {
        const value = accountInput.value.trim();

        if (value.length > 0) {
            submitButton.classList.add(activeBtnClass);
            submitButton.disabled = false;
        } else {
            submitButton.classList.remove(activeBtnClass);
            submitButton.disabled = true;
        }
    });

    forgotForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const value = accountInput.value.trim();

        if (!value) {
            accountInput.classList.add(errorClass);
            Toast.error("Vui lòng nhập tài khoản hoặc email của bạn");
            accountInput.focus();
            return;
        }

        window.location.href = "/src/pages/auth/verify-otp.html";
    });
}
