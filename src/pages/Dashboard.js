import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [totalChildren, setTotalChildren] = useState(0); // State for total children
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch total children data from the API
  useEffect(() => {
    fetch('https://backend-esz3.onrender.com/api/babies/babies')
      .then((response) => response.json())
      .then((data) => {
        setTotalChildren(data.length); // Set total children based on the length of the response
        setLoading(false); // Set loading to false when the data is fetched
      })
      .catch((error) => {
        console.error('Error fetching children:', error);
        setLoading(false); // Set loading to false if an error occurs
      });
  }, []);

  const handleLogout = () => {
    // Clear authentication state
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    // Navigate to login page
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Children</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {loading ? 'Loading...' : totalChildren} {/* Display loading or total children */}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Babysitters</h3>
            <p className="text-3xl font-bold text-indigo-600">8</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Today's Income</h3>
            <p className="text-3xl font-bold text-green-600">UGX 48,000</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Today's Expenses</h3>
            <p className="text-3xl font-bold text-red-600">UGX 16,000</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              <li className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">New child registration</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      John Doe
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>2 hours ago</p>
                  </div>
                </div>
              </li>
              {/* Add more activity items here */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
