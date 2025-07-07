import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext"
import { useState } from "react";
import { isNotEmpty } from "../utils/validation";

export default function Signup() {
  const {user, signup} = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if(user){
    navigate('/view');
  }

  function handleSubmit(e){
    e.preventDefault();
    if(!isNotEmpty(username) || !isNotEmpty(password) || !isNotEmpty(confirmPassword)){
      setError('Please fill information');
      return;
    }

    if(password !== confirmPassword){
      setError('Password doesnot match');
      return;
    }

    const isUserRegistered = signup(username,password);
    if(isUserRegistered.sucess===true){
      navigate("/view");
    }else{
      setError(isUserRegistered.message);
    }
  }

  return (
    <div className="panel login-panel">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} className="content-form">
        <div className="form-group">
          <label htmlFor="signup-username">Username:</label>
          <input type="text" 
            id="signup-username" 
            placeholder="Enter username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            />
        </div>

        <div className="form-group">
          <label htmlFor="signup-password">Password:</label>
          <input type="text" 
            id="signup-password" 
            placeholder="Enter Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />
        </div>

        <div className="form-group">
          <label htmlFor="signup-confirm-password">Confirm Password:</label>
          <input type="text" 
            id="signup-confirm-password" 
            placeholder="Enter Password"
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            />
        </div>
        {error && <div className="error">{error}</div>}

        <button className="btn" type="submit">
          Sign Up
        </button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  )
}
