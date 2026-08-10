import { setupErrorClearing } from '/src/scripts/auth/authUtils.js';
import Toast from '/src/scripts/utils/toast.js';

const registerForm = document.querySelector(".register-form");

if (registerForm) {
    const errorClass = "register-form__input--error";
    setupErrorClearing(registerForm, errorClass);

    const inputs = registerForm.querySelectorAll(".register-form__input, .register-form__select");

    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        let hasError = false;

        inputs.forEach((input) => {
            if (input.hasAttribute("required") && !input.value.trim()) {
                input.classList.add(errorClass);
                if (!hasError) {
                    input.focus();
                    hasError = true;
                }
            }
        });

        if (hasError) {
            Toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc!");
            return;
        }

        Toast.success("Đăng ký thông tin trải nghiệm thành công! Chúng tôi sẽ liên hệ lại với bạn sớm nhất.");
        setTimeout(() => {
            window.location.href = "/src/pages/auth/login.html";
        }, 1500);
    });
}
