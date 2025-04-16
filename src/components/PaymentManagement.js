import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentManagement = () => {
  const [babysitters, setBabysitters] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentForm, setPaymentForm] = useState({
    babysitterId: '',
    date: '',
    sessionType: 'full-day',
    status: 'pending',
    childrenCount: 1,
  });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [editForm, setEditForm] = useState({
    babysitterId: '',
    date: '',
    sessionType: '',
    status: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({ ...prev, [name]: value }));
  };

  const calculatePayment = (sessionType, childrenCount) => {
    const rate = sessionType === 'full-day' ? 5000 : 2000;
    return rate * childrenCount;
  };

  const fetchBabysitters = async () => {
    try {
      const res = await axios.get('https://backend-esz3.onrender.com/api/babysitters/babysitters');
      setBabysitters(res.data);
    } catch (err) {
      console.error('Failed to fetch babysitters:', err);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await axios.get('https://backend-esz3.onrender.com/api/payments/allpayments');
      setPayments(res.data);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    }
  };

  useEffect(() => {
    fetchBabysitters();
    fetchPayments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const babysitter = babysitters.find((b) => b.id === parseInt(paymentForm.babysitterId));
    if (!babysitter) {
      return alert('Babysitter not found');
    }

    const childrenCount = parseInt(paymentForm.childrenCount) || 1;
    const amount = calculatePayment(paymentForm.sessionType, childrenCount);

    try {
      const res = await axios.post('https://backend-esz3.onrender.com/api/payments/generatepayment', {
        babysitter_id: babysitter.id,
        babysitter_name: `${babysitter.first_name} ${babysitter.last_name}`,
        date: paymentForm.date,
        session_type: paymentForm.sessionType,
        children_count: childrenCount,
        amount,
        status: paymentForm.status,
      });

      setPayments((prev) => [res.data, ...prev]);
      setPaymentForm({
        babysitterId: '',
        date: '',
        sessionType: 'full-day',
        status: 'pending',
        childrenCount: 1,
      });
    } catch (err) {
      console.error('Failed to add payment:', err);
      alert('Failed to add payment.');
    }
  };

  const handleEdit = (payment) => {
    setSelectedPayment(payment);
    setEditForm({
      babysitterId: payment.babysitter_id,
      date: payment.date,
      sessionType: payment.session_type,
      status: payment.status,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`https://backend-esz3.onrender.com/api/payments/${selectedPayment.id}/status`, {
        status: editForm.status,
      });

      setPayments((prev) => prev.map((p) => (p.id === selectedPayment.id ? res.data : p)));
      setSelectedPayment(null);
      setEditForm({ babysitterId: '', date: '', sessionType: '', status: '' });
    } catch (err) {
      console.error('Failed to update payment:', err);
      alert('Failed to update payment.');
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this payment?');
    if (!confirm) return;

    try {
      await axios.delete(`https://backend-esz3.onrender.com/api/payments/${id}`);
      setPayments((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete payment:', err);
      alert('Failed to delete payment.');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Payment Management</h2>

      {/* Payment Creation Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Form Fields */}
          <div>
            <label htmlFor="babysitterId" className="block text-sm font-medium text-gray-700">Babysitter</label>
            <select
              id="babysitterId"
              name="babysitterId"
              value={paymentForm.babysitterId}
              onChange={handleChange}
              required
              className="border p-2 rounded text-black w-full"
            >
              <option value="">Select Babysitter</option>
              {babysitters.map((b) => (
                <option key={b.id} value={b.id}>{b.first_name} {b.last_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={paymentForm.date}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label htmlFor="sessionType" className="block text-sm font-medium text-gray-700">Session Type</label>
            <select
              id="sessionType"
              name="sessionType"
              value={paymentForm.sessionType}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            >
              <option value="full-day">Full Day (5,000 UGX per child)</option>
              <option value="half-day">Half Day (2,000 UGX per child)</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              name="status"
              value={paymentForm.status}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div>
            <label htmlFor="childrenCount" className="block text-sm font-medium text-gray-700">Number of Children</label>
            <input
              type="number"
              id="childrenCount"
              name="childrenCount"
              min="1"
              value={paymentForm.childrenCount}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        <button type="submit" className="bg-blue-500 w-full text-white px-4 py-2 rounded">
          Generate Payment
        </button>
      </form>

      {/* Payments Table */}
      <div className="mt-6 overflow-x-auto">
        <h3 className="text-lg font-medium mb-2">Payments</h3>
        <table className="w-full table-auto text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Babysitter</th>
              <th className="border px-2 py-1">Children</th>
              <th className="border px-2 py-1">Amount</th>
              <th className="border px-2 py-1">Session</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td className="border text-black px-2 py-1 text-center">
                  {new Date(p.date).toLocaleDateString('en-GB')}
                </td>
                <td className="border px-2 py-1">{p.babysitter_name || 'N/A'}</td>
                <td className="border px-2 py-1 text-center">{p.children_count || 0}</td>
                <td className="border px-2 py-1 text-center">{p.amount} UGX</td>
                <td className="border px-2 py-1">{p.session_type}</td>
                <td className="border px-2 py-1">{p.status}</td>
                <td className="border px-2 py-1 space-x-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Payment */}
      {selectedPayment && (
        <form onSubmit={handleUpdate} className="mt-4 space-y-4">
          <h4 className="text-md font-semibold">Edit Payment</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="editDate" className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                id="editDate"
                name="date"
                value={editForm.date}
                className="border p-2 rounded"
                disabled
              />
            </div>
            <div>
              <label htmlFor="editStatus" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="editStatus"
                name="status"
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className="border p-2 rounded"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Update Payment
          </button>
        </form>
      )}
    </div>
  );
};

export default PaymentManagement;
