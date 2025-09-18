import { createContext, useContext, useState } from 'react';

const AuthContext = createContext<{ isLoggedIn: boolean; login: () => void; logout: () => void }>({
    isLoggedIn: false,
    login: () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        return !!localStorage.getItem('checkToken'); // ← persistent login
    });

    const login = () => {
        localStorage.setItem('checkToken', 'mock-token');
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('checkToken');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }
        }>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
