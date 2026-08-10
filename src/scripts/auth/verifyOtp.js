import { setupErrorClearing } from '/src/scripts/auth/authUtils.js';
import Toast from '/src/scripts/utils/toast.js';

const otpInput = document.getElementById("otp-code");
const otpForm = document.querySelector(".auth-subform");
const submitButton = document.querySelector(".auth-subform__submit");
const resendButton = document.getElementById("resend-btn");
const errorClass = "auth-subform__input--error";
const activeBtnClass = "auth-subform__submit--active";

if (otpInput && otpForm && submitButton) {
    setupErrorClearing(otpForm, errorClass);

    otpInput.addEventListener("input", () => {
        const value = otpInput.value.trim();

        if (value.length > 0) {
            submitButton.classList.add(activeBtnClass);
            submitButton.disabled = false;
        } else {
            submitButton.classList.remove(activeBtnClass);
            submitButton.disabled = true;
        }
    });

    if (resendButton) {
        resendButton.addEventListener("click", () => {
            let countdown = 60;
            resendButton.disabled = true;
            resendButton.textContent = `Gửi lại mã (${countdown}s)`;

            const timer = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                    resendButton.textContent = `Gửi lại mã (${countdown}s)`;
                } else {
                    clearInterval(timer);
                    resendButton.disabled = false;
                    resendButton.textContent = "Gửi lại mã";
                }
            }, 1000);

            Toast.info("Mã xác minh OTP mới đã được gửi lại vào email của bạn!");
        });
    }

    otpForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const value = otpInput.value.trim();

        if (!value) {
            otpInput.classList.add(errorClass);
            Toast.error("Vui lòng nhập mã xác minh OTP");
            otpInput.focus();
            return;
        }

        window.location.href = "/src/pages/auth/new-password.html";
    });
}
