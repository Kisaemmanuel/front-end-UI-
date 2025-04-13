import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BabysitterManagement = () => {
  const navigate = useNavigate();
  const [babysitters, setBabysitters] = useState([
    {
      id: 1,
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      phone: '+256 700 123 456',
      nin: 'CM123456789',
      age: 25,
      nextOfKin: {
        name: 'John Johnson',
        relationship: 'Father',
        phone: '+256 700 789 012'
      },
      children: [
        { id: 1, name: 'Emma Johnson', session: 'full-day' },
        { id: 2, name: 'Liam Smith', session: 'half-day' }
      ],
      schedule: [
        { date: '2024-03-20', startTime: '08:00', endTime: '16:00', status: 'present' }
      ],
      payments: [
        { date: '2024-03-20', amount: 12000, status: 'pending' }
      ]
    }
  ]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nin: '',
    age: '',
    nextOfKin: {
      name: '',
      relationship: '',
      phone: ''
    }
  });

  const [scheduleForm, setScheduleForm] = useState({
    babysitterId: '',
    date: '',
    startTime: '',
    endTime: '',
    sessionType: 'full-day',
    status: 'scheduled'
  });

  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState([]);

  const [paymentForm, setPaymentForm] = useState({
    babysitterId: '',
    date: '',
    children: [],
    sessionType: 'full-day',
    status: 'pending'
  });

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [editPaymentForm, setEditPaymentForm] = useState({
    babysitterId: '',
    date: '',
    sessionType: 'full-day',
    status: 'pending'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('nextOfKin.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        nextOfKin: {
          ...prev.nextOfKin,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setScheduleForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateAge = (age) => {
    const ageNum = parseInt(age);
    return ageNum >= 21 && ageNum <= 35;
  };

  const calculatePayment = (children, sessionType) => {
    const rate = sessionType === 'full-day' ? 5000 : 2000;
    return children.length * rate;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAge(formData.age)) {
      alert('Babysitter age must be between 21 and 35 years');
      return;
    }

    const newBabysitter = {
      id: babysitters.length + 1,
      ...formData,
      children: [],
      schedule: [],
      payments: []
    };

    setBabysitters(prev => [...prev, newBabysitter]);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      nin: '',
      age: '',
      nextOfKin: {
        name: '',
        relationship: '',
        phone: ''
      }
    });
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    const newSchedule = {
      date: scheduleForm.date,
      startTime: scheduleForm.startTime,
      endTime: scheduleForm.endTime,
      sessionType: scheduleForm.sessionType,
      status: scheduleForm.status
    };

    setBabysitters(prev => prev.map(babysitter => 
      babysitter.id === parseInt(scheduleForm.babysitterId)
        ? { ...babysitter, schedule: [...babysitter.schedule, newSchedule] }
        : babysitter
    ));

    setScheduleForm({
      babysitterId: '',
      date: '',
      startTime: '',
      endTime: '',
      sessionType: 'full-day',
      status: 'scheduled'
    });
  };

  const handleEditSchedule = (schedule, babysitterId) => {
    setSelectedSchedule({ ...schedule, babysitterId });
    setScheduleForm({
      babysitterId,
      date: schedule.date,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      sessionType: schedule.sessionType || 'full-day',
      status: schedule.status
    });
  };

  const handleUpdateSchedule = (e) => {
    e.preventDefault();
    setBabysitters(prev => prev.map(babysitter => {
      if (babysitter.id === parseInt(scheduleForm.babysitterId)) {
        const updatedSchedule = babysitter.schedule.map(sched => {
          if (sched.date === selectedSchedule.date && 
              sched.startTime === selectedSchedule.startTime) {
            return {
              ...sched,
              date: scheduleForm.date,
              startTime: scheduleForm.startTime,
              endTime: scheduleForm.endTime,
              sessionType: scheduleForm.sessionType,
              status: scheduleForm.status
            };
          }
          return sched;
        });
        return { ...babysitter, schedule: updatedSchedule };
      }
      return babysitter;
    }));
    setSelectedSchedule(null);
    setScheduleForm({
      babysitterId: '',
      date: '',
      startTime: '',
      endTime: '',
      sessionType: 'full-day',
      status: 'scheduled'
    });
  };

  const handleDeleteSchedule = (schedule, babysitterId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      setBabysitters(prev => prev.map(babysitter => {
        if (babysitter.id === babysitterId) {
          return {
            ...babysitter,
            schedule: babysitter.schedule.filter(sched => 
              sched.date !== schedule.date || sched.startTime !== schedule.startTime
            )
          };
        }
        return babysitter;
      }));
    }
  };

  const generateAttendanceReport = () => {
    const report = babysitters.map(babysitter => {
      const schedules = babysitter.schedule;
      const totalSchedules = schedules.length;
      const presentCount = schedules.filter(s => s.status === 'present').length;
      const absentCount = schedules.filter(s => s.status === 'absent').length;
      const fullDayCount = schedules.filter(s => s.sessionType === 'full-day').length;
      const halfDayCount = schedules.filter(s => s.sessionType === 'half-day').length;

      return {
        babysitterName: `${babysitter.firstName} ${babysitter.lastName}`,
        totalSchedules,
        presentCount,
        absentCount,
        attendanceRate: ((presentCount / totalSchedules) * 100).toFixed(2),
        fullDayCount,
        halfDayCount
      };
    });

    setReportData(report);
    setShowReport(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const babysitter = babysitters.find(b => b.id === parseInt(paymentForm.babysitterId));
    const amount = calculatePayment(babysitter.children, paymentForm.sessionType);

    const newPayment = {
      date: paymentForm.date,
      amount,
      sessionType: paymentForm.sessionType,
      childrenCount: babysitter.children.length,
      status: paymentForm.status
    };

    setBabysitters(prev => prev.map(babysitter => 
      babysitter.id === parseInt(paymentForm.babysitterId)
        ? { ...babysitter, payments: [...babysitter.payments, newPayment] }
        : babysitter
    ));

    setPaymentForm({
      babysitterId: '',
      date: '',
      children: [],
      sessionType: 'full-day',
      status: 'pending'
    });
  };

  const handleEditPayment = (payment, babysitterId) => {
    setSelectedPayment({ ...payment, babysitterId });
    setEditPaymentForm({
      babysitterId,
      date: payment.date,
      sessionType: payment.sessionType,
      status: payment.status
    });
  };

  const handleUpdatePayment = (e) => {
    e.preventDefault();
    setBabysitters(prev => prev.map(babysitter => {
      if (babysitter.id === parseInt(editPaymentForm.babysitterId)) {
        const updatedPayments = babysitter.payments.map(payment => {
          if (payment.date === selectedPayment.date && 
              payment.sessionType === selectedPayment.sessionType) {
            return {
              ...payment,
              status: editPaymentForm.status
            };
          }
          return payment;
        });
        return { ...babysitter, payments: updatedPayments };
      }
      return babysitter;
    }));
    setSelectedPayment(null);
    setEditPaymentForm({
      babysitterId: '',
      date: '',
      sessionType: 'full-day',
      status: 'pending'
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Babysitter Management</h1>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/manager')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Add Babysitter Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Babysitter</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">National ID (NIN)</label>
                <input
                  type="text"
                  name="nin"
                  value={formData.nin}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="21"
                  max="35"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Next of Kin Name</label>
                <input
                  type="text"
                  name="nextOfKin.name"
                  value={formData.nextOfKin.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Next of Kin Relationship</label>
                <input
                  type="text"
                  name="nextOfKin.relationship"
                  value={formData.nextOfKin.relationship}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Next of Kin Phone</label>
                <input
                  type="tel"
                  name="nextOfKin.phone"
                  value={formData.nextOfKin.phone}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              Add Babysitter
            </button>
          </form>
        </div>

        {/* Schedule Management */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Schedule Management</h2>
            <button
              onClick={generateAttendanceReport}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Generate Attendance Report
            </button>
          </div>

          {showReport && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Attendance Report</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Babysitter</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Schedules</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Day</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Half Day</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.map((row, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{row.babysitterName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.totalSchedules}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.presentCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.absentCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.attendanceRate}%</td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.fullDayCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.halfDayCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <form onSubmit={selectedSchedule ? handleUpdateSchedule : handleScheduleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Babysitter</label>
                <select
                  name="babysitterId"
                  value={scheduleForm.babysitterId}
                  onChange={handleScheduleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Babysitter</option>
                  {babysitters.map(babysitter => (
                    <option key={babysitter.id} value={babysitter.id}>
                      {babysitter.firstName} {babysitter.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={scheduleForm.date}
                  onChange={handleScheduleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={scheduleForm.startTime}
                  onChange={handleScheduleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={scheduleForm.endTime}
                  onChange={handleScheduleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Session Type</label>
                <select
                  name="sessionType"
                  value={scheduleForm.sessionType}
                  onChange={handleScheduleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="full-day">Full Day</option>
                  <option value="half-day">Half Day</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={scheduleForm.status}
                  onChange={handleScheduleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              {selectedSchedule && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSchedule(null);
                    setScheduleForm({
                      babysitterId: '',
                      date: '',
                      startTime: '',
                      endTime: '',
                      sessionType: 'full-day',
                      status: 'scheduled'
                    });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                {selectedSchedule ? 'Update Schedule' : 'Add Schedule'}
              </button>
            </div>
          </form>

          {/* Schedule List */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Current Schedules</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Babysitter</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {babysitters.flatMap(babysitter => 
                    babysitter.schedule.map((sched, index) => (
                      <tr key={`${babysitter.id}-${index}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {babysitter.firstName} {babysitter.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(sched.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {sched.startTime} - {sched.endTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {sched.sessionType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            sched.status === 'present' ? 'bg-green-100 text-green-800' :
                            sched.status === 'absent' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {sched.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditSchedule(sched, babysitter.id)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(sched, babysitter.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Payment Management */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment Management</h2>
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Babysitter</label>
                <select
                  name="babysitterId"
                  value={paymentForm.babysitterId}
                  onChange={handlePaymentChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Babysitter</option>
                  {babysitters.map(babysitter => (
                    <option key={babysitter.id} value={babysitter.id}>
                      {babysitter.firstName} {babysitter.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={paymentForm.date}
                  onChange={handlePaymentChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Session Type</label>
                <select
                  name="sessionType"
                  value={paymentForm.sessionType}
                  onChange={handlePaymentChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="full-day">Full Day (5,000 UGX per child)</option>
                  <option value="half-day">Half Day (2,000 UGX per child)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                <select
                  name="status"
                  value={paymentForm.status}
                  onChange={handlePaymentChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="cleared">Cleared</option>
                </select>
              </div>
            </div>
            {paymentForm.babysitterId && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Summary</h3>
                {(() => {
                  const babysitter = babysitters.find(b => b.id === parseInt(paymentForm.babysitterId));
                  const amount = calculatePayment(babysitter.children, paymentForm.sessionType);
                  return (
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        Number of Children: {babysitter.children.length}
                      </p>
                      <p className="text-sm text-gray-600">
                        Rate per Child: {paymentForm.sessionType === 'full-day' ? '5,000' : '2,000'} UGX
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        Total Amount: {amount.toLocaleString()} UGX
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
            >
              Generate Payment Record
            </button>
          </form>

          {/* Payment Records */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Payment Records</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Babysitter</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Children</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {babysitters.flatMap(babysitter => 
                    babysitter.payments.map((payment, index) => (
                      <tr key={`${babysitter.id}-${index}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {babysitter.firstName} {babysitter.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {payment.sessionType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {payment.childrenCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {payment.amount.toLocaleString()} UGX
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.status === 'cleared' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {payment.status === 'pending' && (
                            <button
                              onClick={() => handleEditPayment(payment, babysitter.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Update Status
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Edit Payment Modal */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Update Payment Status</h3>
                <form onSubmit={handleUpdatePayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                    <select
                      name="status"
                      value={editPaymentForm.status}
                      onChange={(e) => setEditPaymentForm(prev => ({ ...prev, status: e.target.value }))}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="cleared">Cleared</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPayment(null);
                        setEditPaymentForm({
                          babysitterId: '',
                          date: '',
                          sessionType: 'full-day',
                          status: 'pending'
                        });
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Update Status
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Babysitter List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personal Information</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next of Kin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Children & Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payments</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {babysitters.map((babysitter) => (
                <tr key={babysitter.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {babysitter.firstName} {babysitter.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">NIN:</span> {babysitter.nin}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Age:</span> {babysitter.age} years
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">Phone:</span> {babysitter.phone}
                      </div>
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">Email:</span> {babysitter.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">Name:</span> {babysitter.nextOfKin.name}
                      </div>
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">Relationship:</span> {babysitter.nextOfKin.relationship}
                      </div>
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">Phone:</span> {babysitter.nextOfKin.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">Children:</div>
                        {babysitter.children.map(child => (
                          <div key={child.id} className="text-sm text-gray-900 ml-2">
                            • {child.name} ({child.session})
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">Schedule:</div>
                        {babysitter.schedule.map((sched, index) => (
                          <div key={index} className="text-sm text-gray-900 ml-2">
                            • {new Date(sched.date).toLocaleDateString()}: {sched.startTime} - {sched.endTime}
                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              sched.status === 'present' ? 'bg-green-100 text-green-800' :
                              sched.status === 'absent' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {sched.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {babysitter.payments.map((payment, index) => (
                        <div key={index} className="text-sm text-gray-900">
                          <div className="font-medium">{new Date(payment.date).toLocaleDateString()}</div>
                          <div className="ml-2">
                            Amount: UGX {payment.amount.toLocaleString()}
                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              payment.status === 'cleared' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {payment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BabysitterManagement;