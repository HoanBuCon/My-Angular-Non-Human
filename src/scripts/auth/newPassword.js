import { togglePasswordVisibility, setupErrorClearing } from '/src/scripts/auth/authUtils.js';
import Toast from '/src/scripts/utils/toast.js';

const newPasswordInput = document.getElementById("new-password");
const confirmPasswordInput = document.getElementById("confirm-password");
const newPasswordForm = document.querySelector(".auth-subform");
const submitButton = document.querySelector(".auth-subform__submit");
const toggleButtons = document.querySelectorAll(".auth-subform__password-toggle");
const errorClass = "auth-subform__input--error";
const activeBtnClass = "auth-subform__submit--active";

if (newPasswordInput && confirmPasswordInput && newPasswordForm && submitButton) {
    setupErrorClearing(newPasswordForm, errorClass);

    const checkInputs = () => {
        const passVal = newPasswordInput.value.trim();
        const confirmVal = confirmPasswordInput.value.trim();

        if (passVal.length > 0 && confirmVal.length > 0) {
            submitButton.classList.add(activeBtnClass);
            submitButton.disabled = false;
        } else {
            submitButton.classList.remove(activeBtnClass);
            submitButton.disabled = true;
        }
    };

    newPasswordInput.addEventListener("input", checkInputs);
    confirmPasswordInput.addEventListener("input", checkInputs);

    toggleButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");
            const targetInput = document.getElementById(targetId);
            togglePasswordVisibility(btn, targetInput);
        });
    });

    newPasswordForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const passVal = newPasswordInput.value.trim();
        const confirmVal = confirmPasswordInput.value.trim();

        if (!passVal) {
            newPasswordInput.classList.add(errorClass);
            Toast.error("Vui lòng nhập mật khẩu mới");
            newPasswordInput.focus();
            return;
        }

        if (!confirmVal) {
            confirmPasswordInput.classList.add(errorClass);
            Toast.error("Vui lòng nhập lại mật khẩu mới");
            confirmPasswordInput.focus();
            return;
        }

        if (passVal !== confirmVal) {
            confirmPasswordInput.classList.add(errorClass);
            Toast.error("Mật khẩu nhập lại không trùng khớp!");
            confirmPasswordInput.focus();
            return;
        }

        Toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
        setTimeout(() => {
            window.location.href = "/src/pages/auth/login.html";
        }, 1200);
    });
}
