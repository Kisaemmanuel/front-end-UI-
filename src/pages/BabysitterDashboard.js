import React from 'react';
import { useNavigate } from 'react-router-dom';

const BabysitterDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Babysitter Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Report Incident Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Report Incident</h2>
            <p className="text-gray-600 mb-4">Report any incidents or issues that occur during your shift.</p>
            <button
              onClick={() => navigate('/report-incident')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              Report Incident
            </button>
          </div>

          {/* Schedule Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">View Schedule</h2>
            <p className="text-gray-600 mb-4">Check your upcoming shifts and work schedule.</p>
            <button
              onClick={() => navigate('/schedule')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              View Schedule
            </button>
          </div>

          {/* Child Attendance Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Child Attendance</h2>
            <p className="text-gray-600 mb-4">Record and view child attendance for your shifts.</p>
            <button
              onClick={() => navigate('/child-attendance')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              Manage Attendance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BabysitterDashboard; 