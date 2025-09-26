import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function BackButton(){
  const navigate=useNavigate();

  return(
    <div>
      <button
      className="flex justify-center items-center gap-1 ring-0 border border-gray-300 rounded-lg p-1 px-2 cursor-pointer"
      onClick={()=>navigate(-1)}
      >
        <ArrowLeft className="h-5 w-5"/>   
        <span>Back</span>
      </button>
    </div>
  );
}