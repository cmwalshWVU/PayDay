
const initData = {
    user: null,
    useDarkMode: true,
    portis: undefined,
    fortmatic: undefined,
    contacts: []
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
    case 'SET_PORTIS':
        return {
            ...state,
            portis: action.portis
        }
    case 'SET_WEB3':
        return {
            ...state,
            web3: action.web3
        }
    case 'SET_FORTMATIC':
        return {
            ...state,
            fortmatic: action.fortmatic
        }
    case 'SET_CONTACTS':
        return {
            ...state,
            contacts: action.contacts
        }
    default:
        return {
            ...state
        }
    }
}

export default userReducer;