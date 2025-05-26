export const navigateToLogin = () => {
    const currentPath = window.location.pathname;
    if (currentPath === '/login' || currentPath === '/register') return;

    window.dispatchEvent(new CustomEvent('unauthorized'));
};
