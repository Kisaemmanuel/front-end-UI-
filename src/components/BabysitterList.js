import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BabysitterList = () => {
  const [babysitters, setBabysitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBabysitters, setFilteredBabysitters] = useState([]);

  useEffect(() => {
    const fetchBabysitters = async () => {
      try {
        const response = await axios.get('https://backend-esz3.onrender.com/api/babysitters/babysitters');
        const formatted = response.data.map(b => ({
          id: b.id,
          userId: b.user_id,
          firstName: b.first_name,
          lastName: b.last_name,
          phone: b.phone_number,
          email: b.email,
          nin: b.nin,
          age: b.age,
          nextOfKin: {
            name: b.next_of_kin_name,
            relationship: b.next_of_kin_relationship,
            phone: b.next_of_kin_phone
          },
          payments: Array.isArray(b.payments) ? b.payments : []
        }));
        
        setBabysitters(formatted);
        setFilteredBabysitters(formatted); // Initialize filtered list with all babysitters
      } catch (err) {
        console.error('Failed to fetch babysitters:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBabysitters();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = babysitters.filter(b => 
        `${b.firstName} ${b.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBabysitters(filtered);
    } else {
      setFilteredBabysitters(babysitters);
    }
  }, [searchQuery, babysitters]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://backend-esz3.onrender.com/api/babysitters/babysitter/${id}`);
      setBabysitters(babysitters.filter(b => b.id !== id));
    } catch (err) {
      console.error('Failed to delete babysitter:', err);
    }
  };

  const handleUpdate = (id) => {
    console.log(`Update babysitter with ID: ${id}`);
  };

  if (loading) {
    return <div className="text-gray-500 text-sm">Loading...</div>;
  }

  const renderTable = (data) => {
    return (
      <table className="min-w-full divide-y divide-gray-200 text-xs">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-gray-500">Name</th>
            <th className="px-3 py-2 text-left text-gray-500">Contact</th>
            <th className="px-3 py-2 text-left text-gray-500">NIN / Age</th>
            <th className="px-3 py-2 text-left text-gray-500">Next of Kin</th>
            <th className="px-3 py-2 text-left text-gray-500">Payments</th>
            <th className="px-3 py-2 text-left text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map(b => (
            <tr key={b.id} className="hover:bg-gray-50">
              <td className="px-3 py-2">{b.firstName} {b.lastName}</td>
              <td className="px-3 py-2">
                <div className="text-sm text-gray-900">{b.phone}</div>
                <div className="text-sm text-gray-500">{b.email}</div>
              </td>
              <td className="px-3 py-2">
                <div className="text-sm">{b.nin}</div>
                <div className="text-sm">{b.age} yrs</div>
              </td>
              <td className="px-3 py-2">
                <div className="text-sm">Name: {b.nextOfKin.name}</div>
                <div className="text-sm">Relationship: {b.nextOfKin.relationship}</div>
                <div className="text-sm text-gray-500">Phone: {b.nextOfKin.phone}</div>
              </td>
              <td className="px-3 py-2">
                {b.payments.length === 0 ? (
                  <div className="text-sm text-gray-400 italic">No payments</div>
                ) : (
                  <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                    {b.payments.map((p, index) => (
                      <div
                        key={index}
                        className={`p-1 rounded-md shadow-sm text-xs ${
                          p.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        <div><strong>Type:</strong> {p.session_type}</div>
                        <div><strong>Amount:</strong> UGX {p.amount}</div>
                      </div>
                    ))}
                  </div>
                )}
              </td>
              <td className="px-3 py-2">
                <button
                  onClick={() => handleUpdate(b.id)}
                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold p-4 border-b">All Babysitters</h2>
      
      {/* Search Input */}
      <div className="p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Babysitter by Name"
          className="border border-gray-300 px-3 py-2 text-xs rounded-md w-full"
        />
      </div>

      {/* Show filtered babysitters */}
      <div className="p-4">{renderTable(filteredBabysitters)}</div>
    </div>
  );
};

export default BabysitterList;
