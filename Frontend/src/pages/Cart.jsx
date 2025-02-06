import { useSelector, useDispatch } from 'react-redux';
import { cartActions } from '../store/cart';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemoveFromCart = (id) => {
    dispatch(cartActions.removeFromCart({ id }));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity === 1) {
      dispatch(cartActions.decreaseQuantity({ id }));
    } else {
      dispatch(cartActions.addToCart({ id, quantity }));
    }
  };

  const handleCheckout = async () => {
    try {
      if (!user) {
        toast.error("Please login to proceed with checkout");
        navigate("/login", { state: { from: "/cart" } });
        return;
      }

      const orderData = {
        items: cartItems,
        totalAmount: totalAmount,
        shippingAddress: user.address || localStorage.getItem("userAddress"),
        status: "Pending"
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        dispatch(cartActions.clearCart());
        toast.success("Order placed successfully!");
        navigate("/profile");
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } catch (error) {
      toast.error("Error placing order: " + error.message);
    }
  };

  return (
    <div className="min-h-screen p-4" data-theme="dark">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xl mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className="bg-accent-color text-white px-6 py-2 rounded hover:opacity-90"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {cartItems.map((item) => (
              <div key={item.id} className="card p-4 mb-4 rounded-lg shadow hover-effect">
                <div className="flex items-center space-x-4">
                  <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded" />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-accent-color">₹{item.price}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-2 py-1 rounded bg-button-bg text-button-text"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 rounded bg-button-bg text-button-text"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="text-accent-color hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="card p-4 rounded-lg shadow h-fit">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-border-color my-2"></div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full mt-4 py-2 rounded bg-button-bg text-button-text hover:opacity-90"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;