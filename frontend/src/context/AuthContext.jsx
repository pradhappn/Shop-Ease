// Authentication state and API actions shared by login, registration, and protected routes.
import {createContext,useContext,useEffect,useState} from 'react';

const authContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(
        localStorage.getItem('token')
    );

    useEffect(() => {
        // Restore the signed-in user's display data when the app starts.
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const register = async (name, email, password) => {
        try {
            // Create an account, then persist its session for subsequent API calls.
            const response = await fetch(
                `${API_URL}/api/auth/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

             const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || 'Registration failed'
                };
            }
             localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            setToken(data.token);
            setUser(data.user);

            return {
                success: true,
                user: data.user
            };

        } catch (error) {
            console.error('Register error:', error);

            return {
                success: false,
                message: 'Unable to connect to server'
            };
        }
    };

    const login = async (email, password) => {
        try {
            // Authenticate credentials and store the returned session.
            const response = await fetch(
                `${API_URL}/api/auth/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || 'Login failed'
                };
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            setToken(data.token);
            setUser(data.user);

            return {
                success: true,
                user: data.user
            };

             } catch (error) {
            console.error('Login error:', error);

            return {
                success: false,
                message: 'Unable to connect to server'
            };
        }
    };

    const logout = () => {
        // Remove persisted credentials and clear in-memory account state.
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setToken(null);
        setUser(null);
    };

    return (
        <authContext.Provider
            value={{
                user,
                token,
                register,
                login,
                logout,
                isAuthenticated: !!token
            }}
        >
            {children}
        </authContext.Provider>
    );
};

export const useAuth = () => {
    // Consumer hook for reading the current account and authentication actions.
    return useContext(authContext);
};
