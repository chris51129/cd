/**
 * Navigation utilities
 * Abstracting window.location interactions for better testability
 */

export const reloadPage = (win: Window = window): void => {
    if (!win || !win.location) return;
    win.location.reload();
};

export const navigateTo = (url: string, win: Window = window): void => {
    if (!win || !win.location) return;
    win.location.href = url;
};
