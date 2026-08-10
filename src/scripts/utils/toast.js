// Custom toaster

const ICONS = {
    error: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
    success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
};

class Toaster {
    constructor() {
        this.container = null;
    }

    _getOrCreateContainer() {
        if (!this.container || !document.body.contains(this.container)) {
            let container = document.getElementById("toast-container");
            if (!container) {
                container = document.createElement("div");
                container.id = "toast-container";
                container.className = "toast-container";
                document.body.appendChild(container);
            }
            this.container = container;
        }
        return this.container;
    }

    /**
     * Hiển thị Toast
     * @param {Object} options 
     * @param {string} options.message Nội dung thông báo
     * @param {'error'|'success'|'warning'|'info'} [options.type='error'] Loại thông báo
     * @param {number} [options.duration=3500] Thời gian tự ẩn (ms)
     */
    show({ message, type = "error", duration = 3500 }) {
        const container = this._getOrCreateContainer();

        const toast = document.createElement("div");
        toast.className = `toast toast--${type}`;

        const iconSvg = ICONS[type] || ICONS.error;

        toast.innerHTML = `
            <div class="toast__icon-box">
                ${iconSvg}
            </div>
            <div class="toast__content">
                <p class="toast__message">${message}</p>
            </div>
        `;

        container.appendChild(toast);

        // Tự động đóng sau duration
        const timer = setTimeout(() => {
            this.dismiss(toast);
        }, duration);

        // Đóng khi click vào Toast
        toast.addEventListener("click", () => {
            clearTimeout(timer);
            this.dismiss(toast);
        });

        return toast;
    }

    dismiss(toast) {
        if (!toast || toast.classList.contains("toast--hiding")) return;
        toast.classList.add("toast--hiding");
        toast.addEventListener("animationend", () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
    }

    error(message, duration = 3500) {
        return this.show({ message, type: "error", duration });
    }

    success(message, duration = 3500) {
        return this.show({ message, type: "success", duration });
    }

    warning(message, duration = 3500) {
        return this.show({ message, type: "warning", duration });
    }

    info(message, duration = 3500) {
        return this.show({ message, type: "info", duration });
    }
}

const Toast = new Toaster();

if (typeof window !== "undefined") {
    window.Toast = Toast;
}

export default Toast;
