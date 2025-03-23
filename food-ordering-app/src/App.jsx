import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import OrderConfirmation from "./pages/OrderConfirmation";

const App = () => {
  return (
    <AuthProvider> {/* Add the AuthProvider here */}
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/track-order" element={<OrderTracking />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
            </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;