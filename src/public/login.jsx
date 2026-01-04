import { useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/useAuth.jsx";
import { useNavigate } from "react-router-dom";
import useToast from "../toast/useToast.jsx";

export default function Login() {
  const toast = useToast();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });
      const data=res.data;
      // backend returns: { accessToken, role }
      login(data.accessToken, data.user.role, data.user.id);
      toast.success("Login Successfull!")

      navigate("/",{replace:true});
    } catch (err) {
      console.log(err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-svh w-full flex justify-center items-center
  bg-[radial-gradient(circle,rgba(0,0,255,0.20)_1.1px,transparent_1px)]
  [background-size:20px_20px] ">
      <div className="from-cyan-50/80 to-sky-50 bg-gradient-to-b w-full max-w-md border border-gray-200 rounded-2xl shadow p-8">
        <h2 className="text-3xl font-bold font-serif text-center mb-6">
          Welcome Back
        </h2>

        {error && (
          <p className="text-red-500 text-xs text-center mb-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-200 hover:border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-400 bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-200 hover:border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-400 bg-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 from-indigo-500 to-purple-600 bg-gradient-to-br hover:bg-gradient-to-bl text-white py-2 rounded-lg  transition cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
