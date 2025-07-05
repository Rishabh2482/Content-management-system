import React, { useEffect, useState } from 'react'

export default function Authcontext() {

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

        if(!findUser) return {success: false, message: "Username is does not exist"}
        setUser(findUser);
        return true;
    }

    function signup(username, password){
        
    }

  return (
    <div>
      Authcontext
    </div>
  )
}
