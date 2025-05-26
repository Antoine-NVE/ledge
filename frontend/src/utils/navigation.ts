export const navigateToLogin = () => {
    window.dispatchEvent(new CustomEvent('unauthorized'));
};
