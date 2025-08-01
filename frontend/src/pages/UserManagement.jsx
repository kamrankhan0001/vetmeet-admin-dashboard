// // File: src/pages/UserManagement.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const UsersManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem('adminIdToken');
//         if (!token) throw new Error('Admin not logged in');
//         const res = await axios.get('http://localhost:5000/api/admin/users', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUsers(res.data);
//         setFilteredUsers(res.data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, []);

//   const handleSearch = (e) => {
//     const value = e.target.value.toLowerCase();
//     setSearchTerm(value);
//     const filtered = users.filter(
//       (user) =>
//         user.displayName?.toLowerCase().includes(value) ||
//         user.email?.toLowerCase().includes(value) ||
//         user.phone?.toLowerCase().includes(value)
//     );
//     setFilteredUsers(filtered);
//   };

//   const toggleBlockUser = async (userId, isBlocked) => {
//     try {
//       const token = localStorage.getItem('adminIdToken');
//       await axios.put(
//         `http://localhost:5000/api/admin/users/${userId}/block`,
//         { blocked: !isBlocked },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setUsers((prev) =>
//         prev.map((u) => (u._id === userId ? { ...u, blocked: !isBlocked } : u))
//       );
//       setFilteredUsers((prev) =>
//         prev.map((u) => (u._id === userId ? { ...u, blocked: !isBlocked } : u))
//       );
//     } catch (err) {
//       console.error('Error updating block status:', err);
//     }
//   };

//   const viewOrderHistory = (userId) => {
//     // Placeholder: You can navigate to a user-specific order history page or modal
//     alert(`View order history for user: ${userId}`);
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
//       <input
//         type="text"
//         placeholder="Search by name, email or phone"
//         value={searchTerm}
//         onChange={handleSearch}
//         className="mb-4 px-3 py-2 border rounded w-full"
//       />
//       {loading && <p>Loading users...</p>}
//       {error && <p className="text-red-500">{error}</p>}
//       {!loading && !error && (
//         <table className="min-w-full bg-white">
//           <thead>
//             <tr>
//               <th className="py-2 px-4 border-b">Name</th>
//               <th className="py-2 px-4 border-b">Email</th>
//               <th className="py-2 px-4 border-b">Phone</th>
//               <th className="py-2 px-4 border-b">Role</th>
//               <th className="py-2 px-4 border-b">Status</th>
//               <th className="py-2 px-4 border-b">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.map((user) => (
//               <tr key={user._id}>
//                 <td className="py-2 px-4 border-b">{user.displayName || 'N/A'}</td>
//                 <td className="py-2 px-4 border-b">{user.email}</td>
//                 <td className="py-2 px-4 border-b">{user.phone || 'N/A'}</td>
//                 <td className="py-2 px-4 border-b">{user.role}</td>
//                 <td className="py-2 px-4 border-b">
//                   {user.blocked ? (
//                     <span className="text-red-500">Blocked</span>
//                   ) : (
//                     <span className="text-green-600">Active</span>
//                   )}
//                 </td>
//                 <td className="py-2 px-4 border-b">
//                   <button
//                     onClick={() => toggleBlockUser(user._id, user.blocked)}
//                     className="text-yellow-600 hover:underline mr-3"
//                   >
//                     {user.blocked ? 'Unblock' : 'Block'}
//                   </button>
//                   <button
//                     onClick={() => viewOrderHistory(user._id)}
//                     className="text-blue-600 hover:underline mr-2"
//                   >
//                     Orders
//                   </button>
//                   <button className="text-red-600 hover:underline">Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default UsersManagement;


// File: src/pages/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminIdToken');
        if (!token) throw new Error('Admin not logged in');

        const res = await axios.get(`${API_BASE_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (err) {
        const message = err.response?.data?.message || err.message || 'Network error';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = users.filter(
      (user) =>
        user.displayName?.toLowerCase().includes(value) ||
        user.email?.toLowerCase().includes(value) ||
        user.phone?.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
  };

  const toggleBlockUser = async (userId, isBlocked) => {
    try {
      const token = localStorage.getItem('adminIdToken');
      await axios.put(
        `${API_BASE_URL}/api/admin/users/${userId}/block`,
        { blocked: !isBlocked },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, blocked: !isBlocked } : u))
      );
      setFilteredUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, blocked: !isBlocked } : u))
      );
    } catch (err) {
      console.error('Error updating block status:', err);
      alert('Failed to update user status.');
    }
  };

  const viewOrderHistory = (userId) => {
    alert(`View order history for user: ${userId}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Users</h2>

      <input
        type="text"
        placeholder="Search by name, email or phone"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4 px-3 py-2 border rounded w-full"
      />

      {loading && <p className="text-blue-600 font-semibold">Loading users...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && !error && filteredUsers.length > 0 && (
        <table className="min-w-full bg-white border rounded shadow-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Phone</th>
              <th className="py-2 px-4 border-b text-left">Role</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition">
                <td className="py-2 px-4 border-b">{user.displayName || 'N/A'}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.phone || 'N/A'}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b">
                  {user.blocked ? (
                    <span className="text-red-500 font-medium">Blocked</span>
                  ) : (
                    <span className="text-green-600 font-medium">Active</span>
                  )}
                </td>
                <td className="py-2 px-4 border-b space-x-2">
                  <button
                    onClick={() => toggleBlockUser(user._id, user.blocked)}
                    className="text-yellow-600 hover:underline"
                  >
                    {user.blocked ? 'Unblock' : 'Block'}
                  </button>
                  <button
                    onClick={() => viewOrderHistory(user._id)}
                    className="text-blue-600 hover:underline"
                  >
                    Orders
                  </button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && filteredUsers.length === 0 && (
        <p className="text-gray-500 text-center">No users found.</p>
      )}
    </div>
  );
};

export default UsersManagement;
