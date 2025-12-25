import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('dentigo_user');
        return storedUser ? JSON.parse(storedUser) : null;
    })

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            localStorage.setItem('dentigo_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('dentigo_user');
        }
    }, [user])

    const logout = () => {
        setUser(null);
        localStorage.removeItem('dentigo_user');
        localStorage.removeItem('dentigo_user_token');
        localStorage.removeItem('dentigo_user_base_url');
        localStorage.removeItem('theme');
        navigate('/');
    }

    return (
        <UserContext.Provider value={{ user, setUser, logout }} >
            {children}
        </UserContext.Provider>
    )

}