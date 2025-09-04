"use client"

import { LoginCredentials, User } from '@/types/auth';
import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { api_login, authenticate, refresh, api_logout } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    /* Hook to access secure authentication context */

    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used with an AuthProvider')
    }
    return context;
}

export function AuthProvider({ children }: {children: ReactNode }) {
    /* Enhanced AuthProvider that works with HTTP-only */
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const initializeAuth = async () => {
        try {
            const response: any = await authenticate()
            setUser(response.data)

        } catch (error: any) {
            if (error.response?.status === 401) {
                try {
                    await refresh();
                    const res: any = await authenticate();
                    setUser(res.data)
                } catch (error: any) {
                    setUser(null)
                }
            } else{
                setUser(null);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        initializeAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const formData = new FormData();
            formData.append('username', credentials.username)
            formData.append('password', credentials.password)

            await api_login(formData);
            await initializeAuth();

        } catch (error: any) {
            console.error('Login error:', error)
            throw error;
        }
    }

    const logout = async () => {
        setIsLoading(true);

        try {
            await api_logout();
            setUser(null);

        } finally {
            setIsLoading(false);
        }
    };

    const isAuthenticated = !!user;

    const value: AuthContextType = useMemo(() => ({ user, login, logout, isLoading, isAuthenticated }), [user, isLoading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}