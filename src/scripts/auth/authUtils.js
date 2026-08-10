/**
 * Utility helpers cho các module trang Auth
 */

/**
 * Xử lý chuyển đổi ẩn/hiện mật khẩu và đổi Icon Lucide
 * @param {HTMLElement} toggleBtn 
 * @param {HTMLInputElement} passwordInput 
 */
export function togglePasswordVisibility(toggleBtn, passwordInput) {
    if (!toggleBtn || !passwordInput) return;

    const icon = toggleBtn.querySelector("[data-lucide]");
    const isPassword = passwordInput.type === "password";

    if (isPassword) {
        passwordInput.type = "text";
        if (icon) icon.setAttribute("data-lucide", "eye-off");
        toggleBtn.setAttribute("aria-label", "Ẩn mật khẩu");
    } else {
        passwordInput.type = "password";
        if (icon) icon.setAttribute("data-lucide", "eye");
        toggleBtn.setAttribute("aria-label", "Hiển thị mật khẩu");
    }

    if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
    }
}

/**
 * Tự động xóa trạng thái lỗi của các ô input khi người dùng nhập/thay đổi giá trị
 * @param {HTMLFormElement} form 
 * @param {string} errorClass 
 */
export function setupErrorClearing(form, errorClass) {
    if (!form) return;
    const inputs = form.querySelectorAll("input, select, textarea");

    inputs.forEach((input) => {
        const handler = () => input.classList.remove(errorClass);
        input.addEventListener("input", handler);
        input.addEventListener("change", handler);
    });
}
