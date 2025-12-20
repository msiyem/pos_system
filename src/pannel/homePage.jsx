import logo from "../assets/logo.png";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import Notification from "../component/notification";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MiniProfile from "../component/miniprofile";

export default function HomePage() {
  const [open, setOpen] = useState(true);
  const [isSmallDevice, setSmallDive]=useState(false);
  const homeRef = useRef(null);
  useEffect(()=>{
    const handleResize=()=>{
      if(window.innerWidth<820){
      setOpen(false);
      setSmallDive(true);
    }else{
      setOpen(true);
      setSmallDive(false);
    }
    };
    handleResize();
    addEventListener('resize',handleResize);
    
    return()=>removeEventListener('resize',handleResize);

  },[]);
  useEffect(()=>{

    const handleSideBar=(event)=>{
      if(isSmallDevice && open){
        if(homeRef.current && !homeRef.current.contains(event.target)){
          setOpen(false);
        }

      }

    }
    document.addEventListener("mousedown",handleSideBar);
    return ()=>{
      document.removeEventListener("mousedown",handleSideBar);
    }

  },[]);
  
  return (
    
    <div className="">
      <div ref={homeRef} className="flex bg-white h-[100dvh] w-full fixed">
      {/* Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="bg-[rgb(250,250,250)] h-full flex flex-col px-1 z-20"
          >
            <Link to={"/"}>
              <img src={logo} alt="GadgetBD logo" />
            </Link>
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>
      {isSmallDevice && open &&(
        <div className="fixed inset-0 bg-black/50 z-10"
        
        onClick={()=>setOpen(false)}  />
      )}


      {/* Main content */}
      <motion.div
        className="flex flex-col relative"
        onClick={()=>{
          if(isSmallDevice && open) setOpen(false);
        }}
        
        animate={{ width: open ? "calc(100% - 220px)" : "100%" }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      >
        <div className="flex justify-between p-3 border-b border-gray-200/80">
          <button onClick={() => {
            setOpen(!open)

          }}>
            {open ? (
              <ChevronLeft className="cursor-pointer ring-0 rounded-full h-7 w-7 p-1 m-1 bg-[rgb(248,244,244)] z-20" />
            ) : (
              <ChevronRight className="cursor-pointer ring-0 rounded-full h-7 w-7 p-1 m-1 bg-[rgb(248,244,244)] z-20" />
            )}
          </button>
          <div className="flex gap-3  items-center">
            <Notification count={2} />
            <MiniProfile />
          </div>
        </div>
        <div className="w-full overflow-auto ">
          <Outlet/>
        </div>
      </motion.div>
    </div>
    </div>
    
  );
}
