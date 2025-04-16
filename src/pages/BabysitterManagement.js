// BabysitterManagement.jsx (Entry Point)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BabysitterForm from '../components/BabysitterForm';
import ScheduleManagement from '../components/ScheduleManagement';
import PaymentManagement from '../components/PaymentManagement';
import BabysitterList from '../components/BabysitterList';

const BabysitterManagement = () => {
  const navigate = useNavigate();
  const [babysitters, setBabysitters] = useState([]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Babysitter Management</h1>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/manager')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('userRole');
                navigate('/login');
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        <BabysitterForm babysitters={babysitters} setBabysitters={setBabysitters} />
        <ScheduleManagement babysitters={babysitters} setBabysitters={setBabysitters} />
        <PaymentManagement babysitters={babysitters} setBabysitters={setBabysitters} />
        <BabysitterList babysitters={babysitters} />
      </div>
    </div>
  );
};

export default BabysitterManagement;
