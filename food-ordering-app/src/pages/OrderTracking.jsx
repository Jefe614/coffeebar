import { useState, useEffect } from "react";

const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Sample order data - in a real app, this would come from your API
  const sampleOrders = {
    "ORD12345": {
      id: "ORD12345",
      status: "preparing",
      estimatedDelivery: "2025-03-16T14:30:00",
      items: [
        { name: "Classic Cheeseburger", quantity: 2 },
        { name: "Cappuccino", quantity: 1 }
      ],
      total: 22.48,
      currentStep: 2,
      placedAt: "2025-03-16T13:45:00"
    },
    "ORD54321": {
      id: "ORD54321",
      status: "out_for_delivery",
      estimatedDelivery: "2025-03-16T14:15:00",
      items: [
        { name: "Margherita Pizza", quantity: 1 },
        { name: "Fresh Orange Juice", quantity: 2 }
      ],
      total: 20.97,
      currentStep: 3,
      placedAt: "2025-03-16T13:30:00"
    }
  };

  // Track order function
  const trackOrder = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const order = sampleOrders[orderNumber];
      setTrackingResult(order || "not_found");
      setLoading(false);
    }, 800);
  };

  // Get status label
  const getStatusLabel = (status) => {
    const statusMap = {
      "confirmed": "Order Confirmed",
      "preparing": "Preparing Your Order",
      "out_for_delivery": "Out For Delivery",
      "delivered": "Delivered"
    };
    return statusMap[status] || status;
  };

  // Format date
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Track Your Order</h1>
      
      {/* Order tracking form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={trackOrder}>
          <div className="flex flex-col md:flex-row">
            <input
              type="text"
              placeholder="Enter your order number (e.g., ORD12345)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.trim())}
              className="flex-grow border rounded-l-md rounded-r-md md:rounded-r-none px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
              required
            />
            <button
              type="submit"
              className="mt-2 md:mt-0 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md md:rounded-l-none font-medium transition-colors"
              disabled={loading}
            >
              {loading ? "Tracking..." : "Track Order"}
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-gray-600 text-sm">
          <p>Don't have your order number? Check your email for the order confirmation.</p>
        </div>
      </div>
      
      {/* Tracking result */}
      {trackingResult && trackingResult !== "not_found" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">Order #{trackingResult.id}</h2>
                <p className="text-gray-600">Placed on {new Date(trackingResult.placedAt).toLocaleDateString()} at {formatTime(trackingResult.placedAt)}</p>
              </div>
              <div className="mt-2 md:mt-0">
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  {getStatusLabel(trackingResult.status)}
                </span>
              </div>
            </div>
            
            {/* Order progress */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Order Progress</h3>
              <div className="relative">
                <div className="absolute top-3 left-0 w-full h-1 bg-gray-200 z-0"></div>
                <div className="flex justify-between relative z-10">
                  {["confirmed", "preparing", "out_for_delivery", "delivered"].map((step, index) => (
                    <div key={step} className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        index < trackingResult.currentStep ? "bg-green-500" : 
                        index === trackingResult.currentStep ? "bg-orange-500" : "bg-gray-300"
                      }`}>
                        {index < trackingResult.currentStep ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-white text-xs">{index + 1}</span>
                        )}
                      </div>
                      <span className="text-xs mt-2 text-gray-600">{getStatusLabel(step)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Estimated delivery */}
            <div className="mb-6 p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold">Estimated Delivery</h3>
              <p className="text-orange-800 text-lg">
                {formatTime(trackingResult.estimatedDelivery)} Today
              </p>
            </div>
            
            {/* Order summary */}
            <div>
              <h3 className="font-semibold mb-3">Order Summary</h3>
              <div className="border-t border-b py-4">
                {trackingResult.items.map((item, index) => (
                  <div key={index} className="flex justify-between mb-2">
                    <span>{item.quantity}x {item.name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <p className="font-semibold">Total: ${trackingResult.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Not found message */}
      {trackingResult === "not_found" && (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">We couldn't find an order with the number {orderNumber}.</p>
          <p className="text-gray-600">Please check your order number and try again.</p>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;