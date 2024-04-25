import { createContext, useEffect, useReducer } from "react";

const INITIAL_STATE = {
    currentUser: JSON.parse(localStorage.getItem("userID")) || null,
};

export const AuthContext = createContext(INITIAL_STATE)

export const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN": {
          return {
            currentUser: action.payload,
          };
        }
        case "LOGOUT": {
          return {
            currentUser: null,
          };
        }
        default:
          return state;
    }
}

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, INITIAL_STATE)

    console.log('AuthContext state: ', state)

    return (
        <AuthContext.Provider value={{currentUser: state.currentUser, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}