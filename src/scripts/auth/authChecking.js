import { setupErrorClearing } from '/src/scripts/auth/authUtils.js';
import Toast from '/src/scripts/utils/toast.js';

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginForm = document.querySelector(".login-form");
const submitButton = document.querySelector(".login-form__submit");
const errorClass = "login-form__input--error";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_TIME_SECONDS = 60;

if (loginForm && usernameInput && passwordInput && submitButton) {
    setupErrorClearing(loginForm, errorClass);

    let failedAttempts = parseInt(sessionStorage.getItem("login_failed_attempts") || "0", 10);

    const isEmailValid = (email) => {
        // Cho phép nhập email đúng định dạng hoặc username từ 3 ký tự trở lên
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) || email.trim().length >= 3;
    };

    const lockAccount = () => {
        usernameInput.disabled = true;
        passwordInput.disabled = true;
        submitButton.disabled = true;

        let remainingSeconds = LOCKOUT_TIME_SECONDS;
        submitButton.textContent = `Tạm khóa (${remainingSeconds}s)`;

        Toast.error(`Bạn đã nhập sai quá ${MAX_FAILED_ATTEMPTS} lần. Tài khoản tạm thời bị khóa trong ${LOCKOUT_TIME_SECONDS} giây!`, 5000);

        const countdown = setInterval(() => {
            remainingSeconds--;
            if (remainingSeconds > 0) {
                submitButton.textContent = `Tạm khóa (${remainingSeconds}s)`;
            } else {
                clearInterval(countdown);
                failedAttempts = 0;
                sessionStorage.setItem("login_failed_attempts", "0");
                usernameInput.disabled = false;
                passwordInput.disabled = false;
                submitButton.disabled = false;
                submitButton.textContent = "Đăng nhập";
                Toast.info("Hết thời gian chờ. Bạn có thể thử đăng nhập lại.");
            }
        }, 1000);
    };

    // Kiểm tra xem trước đó có đang trong thời gian khóa hay không
    if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
        lockAccount();
    }

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
            Toast.error(`Tài khoản đang bị tạm khóa. Vui lòng chờ hết thời gian đếm ngược!`);
            return;
        }

        const usernameVal = usernameInput.value.trim();
        const passwordVal = passwordInput.value;

        // 1. Kiểm tra rỗng
        if (!usernameVal || !passwordVal) {
            if (!usernameVal) usernameInput.classList.add(errorClass);
            if (!passwordVal) passwordInput.classList.add(errorClass);
            Toast.error("Bạn đã nhập sai tài khoản hoặc mật khẩu");
            return;
        }

        // 2. Kiểm tra định dạng Email / Mật khẩu
        if (!isEmailValid(usernameVal)) {
            usernameInput.classList.add(errorClass);
            Toast.error("Tài khoản hoặc Email không đúng định dạng!");
            usernameInput.focus();
            return;
        }

        if (passwordVal.length < 6) {
            passwordInput.classList.add(errorClass);
            Toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
            passwordInput.focus();
            return;
        }

        // 3. Giả lập kiểm tra tài khoản & Giới hạn 5 lần sai
        const isMockSuccess = (usernameVal === "admin@vss.vn" || usernameVal === "admin") && passwordVal === "123456";

        if (!isMockSuccess) {
            failedAttempts++;
            sessionStorage.setItem("login_failed_attempts", failedAttempts.toString());

            usernameInput.classList.add(errorClass);
            passwordInput.classList.add(errorClass);

            if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
                lockAccount();
            } else {
                const remaining = MAX_FAILED_ATTEMPTS - failedAttempts;
                Toast.error(`Bạn đã nhập sai tài khoản hoặc mật khẩu (Còn ${remaining} lần thử)`);
            }
            return;
        }

        // 4. Đăng nhập thành công -> Reset đếm sai & Chuyển hướng
        failedAttempts = 0;
        sessionStorage.setItem("login_failed_attempts", "0");
        sessionStorage.setItem("is_authenticated", "true");

        Toast.success("Đăng nhập thành công! Đang chuyển hướng...");

        setTimeout(() => {
            window.location.href = "/index.html";
        }, 1200);
    });
}