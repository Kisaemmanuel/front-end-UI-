import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const navigate = useNavigate();

  const [totalChildren, setTotalChildren] = useState(0);
  // const [incidentCount, setIncidentCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch children count
    fetch('https://backend-esz3.onrender.com/api/babies/babies')
      .then((response) => response.json())
      .then((data) => {
        setTotalChildren(data.length);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching children:', error);
        setLoading(false);
      });

    // Fetch incidents count
    fetch('https://backend-esz3.onrender.com/api/incidents/incidents')
      .then((response) => response.json())
      .then((data) => {
        setIncidentCount(data.length);
        const pending = data.filter((incident) => incident.status === 'pending').length;
        setPendingCount(pending);
      })
      .catch((error) => {
        console.error('Error fetching incidents:', error);
      });

    // Fetch total staff
    fetch('https://backend-esz3.onrender.com/api/users/allusers')
      .then((response) => response.json())
      .then((data) => {
        setTotalStaff(data.length);
      })
      .catch((error) => {
        console.error('Error fetching staff:', error);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Children */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Children</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {loading ? 'Loading...' : totalChildren}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Total Staff */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5m8 0H1m0 0h5m-5 0a2 2 0 100 4h14a2 2 0 100-4H1z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Staff</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {loading ? 'Loading...' : totalStaff}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Incidents */}
          <div
            onClick={() => navigate('/manager/incidents')}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Incident Reports</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{incidentCount}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                        {pendingCount} pending
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Child Management */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Child Management</h2>
            <p className="text-gray-600 mb-4">Manage children's information, attendance, and records.</p>
            <button
              onClick={() => navigate('/manager/child-management')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              Manage Children
            </button>
          </div>

          {/* Babysitter Management */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Babysitter Management</h2>
            <p className="text-gray-600 mb-4">Manage babysitter information, schedules, and performance.</p>
            <button
              onClick={() => navigate('/manager/babysitter-management')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              Manage Babysitters
            </button>
          </div>

          {/* Financial Management */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Financial Management</h2>
            <p className="text-gray-600 mb-4">Track income, expenses, and financial reports.</p>
            <button
              onClick={() => navigate('/manager/financial-management')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              Manage Finances
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
