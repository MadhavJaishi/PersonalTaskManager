import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './api-config/api';

interface AuthContextType {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    login: () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        return !!localStorage.getItem('checkToken') || !!localStorage.getItem('user');
    });

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await api.get('/auth/me');
                if (response.data?.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    localStorage.setItem('checkToken', 'true');
                    setIsLoggedIn(true);
                }
            } catch (err) {
                // Keep local session if stored user exists
                if (!localStorage.getItem('user')) {
                    setIsLoggedIn(false);
                }
            }
        };
        verifyAuth();
    }, []);

    const login = () => {
        localStorage.setItem('checkToken', 'true');
        setIsLoggedIn(true);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (e) {
            // ignore network logout errors
        }
        localStorage.removeItem('checkToken');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
