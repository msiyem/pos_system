import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/useAuth";

export default function Unauthorized() {
  const navigate = useNavigate();
  const { role } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg border border-gray-300 rounded-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="h-18 w-18 rounded-full bg-red-100 flex items-center justify-center">
            <ShieldAlert className="h-10 w-10 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl text-red-700 font-semibold ">
          Access Denied
        </h1>

        <p className="text-gray-600 mt-2">
          You don’t have permission to access this page.
        </p>

        <p className="text-sm text-gray-500 mt-1">
          Your role: <span className="font-medium">{role}</span>
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition cursor-pointer"
          >
            Go Back
          </button>

          
        </div>
      </div>
    </div>
  );
}