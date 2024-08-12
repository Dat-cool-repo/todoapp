import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      console.log('User logged in:', response.data);
      const { token, user } = response.data;
      if (user && user.id) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.id);
        router.push('/task'); // Redirect to task page after successful login
      } else {
        console.error('User ID not found in response');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-white">Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border border-gray-300 p-2 rounded w-full mb-2 bg-gray-700 text-white"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-gray-300 p-2 rounded w-full mb-4 bg-gray-700 text-white"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Login</button>
    </form>
  );
};

export default Login;
