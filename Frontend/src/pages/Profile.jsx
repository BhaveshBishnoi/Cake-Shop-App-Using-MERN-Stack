import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/log-in');
      return;
    }
    fetchUserProfile();
    fetchUserOrders();
  }, [isLoggedIn, navigate]);

  const validateProfile = (data) => {
    if (!data.name || data.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error('Please enter a valid email address');
    }
    if (!data.phone || !/^\d{10}$/.test(data.phone)) {
      throw new Error('Please enter a valid 10-digit phone number');
    }
    if (!data.address || data.address.trim().length < 10) {
      throw new Error('Please enter a complete address (min 10 characters)');
    }
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setProfile(data);
        localStorage.setItem('userAddress', data.address);
      } else {
        throw new Error(data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      const response = await fetch('/api/orders/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
        
        const params = new URLSearchParams(location.search);
        const newOrderId = params.get('order');
        if (newOrderId) {
          const orderElement = document.getElementById(`order-${newOrderId}`);
          if (orderElement) {
            orderElement.scrollIntoView({ behavior: 'smooth' });
            orderElement.classList.add('highlight-order');
          }
        }
      } else {
        throw new Error(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch orders');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value.trim()
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      validateProfile(profile);

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profile)
      });
      
      const data = await response.json();
      if (response.ok) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        localStorage.setItem('userAddress', profile.address);
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-4" data-theme="dark">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">My Profile</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Information */}
          <div className="card p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded border"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded border"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded border"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Address</label>
                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded border"
                  rows="3"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded bg-button-bg text-button-text hover:opacity-90"
              >
                Update Profile
              </button>
            </form>
          </div>

          {/* Order History */}
          <div className="card p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Order History</h3>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border border-border-color rounded-lg p-4 hover-effect">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Order #{order._id.slice(-6)}</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      order.status === "Delivered" ? "bg-green-500" :
                      order.status === "Processing" ? "bg-yellow-500" :
                      "bg-accent-color"
                    } text-white`}>
                      {order.status}
                    </span>
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
                      <span>₹{order.total}</span>
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

export default Profile;