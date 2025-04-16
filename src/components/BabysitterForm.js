import React, { useState } from 'react';

const BabysitterForm = ({ babysitters, setBabysitters }) => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: '', nin: '', age: '',
    nextOfKin: { name: '', relationship: '', phone: '' }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('nextOfKin.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        nextOfKin: { ...prev.nextOfKin, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateAge = (age) => parseInt(age) >= 21 && parseInt(age) <= 35;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAge(formData.age)) return alert('Age must be between 21 and 35');

    const requestBody = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone_number: formData.phone,
      nin: formData.nin,
      age: parseInt(formData.age),
      next_of_kin_name: formData.nextOfKin.name,
      next_of_kin_relationship: formData.nextOfKin.relationship,
      next_of_kin_phone: formData.nextOfKin.phone
    };

    try {
      const response = await fetch('https://backend-esz3.onrender.com/api/babysitters/add-babysitter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error('Failed to add babysitter');

      const data = await response.json();
      alert('Babysitter added!');
      setBabysitters(prev => [...prev, {
        id: data.id || Date.now(),
        ...formData,
        children: [],
        schedule: [],
        payments: []
      }]);
      setFormData({
        firstName: '', lastName: '', email: '', password: '', phone: '', nin: '', age: '',
        nextOfKin: { name: '', relationship: '', phone: '' }
      });
    } catch (err) {
      console.error(err);
      alert('Error adding babysitter');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Babysitter</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['firstName', 'lastName', 'email', 'password', 'phone', 'nin', 'age'].map((field, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-gray-700">
                {field.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase())}
              </label>
              <input
                type={field === 'password' ? 'password' : field === 'age' ? 'number' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-500"
              />
            </div>
          ))}

          {['name', 'relationship', 'phone'].map((field, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-gray-700">
                Next of Kin {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type="text"
                name={`nextOfKin.${field}`}
                value={formData.nextOfKin[field]}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Add Babysitter
        </button>
      </form>
    </div>
  );
};

export default BabysitterForm;
