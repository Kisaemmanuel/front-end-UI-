import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Schedule = () => {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(getWeekDates());

  // Function to get dates for the current week
  function getWeekDates() {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // Adjust when Sunday
    const monday = new Date(today.setDate(diff));
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      week.push(day);
    }
    return week;
  }

  // Sample schedule data - replace with actual data from your backend
  const scheduleData = [
    {
      day: 'Monday',
      shifts: [
        { startTime: '08:00', endTime: '16:00', children: ['John D.', 'Sarah M.'] }
      ]
    },
    {
      day: 'Tuesday',
      shifts: [
        { startTime: '09:00', endTime: '17:00', children: ['Emma W.', 'Michael R.'] }
      ]
    },
    {
      day: 'Wednesday',
      shifts: [
        { startTime: '08:00', endTime: '16:00', children: ['Oliver K.', 'Sophia L.'] }
      ]
    },
    {
      day: 'Thursday',
      shifts: [
        { startTime: '09:00', endTime: '17:00', children: ['Lucas P.', 'Ava B.'] }
      ]
    },
    {
      day: 'Friday',
      shifts: [
        { startTime: '08:00', endTime: '16:00', children: ['Ethan M.', 'Isabella S.'] }
      ]
    }
  ];

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const navigateWeek = (direction) => {
    setCurrentWeek(prevWeek => {
      const newWeek = prevWeek.map(date => {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + (direction === 'next' ? 7 : -7));
        return newDate;
      });
      return newWeek;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/babysitter')}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="ml-4 text-2xl font-bold text-indigo-600">Weekly Schedule</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Week Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {formatDate(currentWeek[0])} - {formatDate(currentWeek[6])}
            </h2>
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Schedule Grid */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Day
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shift Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Children
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scheduleData.map((schedule, index) => (
                    <tr key={schedule.day} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{schedule.day}</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(currentWeek[index])}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {schedule.shifts.map((shift, shiftIndex) => (
                          <div key={shiftIndex} className="text-sm text-gray-900">
                            {shift.startTime} - {shift.endTime}
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4">
                        {schedule.shifts.map((shift, shiftIndex) => (
                          <div key={shiftIndex} className="text-sm text-gray-900">
                            {shift.children.map((child, childIndex) => (
                              <span
                                key={childIndex}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-1"
                              >
                                {child}
                              </span>
                            ))}
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Schedule Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <div className="text-sm font-medium text-gray-500">Working Hours</div>
                  <div className="mt-1 text-sm text-gray-900">8:00 AM - 5:00 PM</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Break Time</div>
                  <div className="mt-1 text-sm text-gray-900">1 hour lunch break</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Contact</div>
                  <div className="mt-1 text-sm text-gray-900">Manager: +1 234 567 890</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Schedule; 