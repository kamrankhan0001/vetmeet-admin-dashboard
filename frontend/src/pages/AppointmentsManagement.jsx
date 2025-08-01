// vetnmeet-admin-frontend/src/components/AppointmentManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null); // To show loading state for individual row updates

  const API_BASE_URL = 'http://localhost:5000/api/admin'; // Your backend admin API base URL

  // Function to fetch appointments from the backend
  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminIdToken'); // Get stored admin token
      if (!token) {
        setError('Admin not logged in.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(response.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to fetch appointments: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Function to update appointment status
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    setUpdatingId(appointmentId); // Set updating state for this specific appointment
    setError('');
    try {
      const token = localStorage.getItem('adminIdToken');
      if (!token) {
        setError('Admin not logged in.');
        setUpdatingId(null);
        return;
      }

      const response = await axios.put(`${API_BASE_URL}/appointments/${appointmentId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      // Update the local state with the updated appointment
      setAppointments((prevAppointments) =>
        prevAppointments.map((app) =>
          app._id === appointmentId ? response.data.appointment : app
        )
      );
      alert(`Appointment ${appointmentId} status updated to ${newStatus}`); // Replace with custom toast
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setError('Failed to update status: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingId(null); // Clear updating state
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []); // Fetch appointments on component mount

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FaCalendarAlt className="mr-3" /> Manage Appointments
      </h2>

      {loading && <p className="text-gray-600">Loading appointments...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          {appointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No appointments found.</p>
          ) : (
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">ID</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">User Email</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Pet Name</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Vet Name</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Date & Time</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Reason</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b text-sm text-gray-800">{appointment._id.substring(0, 8)}...</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">{appointment.userEmail || 'N/A'}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">{appointment.petName}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">{appointment.vetName}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">
                      {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}
                    </td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                      {appointment.reason}
                    </td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800 capitalize">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b text-sm">
                      {updatingId === appointment._id ? (
                        <FaSpinner className="animate-spin text-blue-500" />
                      ) : (
                        <select
                          value={appointment.status}
                          onChange={(e) => updateAppointmentStatus(appointment._id, e.target.value)}
                          className="p-1 border rounded-md bg-white text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;