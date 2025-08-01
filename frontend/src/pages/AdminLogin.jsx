// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// //import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';

// const ADMIN_EMAIL = "kamran@gmail.com";
// const ADMIN_PASSWORD = "123456";

// const AdminLogin = ({ setAdminLoggedIn }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
//       const mockIdToken = "MOCK_FIREBASE_ID_TOKEN_FOR_ADMIN";
//       localStorage.setItem('adminIdToken', mockIdToken);
//       setAdminLoggedIn(true);
//       navigate('/admin/dashboard');
//     } else {
//       setError('Invalid credentials');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//         <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
//         <form onSubmit={handleLogin} className="space-y-4">
//           <div>
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
//             <input type="email" id="email" className="shadow border rounded w-full py-2 px-3" value={email} onChange={(e) => setEmail(e.target.value)} required />
//           </div>
//           <div>
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
//             <input type="password" id="password" className="shadow border rounded w-full py-2 px-3" value={password} onChange={(e) => setPassword(e.target.value)} required />
//           </div>
//           {error && <p className="text-red-500 text-sm text-center">{error}</p>}
//           <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" disabled={loading}>
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;





// src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../firebase'; // 🔁 Adjust this path to your Firebase config file
import axios from 'axios';

const AdminLogin = ({ setAdminLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   setLoading(true);

  //   try {
  //     const userCredential = await signInWithEmailAndPassword(auth, email, password);
  //     const idToken = await userCredential.user.getIdToken();

  //     localStorage.setItem('adminIdToken', idToken);
  //     setAdminLoggedIn(true);
  //     navigate('/admin/dashboard');
  //   } catch (err) {
  //     setError('Invalid email or password');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

 


// ...inside the component

const handleLogin = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ✅ Get ID Token from Firebase
    const token = await user.getIdToken();

    // ✅ Store it in localStorage for later API calls
    localStorage.setItem('adminIdToken', token);

    // ✅ Sync user profile to your backend
    await axios.post('http://localhost:5000/api/users/sync-profile', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // ✅ Navigate to dashboard
    setAdminLoggedIn(true);
    navigate('/admin/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    setError('Invalid credentials or network issue.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="shadow border rounded w-full py-2 px-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="shadow border rounded w-full py-2 px-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

            