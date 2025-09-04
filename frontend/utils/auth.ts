import { API } from "@/lib/api";
import { login, logout, refresh, validate_session } from "@/lib/api";
import { LoginCredentials, TokenResponse, User } from "@/types/auth";

const API_BASED_URL = process.env.NEXT_PUBLIC_SERVER_URL

class SecureAuthService {
    private accessToken: string | null = null;
    private tokenRefreshTimeout: NodeJS.Timeout | null = null;

    /* constructor() {
        // Initialize from server-side validation on app start
        if (typeof window !== 'undefined') {
            this.initializeFromServer();
        }
    } */

    private async initializeFromServer() {
        /* Initialize authentication state by validating HTTP-only cookie */
        try {
            const response = await validate_session();

            if (response) {
                const tokenData: TokenResponse = response.data;
                this.accessToken = tokenData.access_token;
                this.scheduleTokenRefresh();
            }
        } catch (error: any) {
            console.error("No valid session found");
            this.accessToken = null;
        }
    }

    private isTokenExpired(token: string): boolean {
        /* Check if JWT access token is expired */
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            return payload.exp < currentTime;
        } catch {
            return true
        }
    }

    private scheduleTokenRefresh() {
        /* Automatically refresh access token before it expires */

        if (!this.accessToken) return;

        try {
            const payload = JSON.parse(atob(this.accessToken.split('.')[1]))
            const expirationTime = payload.exp * 1000
            const currentTime = Date.now()
            const refreshTime = expirationTime - 60000

            if (refreshTime > currentTime) {
                this.tokenRefreshTimeout = setTimeout(async () => {
                    try {
                        await this.refreshAccessToken()
                    } catch (error: any) {
                        console.error('Failed to refresh token:', error)
                        this.clearTokens();
                    }
                }, refreshTime - currentTime)
            }
        } catch (error: any) {
            console.error('Failed to schedule token refresh:', error);
        }
    }

    async login(credentials: LoginCredentials): Promise<User> {
        /* Authenticate user with HTTP-only cookie for refresh token */
        try {
            const formData = new FormData();
            formData.append('username', credentials.username)
            formData.append('password', credentials.password)

            const response = await login(formData);

            if (!response) {
                throw new Error('Login failed');
            }

            /* const tokenData: TokenResponse = await response.data
            this.accessToken = tokenData.access_token */

            this.scheduleTokenRefresh();

            const user = await this.getCurrentUser();
            return user;
        } catch (error: any) {
            console.error('Login error:', error)
            throw error;
        }
    }

    async refreshAccessToken(): Promise<boolean> {
        try{
            const response = await refresh()
    
            if (!response) {
                this.clearTokens();
                throw new Error('Session expired, please login again')
            }
    
            const tokenData: TokenResponse = await response.data
            this.accessToken = tokenData.access_token;
    
            // Schedule next refresh
            this.scheduleTokenRefresh();
    
            return true;
        } catch (error: any) {
            console.error('Token refresh error:', error);
            this.clearTokens();
            throw error;
        }
    }

    async logout(): Promise<void> {
        /* Secure logout that clears HTTP-only cookies on server */
        try {
            await logout();
        } catch (error: any) {
            console.error('Logout error:', error);
        }

        this.clearTokens();
    }

    private clearTokens() {
        /* Clear access token from memory
        HTTP-only cookies are cleared by server */
        this.accessToken = null;

        if (this.tokenRefreshTimeout) {
            clearTimeout(this.tokenRefreshTimeout);
            this.tokenRefreshTimeout = null;
        }
    }

    async getCurrentUser(): Promise<User> {
        /* Get current user information using access token
        Automatically handles token refresh if needed */
        const response = await this.makeAuthenticatedRequest('/auth/me');
        const userData = await response.json();
        return userData;
    }

    async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
        /* Make authenticated API request automatic token refresh */

        let accessToken = this.accessToken;

        // Check if token needs refresh
        if (!accessToken || this.isTokenExpired(accessToken)) {
            try {
                await this.refreshAccessToken();
                accessToken = this.accessToken;
            } catch (error) {
                throw new Error('Authenticated required');
            }
        }

        if (!accessToken) {
            throw new Error('Authentication required');
        }

        // Make the request with valid access token
        const response = await fetch(`${API_BASED_URL}${endpoint}`, {
            ...options,
            credentials: 'include',
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        // Handle token expiration during request
        if (response.status === 401) {
            try {
                // Try one more time with token refresh
                await this.refreshAccessToken();
                if (this.accessToken) {
                    const response = await fetch(`${API_BASED_URL}${endpoint}`, {
                        ...options,
                        credentials: 'include',
                        headers: {
                            ...options.headers,
                            'Authorization': `Bearer ${accessToken}`,
                        },
                    });
                }
            } catch (refreshError) {
                this.clearTokens();
                throw new Error('Authenticated required');
            }
        }

        return response;
    }

    isAuthenticated(): boolean {
        /* Check if user is currently authenticated */
        return !!(this.accessToken && !this.isTokenExpired(this.accessToken));
    }

    getAccessToken(): string | null {
        /* Get current access token for debugging */
        return this.accessToken;
    }
}

// Create singleton instance
export const authService = new SecureAuthService();