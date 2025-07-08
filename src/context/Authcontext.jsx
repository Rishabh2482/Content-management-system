import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext();

export default function AuthProvider({children}) {

    // This component can be used to manage authentication state, such as user login status, roles, etc.
    const [user, setUser] = useState(null);     // State to hold user information, used in login to select a user from all the registered users

    const [users, setUsers] = useState(() => {
        let users_details = localStorage.getItem('users');
        return users_details ? JSON.parse(users_details) : [{username: 'admin', password: 'admin'}];
    }); // State to hold all registered users, used in signup to add a new user

    useEffect(()=> {
        localStorage.setItem('users', JSON.stringify(users)); // Save users to localStorage whenever users state changes old value is replaced with new value
    },[users])

    function login(username, password){
        const findUser =users.find((u)=>{
            return u.username===username && u.password === password;
        })

        if(!findUser) return {success: false, message: "Username is does not exist"};
        setUser(findUser);
        return {success: true, message: "Username is Logedin"};
    }

    function signup(username, password){
        const userNameExist = users.some((u)=>{
            return u.username === username;
        })

        if(userNameExist){
            console.log("Username exist");
            return {success: false, message: "Username is already taken"}
        }

        console.log("Username does not exist");
        const newUser = {username, password}
        setUsers((prevState)=>{
            return [...prevState, newUser];
        })
        setUser({username});
        return {success: true, message: "User created and logedin"}
    }

    function logOut(){ 
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{login, logOut, signup, user}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
