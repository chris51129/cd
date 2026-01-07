/**
 * Navigation utilities
 * Abstracting window.location interactions for better testability
 */

export const reloadPage = (win = window) => {
    if (!win || !win.location) return;
    win.location.reload();
};

export const navigateTo = (url, win = window) => {
    if (!win || !win.location) return;
    win.location.href = url;
};
