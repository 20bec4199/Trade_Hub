import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated ] = useState(false);
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try{
                const response = await axios.get('http://localhost:8000/api/auth/me', {withCredentials: true});
                if(response.data){
                    setIsAuthenticated(true);
                    setUser(response.data);
                }
            }
            catch(error){
                console.log(error);
            }
            finally{
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/login', credentials, {withCredentials: true});
            setIsAuthenticated(true);
            setUser(response.data);
            return response;
          } catch (error) {
            console.error('Login failed:', error);
            throw error;
          }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/register', formData, {withCredentials: true});
            setIsAuthenticated(true);
            setUser(response.data);
            return response;
          } catch (error) {
            console.error('Registration failed:', error);
            throw error;
          }
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:8000/api/auth/logout', {}, {withCredentials: true});
            setIsAuthenticated(false);
            setUser(null);
          } catch (error) {
            console.error('Logout failed:', error);
          }
    };

    return (
        <AuthContext.Provider
          value={{
            isAuthenticated,
            user,
            loading,
            login,
            register,
            logout
          }}
          >
            {children}
          </AuthContext.Provider>
    )
};

export const useAuth = () => {
    return useContext(AuthContext);
}