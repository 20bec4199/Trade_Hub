import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated ] = useState(false);
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [flag, setFlag] = useState(false);
    const [error, setError] = useState(null);

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
    }, [flag]);

    const login = async (credentials) => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/login', credentials, {withCredentials: true});
            setIsAuthenticated(true);
            setUser(response.data);
            setFlag((prev) => !prev);
            return response;
          } catch (error) {
            console.error('Login failed:', error);
            setError(error.response?.data?.message || 'Invalid Credentials!.');
            throw error;
          }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/register', userData, {withCredentials: true});
            setIsAuthenticated(true);
            setUser(response.data);
            setFlag((prev) => !prev);
            return response;
          } catch (error) {
            console.error('Registration failed:', error);
            setError(error.response?.data?.message || 'Registration failed!. Please try again later');
            throw error;
          }
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:8000/api/auth/logout', {}, {withCredentials: true});
            setIsAuthenticated(false);
            setUser(null);
            setFlag((prev) => !prev);
            setError(null);
          } catch (error) {
            console.error('Logout failed:', error);
          }
    };

    return (
        <AuthContext.Provider
          value={{
            isAuthenticated,
            user,
            error,
            loading,
            flag,
            setFlag,
            login,
            register,
            logout,
            clearError: () => setError(null)
           
          }}
          >
            {children}
          </AuthContext.Provider>
    )
};

export const useAuth = () => {
    return useContext(AuthContext);
}