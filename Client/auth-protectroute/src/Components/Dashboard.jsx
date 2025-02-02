import { useState, useEffect } from 'react';
import axios from '../axios';

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/customers', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setCustomers(response.data);
    } catch (err) {
      setError('Error fetching customers');
    }
  };

  const handleInputChange = (e) => {
    setNewCustomer({
      ...newCustomer,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/customers', newCustomer, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setSuccess('Customer added successfully');
      setNewCustomer({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
      });
      fetchCustomers();
    } catch (err) {
      setError('Error adding customer');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/customers/${id}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setSuccess('Customer deleted successfully');
      fetchCustomers();
    } catch (err) {
      setError('Error deleting customer');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Customer Management Dashboard</h2>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Add New Customer</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              value={newCustomer.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={newCustomer.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <input
              type="tel"
              name="phone"
              value={newCustomer.phone}
              onChange={handleInputChange}
              placeholder="Phone"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <input
              type="text"
              name="address"
              value={newCustomer.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <textarea
              name="notes"
              value={newCustomer.notes}
              onChange={handleInputChange}
              placeholder="Notes"
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Customer
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Customer List</h3>
        <div className="grid gap-4">
          {customers.map((customer) => (
            <div
              key={customer._id}
              className="border rounded p-4 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{customer.name}</h4>
                  <p className="text-gray-600">{customer.email}</p>
                  {customer.phone && <p className="text-gray-600">{customer.phone}</p>}
                  {customer.address && <p className="text-gray-600">{customer.address}</p>}
                  {customer.notes && <p className="text-gray-600 mt-2">{customer.notes}</p>}
                </div>
                <button
                  onClick={() => handleDelete(customer._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;





