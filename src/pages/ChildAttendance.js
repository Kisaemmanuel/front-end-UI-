import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ChildAttendance = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState([
    {
      id: 1,
      name: 'John Doe',
      checkIn: '',
      checkOut: '',
      status: 'pending'
    },
    {
      id: 2,
      name: 'Sarah Smith',
      checkIn: '',
      checkOut: '',
      status: 'pending'
    },
    {
      id: 3,
      name: 'Michael Johnson',
      checkIn: '',
      checkOut: '',
      status: 'pending'
    }
  ]);

  const handleCheckIn = (childId) => {
    setAttendance(prev => prev.map(child => {
      if (child.id === childId) {
        return {
          ...child,
          checkIn: new Date().toLocaleTimeString(),
          status: 'checked-in'
        };
      }
      return child;
    }));
  };

  const handleCheckOut = (childId) => {
    setAttendance(prev => prev.map(child => {
      if (child.id === childId) {
        return {
          ...child,
          checkOut: new Date().toLocaleTimeString(),
          status: 'checked-out'
        };
      }
      return child;
    }));
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'checked-in':
        return 'bg-green-100 text-green-800';
      case 'checked-out':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Child Attendance</h1>
          <Link
            to="/babysitter-dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Dashboard
          </Link>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          {/* Date Selection */}
          <div className="mb-6">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Select Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {/* Attendance Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Child Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check-in Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check-out Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendance.map((child) => (
                    <tr key={child.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{child.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{child.checkIn || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{child.checkOut || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(child.status)}`}>
                          {child.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {child.status === 'pending' && (
                          <button
                            onClick={() => handleCheckIn(child.id)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Check In
                          </button>
                        )}
                        {child.status === 'checked-in' && (
                          <button
                            onClick={() => handleCheckOut(child.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Check Out
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Section */}
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Daily Summary
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <div className="text-sm font-medium text-gray-500">Total Children</div>
                  <div className="mt-1 text-lg font-semibold text-gray-900">{attendance.length}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Checked In</div>
                  <div className="mt-1 text-lg font-semibold text-green-600">
                    {attendance.filter(child => child.status === 'checked-in').length}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Checked Out</div>
                  <div className="mt-1 text-lg font-semibold text-blue-600">
                    {attendance.filter(child => child.status === 'checked-out').length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildAttendance; 