
const initData = {
    user: null,
    useDarkMode: true
}

const userReducer = ( state = initData, action: any ) => {
switch (action.type) {
    case 'SET_USER':
        return {
            ...state,
            user: action.user
        }
    case 'SET_THEME':
        return {
            ...state,
            useDarkMode: action.useDarkMode
        }
    default:
        return {
            ...state
        }
    }
}

export default userReducer;