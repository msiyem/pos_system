import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({allow,children}){
  const {role}=useAuth();
  if(!allow.includes(role)){
    return <Navigate to={"/product"}/>
  }
  return children;
}