import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('cakes');
  const [cakes, setCakes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [filterStatus, setFilterStatus] = useState('all'); 
  const navigate = useNavigate();
  const isAdmin = useSelector((state) => state.auth.role === 'admin');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    if (activeTab === 'cakes') {
      fetchCakes();
    } else {
      fetchOrders();
    }
  }, [activeTab, isAdmin, navigate]);

  const fetchCakes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cakes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setCakes(data);
      } else {
        throw new Error(data.message || 'Failed to fetch cakes');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch cakes');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      } else {
        throw new Error(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCake = async (cakeId) => {
    if (!window.confirm('Are you sure you want to delete this cake?')) return;

    try {
      const response = await fetch(`/api/cakes/${cakeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      if (response.ok) {
        toast.success('Cake deleted successfully');
        fetchCakes();
      } else {
        throw new Error(data.message || 'Failed to delete cake');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete cake');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      if (response.ok) {
        toast.success('Order status updated successfully');
        fetchOrders();
      } else {
        throw new Error(data.message || 'Failed to update order status');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update order status');
    }
  };

  const filteredCakes = cakes.filter(cake => 
    cake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cake.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' ? true : order.status === filterStatus
  );

  return (
    <div className="min-h-screen p-4" data-theme="dark">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="card p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Total Orders</h3>
            <p className="text-2xl">{orders.length}</p>
          </div>
          <div className="card p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Total Products</h3>
            <p className="text-2xl">{cakes.length}</p>
          </div>
          <div className="card p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Pending Orders</h3>
            <p className="text-2xl">{orders.filter(order => order.status === 'Pending').length}</p>
          </div>
          <div className="card p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Total Revenue</h3>
            <p className="text-2xl">₹{orders.reduce((acc, order) => acc + order.totalAmount, 0)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Products Management */}
          <div className="card p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Products</h3>
              <Link
                to="/admin/add-product"
                className="px-4 py-2 rounded bg-button-bg text-button-text hover:opacity-90"
              >
                Add New Product
              </Link>
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 rounded border"
              />
            </div>
            <div className="space-y-4">
              {filteredCakes.map((cake) => (
                <div key={cake._id} className="flex items-center space-x-4 p-2 hover-effect rounded">
                  <img
                    src={cake.image}
                    alt={cake.name}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      e.target.src = '/placeholder-cake.jpg';
                    }}
                  />
                  <div className="flex-grow">
                    <h4 className="font-semibold">{cake.name}</h4>
                    <p className="text-accent-color">₹{cake.price}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/admin/edit-product/${cake._id}`}
                      className="p-2 rounded bg-button-bg text-button-text hover:opacity-90"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteCake(cake._id)}
                      className="p-2 rounded bg-red-500 text-white hover:opacity-90"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Orders Management */}
          <div className="card p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Orders</h3>
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded ${
                  filterStatus === 'all' ? 'bg-button-bg text-button-text' : 'bg-card-bg'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('Pending')}
                className={`px-3 py-1 rounded ${
                  filterStatus === 'Pending' ? 'bg-button-bg text-button-text' : 'bg-card-bg'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus('Processing')}
                className={`px-3 py-1 rounded ${
                  filterStatus === 'Processing' ? 'bg-button-bg text-button-text' : 'bg-card-bg'
                }`}
              >
                Processing
              </button>
              <button
                onClick={() => setFilterStatus('Delivered')}
                className={`px-3 py-1 rounded ${
                  filterStatus === 'Delivered' ? 'bg-button-bg text-button-text' : 'bg-card-bg'
                }`}
              >
                Delivered
              </button>
            </div>
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order._id} className="border border-border-color rounded-lg p-4 hover-effect">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Order #{order._id.slice(-6)}</span>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                      className="px-2 py-1 rounded border"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span>{item.name} x {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-border-color mt-2 pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹{order.totalAmount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
