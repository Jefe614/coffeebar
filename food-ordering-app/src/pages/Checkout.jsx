import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ordersApi } from "../services/api";
import { message } from "antd";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    delivery_address: "",
    is_delivery: true,
    payment_method: "cash",
    special_instructions: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = formData.is_delivery ? 2.99 : 0;
  const total = subtotal + deliveryFee;

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const orderData = {
        ...formData,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total
      };

      await ordersApi.createOrder(orderData);

      message.success("Order placed successfully!");
      clearCart();
      navigate("/orders"); // Redirect to order tracking page
    } catch (err) {
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="customer_name"
            placeholder="Full Name"
            value={formData.customer_name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="email"
            name="customer_email"
            placeholder="Email"
            value={formData.customer_email}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="tel"
            name="customer_phone"
            placeholder="Phone Number"
            value={formData.customer_phone}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* Delivery Info */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_delivery"
              checked={formData.is_delivery}
              onChange={handleChange}
            />
            <span>Delivery?</span>
          </label>
          {formData.is_delivery && (
            <input
              type="text"
              name="delivery_address"
              placeholder="Delivery Address"
              value={formData.delivery_address}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-2"
              required
            />
          )}
        </div>

        {/* Payment Method */}
        <div>
          <label className="font-bold">Payment Method</label>
          <select
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="cash">Cash on Delivery</option>
            <option value="mobile_wallet">Mobile Wallet</option>
          </select>
        </div>

        {/* Special Instructions */}
        <textarea
          name="special_instructions"
          placeholder="Special instructions (optional)"
          value={formData.special_instructions}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        ></textarea>

        {/* Order Summary */}
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-bold">Order Summary</h3>
          <p>Subtotal: KSh {subtotal.toFixed(2)}</p>
          <p>Delivery Fee: KSh {deliveryFee.toFixed(2)}</p>
          <p className="font-bold">Total: KSh {total.toFixed(2)}</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full bg-orange-500 text-white p-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-600"}`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
