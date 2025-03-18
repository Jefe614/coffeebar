import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCartOutlined, Search, PersonOutline, Menu, Close, LocalShippingOutlined } from "@mui/icons-material";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartItems } = useCart();

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);


  return (
    <nav className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-4 flex justify-between items-center shadow-md relative z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Link to="/" className="text-2xl font-bold">Coffee Bar ☕</Link>
      </div>

      {/* Search Bar (Hidden on mobile unless toggled) */}
      {searchOpen && (
        <div className="absolute top-16 left-0 w-full px-4 md:hidden">
          <div className="flex items-center bg-white rounded-full px-3 py-2 shadow-lg">
            <Search className="text-gray-600" />
            <input 
              type="text" 
              placeholder="Search food..." 
              className="outline-none px-2 py-1 w-full text-gray-700"
              autoFocus
            />
          </div>
        </div>
      )}
      
      {/* Desktop Search Bar */}
      <div className="hidden md:flex items-center bg-white rounded-full px-3 py-1 md:w-auto">
        <Search className="text-gray-600" />
        <input 
          type="text" 
          placeholder="Search food..." 
          className="outline-none px-2 py-1 w-40 md:w-64 text-gray-700"
        />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-6 items-center">
        <Link to="/menu" className="hover:text-yellow-300 font-semibold">Menu</Link>
        <Link to="/track-order" className="mx-2 p-2 flex items-center">
          <LocalShippingOutlined className="mr-1" />
          Track Order
        </Link>
        <Link to="/cart" className="relative">
          <ShoppingCartOutlined className="text-white text-2xl" />
          {cartItemCount > 0 && (
             <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
             {cartItemCount}
           </span>
         )}
        </Link>
        <Link to="/auth" className="flex items-center gap-2 bg-yellow-400 px-3 py-1 rounded-full hover:bg-yellow-500">
          <PersonOutline />
          <span>Login</span>
        </Link>
      </div>

      {/* Mobile Menu & Search Toggle */}
      <div className="md:hidden flex gap-4">
        <button onClick={() => setSearchOpen(!searchOpen)} className="p-1">
          <Search className="text-white text-2xl" />
        </button>
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">
          {menuOpen ? <Close className="text-white text-2xl" /> : <Menu className="text-white text-2xl" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="fixed top-16 left-0 w-full bg-orange-500 flex flex-col items-center py-4 md:hidden shadow-lg transition-all duration-300 ease-in-out z-40">
          <div className="w-full px-6 flex flex-col gap-4">
            <Link 
              to="/menu" 
              className="hover:text-yellow-300 font-semibold text-center py-3 border-b border-orange-400"
              onClick={() => setMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              to="/track-order"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 border-b border-orange-400"
            >
              <LocalShippingOutlined className="mr-2" />
              Track Order
            </Link>
            <Link 
              to="/cart" 
              className="flex items-center justify-center gap-2 py-3 border-b border-orange-400"
              onClick={() => setMenuOpen(false)}
            >
              <ShoppingCartOutlined className="text-white text-2xl" />
              <span>Cart</span>
              <span className="bg-red-600 text-white text-xs rounded-full px-2 py-1 ml-1">2</span>
            </Link>
            <Link 
              to="/auth" 
              className="flex items-center justify-center gap-2 bg-yellow-400 px-3 py-3 rounded-full hover:bg-yellow-500 mt-2"
              onClick={() => setMenuOpen(false)}
            >
              <PersonOutline />
              <span>Login</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;