import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ChildManagement = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [children, setChildren] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    parent_name: '',
    parent_phone: '',
    special_needs: '',
    duration: 'half-day',
  });
  const [isLoading, setIsLoading] = useState(true);  // Loading state

  // Fetch children from API
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setIsLoading(true);  // Start loading
        const response = await fetch('https://backend-esz3.onrender.com/api/babies/babies');
        const data = await response.json();
        setChildren(data);
      } catch (error) {
        console.error('Error fetching children:', error);
      } finally {
        setIsLoading(false);  // End loading
      }
    };

    fetchChildren();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // API call to create a new baby
    fetch('https://backend-esz3.onrender.com/api/babies/addbaby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((newChild) => {
        setChildren([...children, newChild]); // Add new child to state
        setFormData({
          name: '',
          age: '',
          parent_name: '',
          parent_phone: '',
          special_needs: '',
          duration: 'half-day',
        });
        setShowAddForm(false);
      })
      .catch((error) => console.error('Error adding child:', error));
  };

  const handleRemoveChild = (childId) => {
    if (window.confirm('Are you sure you want to remove this child?')) {
      // API call to delete a baby
      fetch(`https://backend-esz3.onrender.com/api/babies/baby/${childId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            setChildren((prev) => prev.filter((child) => child.id !== childId)); // Remove child from state
          }
        })
        .catch((error) => console.error('Error deleting child:', error));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Child Management</h1>
          <button
            onClick={() => navigate('/manager-dashboard')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="spinner-border animate-spin h-8 w-8 border-t-4 border-blue-500 rounded-full"></div>
          </div>
        ) : (
          <>
            {/* Children List */}
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Special Needs</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {children.map((child) => (
                    <tr key={child.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{child.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{child.age}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{child.parent_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{child.parent_phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{child.special_needs}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{child.duration}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleRemoveChild(child.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Child Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Add New Child
              </button>
            </div>

            {/* Add Child Form Modal */}
            {showAddForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                  <h2 className="text-2xl font-bold mb-4">Add New Child</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Child's Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Parent's Name</label>
                      <input
                        type="text"
                        name="parent_name"
                        value={formData.parent_name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Parent's Phone</label>
                      <input
                        type="tel"
                        name="parent_phone"
                        value={formData.parent_phone}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Special Needs</label>
                      <input
                        type="text"
                        name="special_needs"
                        value={formData.special_needs}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duration</label>
                      <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="half-day">Half Day</option>
                        <option value="full-day">Full Day</option>
                      </select>
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                      >
                        Add Child
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChildManagement;
