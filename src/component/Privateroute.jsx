import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext"

export default function Privateroute({children}) {
  const {user} = useAuth();
  return user ? children : <Navigate to="/login" replace/>
}
// if user is not loged in and trying to access Private element than restrict user from accessing and redirect user to login page.