import { useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import useToast from '../toast/useToast.jsx';

export default function Login() {
  const toast = useToast();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      });
      const data = res.data || {};
      const user = data.user || {};
      const accessToken = data.accessToken;
      const role = data.role || user.role;
      const userId = data.userId || user.id;

      if (!accessToken || !role || !userId) {
        setError('Login response missing user details');
        return;
      }

      login(accessToken, role, userId);
      setError('');
      toast.success('Login Successfull!');

      navigate('/', { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message;

      if (status === 401) {
        setError('Invalid email or password');
        return;
      }

      setError(message || 'Login failed. Please try again.');
    }
  };

  return (
    <div
      className="min-h-svh w-full flex justify-center items-center bg-white
  bg-[radial-gradient(circle,rgba(255,0,255,0.6)_1.12px,transparent_1px)]
  [background-size:20px_20px] "
    >
      <div className="from-lime-100  to-sky-200/80 bg-gradient-to-br w-full max-w-md border border-gray-200 rounded-2xl shadow-lg  p-8">
        <h2 className="text-3xl font-bold font-serif text-center mb-6">
          Welcome Back
        </h2>

        {error && (
          <p className="text-red-500 text-xs text-center mb-3">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-200 hover:border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-200 hover:border-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:border-gray-500 bg-white"
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
