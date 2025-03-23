import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersApi } from "../services/api";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);

  // Calculate subtotal, delivery fee and total
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = 2.99; // Example fee
  const total = subtotal + deliveryFee;

  // Form state
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: '',
    is_delivery: true,
    payment_method: 'cash',
    special_instructions: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Format items for the API
      const formattedItems = cartItems.map(item => ({
        item_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      // Prepare order data
      const orderData = {
        ...formData,
        total_amount: total,
        items: formattedItems
      };

      // Send order to server using ordersApi
      const response = await ordersApi.createOrder(orderData);
      
      setSuccess('Order placed successfully!');
      setOrderNumber(response.order_number);
      clearCart();
      
      // Redirect to order confirmation after 2 seconds
      setTimeout(() => {
        navigate(`/order-confirmation/${response.order_number}`);
      }, 2000);
      
    } catch (err) {
      console.error('Order submission error:', err);
      setError(err.errors || 'There was an error placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !success) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="mb-4">Add some items to your cart before checkout.</p>
        <button 
          onClick={() => navigate('/menu')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md"
        >
          View Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>{success}</p>
          <p>Your order number is: <strong>{orderNumber}</strong></p>
          <p>Redirecting to order confirmation...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Customer Information Form */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {typeof error === 'object' ? (
                    <ul>
                      {Object.entries(error).map(([field, msgs]) => (
                        <li key={field}><strong>{field}:</strong> {Array.isArray(msgs) ? msgs.join(', ') : msgs}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{error}</p>
                  )}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      name="is_delivery"
                      id="is_delivery"
                      checked={formData.is_delivery}
                      onChange={handleChange}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-300"
                    />
                    <label htmlFor="is_delivery" className="ml-2 text-gray-700">
                      Delivery (+ KSh {deliveryFee.toFixed(2)})
                    </label>
                  </div>
                  
                  {formData.is_delivery && (
                    <div>
                      <label className="block text-gray-700 mb-1">Delivery Address *</label>
                      <textarea
                        name="delivery_address"
                        value={formData.delivery_address}
                        onChange={handleChange}
                        required={formData.is_delivery}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                      ></textarea>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Payment Method *</label>
                  <select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                  >
                    <option value="cash">Cash on Delivery</option>
                    <option value="mpesa">M-Pesa</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-1">Special Instructions</label>
                  <textarea
                    name="special_instructions"
                    value={formData.special_instructions}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                    placeholder="Any special requests or instructions..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-md text-white font-semibold ${
                    loading ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="max-h-64 overflow-y-auto mb-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p>KSh {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 py-4 border-b">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>KSh {subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Delivery Fee</p>
                  <p>KSh {deliveryFee.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex justify-between py-4 font-bold text-lg">
                <p>Total</p>
                <p>KSh {total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;