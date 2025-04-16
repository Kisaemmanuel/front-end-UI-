import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ViewSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(`https://backend-esz3.onrender.com/api/schedules/babysitter/${userId}`);
        setSchedule(response.data);
      } catch (error) {
        console.error('Failed to fetch schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSchedule();
    }
  }, [userId]);

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const today = new Date().toISOString().split('T')[0];
  const todaySchedule = schedule.filter(item => item.date.startsWith(today));

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Schedule</h1>
          <Link
            to="/babysitter-dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Dashboard
          </Link>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Today's Schedule */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">Today's Schedule</h3>
                <div className="space-y-4">
                  {loading ? (
                    <p>Loading...</p>
                  ) : todaySchedule.length > 0 ? (
                    todaySchedule.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.session_type.replace('-', ' ')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatTime(item.start_time)} - {formatTime(item.end_time)}
                          </p>
                        </div>
                        <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                          {item.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No schedule for today.</p>
                  )}
                </div>
              </div>

              {/* Weekly Overview */}
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-900 mb-4">Weekly Overview</h3>
                <div className="space-y-4">
                  {loading ? (
                    <p>Loading...</p>
                  ) : schedule.length > 0 ? (
                    schedule.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(item.date).toLocaleDateString(undefined, {
                              weekday: 'long',
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.session_type.replace('-', ' ')} (
                            {formatTime(item.start_time)} - {formatTime(item.end_time)})
                          </p>
                        </div>
                        <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                          {item.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No schedule this week.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Upcoming Events (Static) */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
                  <p className="font-medium text-gray-900">Staff Meeting</p>
                  <p className="text-sm text-gray-500">Thursday, 2:00 PM</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                  <p className="font-medium text-gray-900">Parent-Teacher Conference</p>
                  <p className="text-sm text-gray-500">Friday, 10:00 AM</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                  <p className="font-medium text-gray-900">Training Session</p>
                  <p className="text-sm text-gray-500">Next Monday, 9:00 AM</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSchedule;
