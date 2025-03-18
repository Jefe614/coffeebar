import { useState } from "react";
import { Link } from "react-router-dom";
import { Add, Remove, Delete, ArrowBack, LocalShipping } from "@mui/icons-material";
import { useCart } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const [promocode, setPromocode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const navigate = useNavigate();
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = isPromoApplied ? subtotal * 0.1 : 0; // 10% discount when promo applied
  const deliveryFee = subtotal > 20 ? 0 : 2.99;
  const total = subtotal - discount + deliveryFee;

  // Apply promocode
  const applyPromocode = () => {
    if (promocode.toLowerCase() === "welcome10") {
      setIsPromoApplied(true);
    } else {
      alert("Invalid promocode");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>
      
      {cartItems.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <h2 className="font-semibold text-lg">Cart Items ({cartItems.reduce((total, item) => total + item.quantity, 0)})</h2>
              </div>
              
              <div className="divide-y">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 flex flex-col sm:flex-row items-center">
                    {/* Item Image */}
                    <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0 mb-4 sm:mb-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-grow sm:ml-4 text-center sm:text-left">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">KSh {item.price.toFixed(2)} each</p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center mt-4 sm:mt-0">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                      >
                        <Remove fontSize="small" />
                      </button>
                      <span className="mx-3 w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                      >
                        <Add fontSize="small" />
                      </button>
                    </div>
                    
                    {/* Price & Remove */}
                    <div className="flex flex-col items-end ml-4 sm:ml-6">
                      <span className="font-semibold">KSh {(item.price * item.quantity).toFixed(2)}</span>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 mt-2 text-sm flex items-center"
                      >
                        <Delete fontSize="small" className="mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-gray-50 border-t flex justify-between">
                <Link to="/menu" className="text-orange-600 hover:text-orange-800 flex items-center">
                  <ArrowBack fontSize="small" className="mr-1" />
                  Continue Shopping
                </Link>
                <button 
                  onClick={clearCart}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>KSh {subtotal.toFixed(2)}</span>
                </div>
                
                {isPromoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (10%)</span>
                    <span>-KSh {discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>{deliveryFee === 0 ? "Free" : `KSh ${deliveryFee.toFixed(2)}`}</span>
                </div>
                
                <div className="flex justify-between font-semibold text-lg pt-3 border-t">
                  <span>Total</span>
                  <span>KSh {total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Promocode */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                <div className="flex">
                  <input
                    type="text"
                    value={promocode}
                    onChange={(e) => setPromocode(e.target.value)}
                    disabled={isPromoApplied}
                    placeholder="Enter code"
                    className="flex-grow border rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <button
                    onClick={applyPromocode}
                    disabled={isPromoApplied || !promocode}
                    className={`px-4 py-2 rounded-r-md ${
                      isPromoApplied 
                        ? "bg-green-500 text-white cursor-default" 
                        : "bg-orange-500 hover:bg-orange-600 text-white"
                    }`}
                  >
                    {isPromoApplied ? "Applied" : "Apply"}
                  </button>
                </div>
                {isPromoApplied && (
                  <p className="text-green-600 text-xs mt-1">10% discount applied!</p>
                )}
                {!isPromoApplied && (
                  <p className="text-gray-500 text-xs mt-1">Try "WELCOME10" for 10% off</p>
                )}
              </div>
              
              {/* Free delivery notice */}
              <div className="flex items-center mt-4 text-sm text-gray-600">
                <LocalShipping fontSize="small" className="mr-2 text-orange-500" />
                {subtotal > 20 
                  ? "You've qualified for free delivery!" 
                  : `Spend KSh ${(20 - subtotal).toFixed(2)} more for free delivery`
                }
              </div>
              
              {/* Checkout button */}
              <button 
                onClick={() => navigate("/checkout")}
                className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md font-semibold transition-colors">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link 
            to="/menu" 
            className="inline-block px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;