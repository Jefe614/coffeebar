import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersApi } from '../services/api'; // Import the ordersApi service

const OrderConfirmation = () => {
  const { orderNumber } = useParams(); // Extract the orderNumber from the URL
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  // Fetch order details when the component mounts
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await ordersApi.trackOrder(orderNumber); // Use the ordersApi service
        console.log('API Response:', response); // Log the response
        setOrder(response.order); // Set the order object from the response
        setError(null);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err.message || 'Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderNumber]);

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading Order Information...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
      </div>
    );
  }

  // Error state or no order found
  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="mb-4">{error || 'Could not find order details.'}</p>
        <Link 
          to="/menu"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md inline-block"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  // Format the order creation date
  const orderDate = new Date(order.created_at).toLocaleString();
  // Format the estimated delivery time
  const estimatedDelivery = order.estimated_delivery 
    ? new Date(order.estimated_delivery).toLocaleString() 
    : 'Not available';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-green-50 p-6 rounded-lg mb-8 text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-2">Order Confirmed!</h1>
        <p className="text-green-600">Thank you for your order, {order.customer_name}!</p>
        <p className="text-green-600">Your order number is <span className="font-bold">{order.order_number}</span></p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Order Status:</p>
              <p className="font-medium capitalize">{order.status}</p>
            </div>
            
            <div>
              <p className="text-gray-600">Order Date:</p>
              <p className="font-medium">{orderDate}</p>
            </div>
            
            <div>
              <p className="text-gray-600">Estimated {order.is_delivery ? 'Delivery' : 'Pickup'}:</p>
              <p className="font-medium">{estimatedDelivery}</p>
            </div>
            
            <div>
              <p className="text-gray-600">Total Amount:</p>
              <p className="font-medium">KSh {parseFloat(order.total_amount).toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        {/* Delivery Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {order.is_delivery ? 'Delivery Information' : 'Pickup Information'}
          </h2>
          
          <div className="space-y-4">
            {order.is_delivery && (
              <div>
                <p className="text-gray-600">Delivery Address:</p>
                <p className="font-medium">{order.delivery_address}</p>
              </div>
            )}
            
            <div>
              <p className="text-gray-600">Contact Information:</p>
              <p className="font-medium">{order.customer_name}</p>
              <p className="font-medium">{order.customer_phone}</p>
              <p className="font-medium">{order.customer_email}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Items */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Item</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-right">Quantity</th>
                <th className="py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3">{item.name}</td>
                  <td className="py-3 text-right">KSh {parseFloat(item.price).toFixed(2)}</td>
                  <td className="py-3 text-right">{item.quantity}</td>
                  <td className="py-3 text-right">KSh {(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="py-3 text-right font-semibold">Total:</td>
                <td className="py-3 text-right font-semibold">KSh {parseFloat(order.total_amount).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="mb-4">For any questions about your order, please contact us.</p>
        <Link 
          to="/menu"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md inline-block"
        >
          Order More
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;