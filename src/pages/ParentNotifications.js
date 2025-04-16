import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ParentNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState({
    checkInOut: true,
    paymentReminders: true,
    overduePayments: true,
    incidentReports: true,
    emailNotifications: true,
    smsNotifications: true
  });

  // Sample data - replace with actual API calls
  const [children, setChildren] = useState([
    {
      id: 1,
      name: 'John Doe',
      parentName: 'Jane Doe',
      parentEmail: 'jane@example.com',
      parentPhone: '+256700000000',
      lastCheckIn: '2024-03-20 08:00',
      lastCheckOut: '2024-03-20 17:00',
      paymentStatus: 'paid',
      nextPaymentDue: '2024-04-01',
      balance: 0
    }
  ]);

  // Function to send notifications
  const sendNotification = (type, message, childId) => {
    const child = children.find(c => c.id === childId);
    if (!child) return;

    const notification = {
      id: Date.now(),
      type,
      message,
      childId,
      childName: child.name,
      parentName: child.parentName,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    // Add to notifications list
    setNotifications(prev => [...prev, notification]);

    // Send email if enabled
    if (notificationSettings.emailNotifications) {
      sendEmailNotification(notification);
    }

    // Send SMS if enabled
    if (notificationSettings.smsNotifications) {
      sendSMSNotification(notification);
    }
  };

  // Function to send email notification
  const sendEmailNotification = (notification) => {
    // Implement email sending logic here
    console.log('Sending email notification:', notification);
  };

  // Function to send SMS notification
  const sendSMSNotification = (notification) => {
    // Implement SMS sending logic here
    console.log('Sending SMS notification:', notification);
  };

  // Function to check for payment due dates
  const checkPaymentDueDates = () => {
    const today = new Date();
    children.forEach(child => {
      const dueDate = new Date(child.nextPaymentDue);
      const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

      if (daysUntilDue === 7 && notificationSettings.paymentReminders) {
        sendNotification(
          'payment_reminder',
          `Payment reminder: Your payment of 500,000 UGX for ${child.name}'s daycare fees is due in 7 days.`,
          child.id
        );
      }

      if (daysUntilDue < 0 && child.paymentStatus !== 'paid' && notificationSettings.overduePayments) {
        sendNotification(
          'overdue_payment',
          `Urgent: Your payment of 500,000 UGX for ${child.name}'s daycare fees is overdue.`,
          child.id
        );
      }
    });
  };

  // Function to handle check-in/check-out notifications
  const handleAttendanceNotification = (childId, type) => {
    const child = children.find(c => c.id === childId);
    if (!child) return;

    if (notificationSettings.checkInOut) {
      sendNotification(
        'attendance',
        `${child.name} has been ${type === 'check-in' ? 'checked in' : 'checked out'} at ${new Date().toLocaleTimeString()}.`,
        childId
      );
    }
  };

  // Function to handle incident reports
  const handleIncidentReport = (childId, incidentDetails) => {
    if (notificationSettings.incidentReports) {
      sendNotification(
        'incident',
        `Incident Report: ${incidentDetails}`,
        childId
      );
    }
  };

  // Check for notifications periodically
  useEffect(() => {
    const interval = setInterval(() => {
      checkPaymentDueDates();
    }, 24 * 60 * 60 * 1000); // Check daily

    return () => clearInterval(interval);
  }, [children, notificationSettings]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Parent Notifications</h1>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/manager')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="checkInOut"
                  checked={notificationSettings.checkInOut}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    checkInOut: e.target.checked
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="checkInOut" className="ml-2 block text-sm text-gray-900">
                  Check-in/Check-out Notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="paymentReminders"
                  checked={notificationSettings.paymentReminders}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    paymentReminders: e.target.checked
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="paymentReminders" className="ml-2 block text-sm text-gray-900">
                  Payment Reminders
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="overduePayments"
                  checked={notificationSettings.overduePayments}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    overduePayments: e.target.checked
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="overduePayments" className="ml-2 block text-sm text-gray-900">
                  Overdue Payment Alerts
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="incidentReports"
                  checked={notificationSettings.incidentReports}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    incidentReports: e.target.checked
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="incidentReports" className="ml-2 block text-sm text-gray-900">
                  Incident Reports
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    emailNotifications: e.target.checked
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                  Email Notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="smsNotifications"
                  checked={notificationSettings.smsNotifications}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    smsNotifications: e.target.checked
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-900">
                  SMS Notifications
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Notification History */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Notification History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Child</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <tr key={notification.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(notification.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        notification.type === 'attendance' ? 'bg-blue-100 text-blue-800' :
                        notification.type === 'payment_reminder' ? 'bg-yellow-100 text-yellow-800' :
                        notification.type === 'overdue_payment' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {notification.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{notification.childName}</td>
                    <td className="px-6 py-4">{notification.message}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        notification.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {notification.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentNotifications; 