export const setUser = (user: any) => {
    return { type: 'SET_USER', user}
};

export function setUseDarkMode(useDarkMode: boolean) {
    return {
        type: 'SET_THEME',
        useDarkMode
    }
}
