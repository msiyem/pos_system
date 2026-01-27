import { useEffect, useState } from "react";
import api from "../../../api/api";
import useToast from "../../../toast/useToast";

export default function UserProfile() {
  const [user,setUser] = useState({});
  const toast = useToast();
  useEffect(()=>{
    async function fetchProfileDetails() {
      try {
        const res = await api.get("/users/me");
      setUser(res.data.data);
      console.log(res.data.data);
      } catch (err) {
        console.log(err);
        toast.error("something went wrrong!");
      }
    }
    fetchProfileDetails();
  },[])
  return(
    <div>

    </div>
  );
}