import React, { useState, useEffect } from 'react';

const ScheduleManagement = () => {
  const [scheduleForm, setScheduleForm] = useState({
    babysitterId: '',
    date: '',
    startTime: '',
    endTime: '',
    sessionType: 'full-day',
    status: 'scheduled',
  });
  const [babysitters, setBabysitters] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    // Fetch all babysitters and schedules on component mount
    fetchBabysitters();
    fetchSchedules(); // Added this function
  }, []);

  const fetchBabysitters = async () => {
    try {
      const response = await fetch('https://backend-esz3.onrender.com/api/babysitters/babysitters');
      const data = await response.json();
      setBabysitters(data || []); // Default to empty array if no data is returned
    } catch (error) {
      console.error('Error fetching babysitters:', error);
    }
  };

  // New function to fetch all schedules
  const fetchSchedules = async () => {
    try {
      const response = await fetch('https://backend-esz3.onrender.com/api/schedules/allschedules');  // Assuming this endpoint exists
      const data = await response.json();
      setReportData(data || []); // Set the schedules in the reportData state
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScheduleForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newSchedule = {
      babysitter_id: scheduleForm.babysitterId,
      date: scheduleForm.date,
      start_time: scheduleForm.startTime,
      end_time: scheduleForm.endTime,
      session_type: scheduleForm.sessionType,
      status: scheduleForm.status,
    };

    try {
      const response = await fetch('https://backend-esz3.onrender.com/api/schedules/addschedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSchedule),
      });

      const data = await response.json();
      fetchSchedules(); // Reload the schedules after adding
      resetForm();
    } catch (error) {
      console.error('Error adding schedule:', error);
    }
  };

  const handleEdit = (schedule, babysitterId) => {
    setSelectedSchedule({ ...schedule, babysitterId });
    setScheduleForm({
      babysitterId,
      date: schedule.date,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      sessionType: schedule.sessionType || 'full-day',
      status: schedule.status,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedSchedule = {
      babysitter_id: scheduleForm.babysitterId,
      date: scheduleForm.date,
      start_time: scheduleForm.startTime,
      end_time: scheduleForm.endTime,
      session_type: scheduleForm.sessionType,
      status: scheduleForm.status,
    };

    try {
      const response = await fetch(`https://backend-esz3.onrender.com/api/schedules/updateschedule/${selectedSchedule.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSchedule),
      });

      const data = await response.json();
      fetchSchedules(); // Reload schedules after update
      resetForm();
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  const handleDelete = async (scheduleId) => {
    if (!window.confirm('Delete this schedule?')) return;

    try {
      await fetch(`https://backend-esz3.onrender.com/api/schedules/delete/${scheduleId}`, {
        method: 'DELETE',
      });
      fetchSchedules(); // Reload schedules after deletion
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const resetForm = () => {
    setSelectedSchedule(null);
    setScheduleForm({
      babysitterId: '',
      date: '',
      startTime: '',
      endTime: '',
      sessionType: 'full-day',
      status: 'scheduled',
    });
  };

  const generateReport = () => {
    const report = babysitters.map((b) => {
      const sched = b.schedule || []; // Make sure b.schedule is always an array
      const total = sched.length;
      const present = sched.filter((s) => s.status === 'present').length;
      const absent = sched.filter((s) => s.status === 'absent').length;
      const full = sched.filter((s) => s.sessionType === 'full-day').length;
      const half = sched.filter((s) => s.sessionType === 'half-day').length;
      return {
        babysitterName: `${b.firstName} ${b.lastName}`,
        totalSchedules: total,
        presentCount: present,
        absentCount: absent,
        attendanceRate: total ? ((present / total) * 100).toFixed(2) : '0.00',
        fullDayCount: full,
        halfDayCount: half,
      };
    });
    setReportData(report);
    setShowReport(true);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Schedule Management</h2>
        <button onClick={generateReport} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
          Generate Attendance Report
        </button>
      </div>

      {showReport && (
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Attendance Report</h3>
          <ul className="list-disc pl-6 text-sm">
            {reportData.map((r, i) => (
              <li key={i}>
                <strong>{r.babysitterName}</strong> - Present: {r.presentCount}, Absent: {r.absentCount}, Full-day: {r.fullDayCount}, Half-day: {r.halfDayCount}, Rate: {r.attendanceRate}%
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={selectedSchedule ? handleUpdate : handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select name="babysitterId" value={scheduleForm.babysitterId} onChange={handleChange} required className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400">
            <option value="">Select Babysitter</option>
            {babysitters.map((b) => (
              <option key={b.id} value={b.id}>
                {b.first_name} {b.last_name}
              </option>
            ))}
          </select>
          <input type="date" name="date" value={scheduleForm.date} onChange={handleChange} required className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400" />
          <input type="time" name="startTime" value={scheduleForm.startTime} onChange={handleChange} required className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400" />
          <input type="time" name="endTime" value={scheduleForm.endTime} onChange={handleChange} required className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400" />
          <select name="sessionType" value={scheduleForm.sessionType} onChange={handleChange} required className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400">
            <option value="full-day">Full Day</option>
            <option value="half-day">Half Day</option>
          </select>
          <select name="status" value={scheduleForm.status} onChange={handleChange} required className="border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400">
            <option value="scheduled">Scheduled</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600">
          {selectedSchedule ? 'Update Schedule' : 'Add Schedule'}
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Current Schedules</h3>
        <table className="w-full table-auto text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border text-left">Babysitter</th>
              <th className="py-2 px-4 border text-left">Date</th>
              <th className="py-2 px-4 border text-left">Time</th>
              <th className="py-2 px-4 border text-left">Session</th>
              <th className="py-2 px-4 border text-left">Status</th>
              <th className="py-2 px-4 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((s, i) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{s.babysitter_name}</td>
                <td className="py-2 px-4 border">{new Date(s.date).toLocaleDateString()}</td>
                <td className="py-2 px-4 border">{s.start_time} - {s.end_time}</td>
                <td className="py-2 px-4 border">{s.session_type}</td>
                <td className="py-2 px-4 border">{s.status}</td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => handleEdit(s, s.babysitter_id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded shadow-md mr-2 hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleManagement;
