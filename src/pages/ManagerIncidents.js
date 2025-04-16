import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ManagerIncidents = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([
    {
      id: 1,
      childName: 'John Doe',
      incidentType: 'injury',
      description: 'Minor scratch on the knee during playtime',
      date: '2024-03-15',
      time: '14:30',
      severity: 'low',
      reportedBy: {
        name: 'Sarah Smith',
        email: 'sarah@example.com'
      },
      status: 'pending',
      parentEmail: 'parent@example.com'
    },
    // Add more sample incidents as needed
  ]);

  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleForwardToParent = (incident) => {
    setSelectedIncident(incident);
    setShowForwardModal(true);
  };

  const handleViewDetails = (incident) => {
    setSelectedIncident(incident);
    setShowDetailsModal(true);
  };

  const handleConfirmForward = () => {
    // Here you would typically make an API call to send the email
    console.log('Forwarding incident to parent:', selectedIncident);
    
    // Update the incident status
    setIncidents(incidents.map(incident => 
      incident.id === selectedIncident.id 
        ? { ...incident, status: 'forwarded' }
        : incident
    ));
    
    // Show success message
    alert('Incident has been forwarded to the parent.');
    
    // Close the modal
    setShowForwardModal(false);
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Incident Reports</h1>
          <button
            onClick={() => navigate('/manager-dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Child
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reported By
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
                {incidents.map((incident) => (
                  <tr key={incident.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {incident.childName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {incident.incidentType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {incident.date} at {incident.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        incident.severity === 'low' ? 'bg-green-100 text-green-800' :
                        incident.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {incident.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {incident.reportedBy.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        incident.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {incident.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleForwardToParent(incident)}
                        disabled={incident.status === 'forwarded'}
                        className={`mr-2 px-3 py-1 rounded-md text-sm font-medium ${
                          incident.status === 'forwarded'
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        Forward to Parent
                      </button>
                      <button
                        onClick={() => handleViewDetails(incident)}
                        className="px-3 py-1 rounded-md text-sm font-medium bg-gray-600 text-white hover:bg-gray-700"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Forward to Parent Modal */}
        {showForwardModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Forward Incident to Parent</h3>
                <button
                  onClick={() => setShowForwardModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Are you sure you want to forward this incident report to the parent?
                </p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium text-gray-900">Child: {selectedIncident?.childName}</p>
                  <p className="text-sm text-gray-500">Type: {selectedIncident?.incidentType}</p>
                  <p className="text-sm text-gray-500">Date: {selectedIncident?.date}</p>
                  <p className="text-sm text-gray-500">Severity: {selectedIncident?.severity}</p>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowForwardModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmForward}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Forward
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {showDetailsModal && selectedIncident && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Incident Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Child Information</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedIncident.childName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Incident Type</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedIncident.incidentType}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Date & Time</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedIncident.date} at {selectedIncident.time}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Severity</h4>
                    <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedIncident.severity === 'low' ? 'bg-green-100 text-green-800' :
                      selectedIncident.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedIncident.severity}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedIncident.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Reported By</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedIncident.reportedBy.name}</p>
                  <p className="mt-1 text-sm text-gray-500">{selectedIncident.reportedBy.email}</p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerIncidents; 