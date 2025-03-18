import { useState } from "react";
import { ShoppingCartOutlined, Search } from "@mui/icons-material";
import { message } from "antd";
import AfricanTea  from "../assets/images/AfricanTea.jpg";
import WhiteCoffee from "../assets/images/WhiteCoffee.jpg";
import BlackCoffee from "../assets/images/BlackCoffee.jpeg";
import IcedTea from "../assets/images/IcedTea.jpg";
import LemonTea from "../assets/images/LemonTea.jpg";
import GreenTea from "../assets/images/GreenTea.jpg";
import UjiPower from "../assets/images/UjiPower.jpeg";
import Chocolate from "../assets/images/Chocolate.jpg";
import Toast from "../assets/images/Toast.jpg";
import Nduma from "../assets/images/Nduma.jpg";
import pancake from "../assets/images/pancake.jpg";
import pork from "../assets/images/pork.jpg";
import ricepork from "../assets/images/ricepork.jpg";
import beefugali from "../assets/images/beefugali.jpg";
import ricee from "../assets/images/ricee.jpg";
import ciken from "../assets/images/ciken.jpeg";
import chicken from "../assets/images/chicken.jpg";
import porkcom from "../assets/images/porkcom.jpeg";
import porkcom2 from "../assets/images/porkcom2.jpeg";
import pork3 from "../assets/images/pork3.jpeg";
import beegreen from "../assets/images/beegreen.jpg";
import riceminji from "../assets/images/riceminji.jpg";
import chminji from "../assets/images/chminji.jpg";
import porkugli from "../assets/images/porkugli.jpeg";
import beenchpo from "../assets/images/beenchpo.jpeg";
import kkkk from "../assets/images/kkkk.jpeg";
import ricejhi from "../assets/images/ricejhi.jpeg";
import mukimo from "../assets/images/mukimo.jpg";
import githeri from "../assets/images/githeri.jpg";
import Yoghurt from "../assets/images/Yoghurt.jpeg";
import ma from "../assets/images/ma.jpg";
import Soda from "../assets/images/Soda.jpg";
import energy from "../assets/images/energy.jpeg";
import wter from "../assets/images/wter.jpg";
import Minute from "../assets/images/Minute.jpeg";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";







// Extracted menu items from the PDF
const sampleMenu = [
  { 
    id: 1, 
    name: "African Tea", 
    price: 50, 
    category: "Breakfast",
    description: "Traditional African tea",
    image: AfricanTea
  },
  { 
    id: 2, 
    name: "White Coffee", 
    price: 100, 
    category: "Breakfast",
    description: "White coffee",
    image: WhiteCoffee
  },
  { 
    id: 3, 
    name: "Black Coffee", 
    price: 70, 
    category: "Breakfast",
    description: "Black coffee",
    image: BlackCoffee
  },
  { 
    id: 4, 
    name: "Iced Tea", 
    price: 80, 
    category: "Breakfast",
    description: "Refreshing iced tea",
    image: IcedTea
  },
  { 
    id: 5, 
    name: "Lemon Tea", 
    price: 80, 
    category: "Breakfast",
    description: "Tea with lemon",
    image: LemonTea
  },
  { 
    id: 6, 
    name: "Green Tea", 
    price: 80, 
    category: "Breakfast",
    description: "Healthy green tea",
    image: GreenTea
  },
  { 
    id: 7, 
    name: "Uji Power", 
    price: 150, 
    category: "Breakfast",
    description: "Traditional porridge",
    image: UjiPower
  },
  { 
    id: 8, 
    name: "Chocolate", 
    price: 50, 
    category: "Breakfast",
    description: "Hot chocolate",
    image: Chocolate
  },
  { 
    id: 9, 
    name: "African Tea with Mandazi/Chapati/Toast", 
    price: 50, 
    category: "Breakfast",
    description: "African tea served with mandazi, chapati, or toast",
    image: Toast
  },
  { 
    id: 10, 
    name: "Nduma/Sweet Potato/Cassava with African Tea/Coffee/Chocolate", 
    price: 250, 
    category: "Breakfast",
    description: "Nduma, sweet potato, or cassava served with African tea, coffee, or chocolate",
    image: Nduma
  },
  { 
    id: 11, 
    name: "Pancake, Egg, Sausage with African Tea/Coffee/Chocolate", 
    price: 300, 
    category: "Breakfast",
    description: "Pancake, egg, and sausage served with African tea, coffee, or chocolate",
    image: pancake
  },
  { 
    id: 12, 
    name: "1/4 kg Pork with Ugali/Rice/Kienyeji Vegetable", 
    price: 450, 
    category: "Lunch",
    description: "1/4 kg pork served with ugali, rice, or kienyeji vegetables",
    image: pork
  },
  { 
    id: 13, 
    name: "1/2 kg Pork with Ugali/Rice/Kienyeji Vegetable", 
    price: 600, 
    category: "Lunch",
    description: "1/2 kg pork served with ugali, rice, or kienyeji vegetables",
    image: pork
  },
  { 
    id: 14, 
    name: "3/4 kg Pork with Ugali/Rice/Kienyeji Vegetable", 
    price: 750, 
    category: "Lunch",
    description: "3/4 kg pork served with ugali, rice, or kienyeji vegetables",
    image: pork
  },
  { 
    id: 15, 
    name: "1 kg Pork with Ugali/Rice/Kienyeji Vegetable", 
    price: 900, 
    category: "Lunch",
    description: "1 kg pork served with ugali, rice, or kienyeji vegetables",
    image: ricepork
  },
  { 
    id: 16, 
    name: "1/4 kg Beef with Ugali/Rice/Kienyeji Vegetable", 
    price: 350, 
    category: "Lunch",
    description: "1/4 kg beef served with ugali, rice, or kienyeji vegetables",
    image: beefugali
  },
  { 
    id: 17, 
    name: "1/2 kg Beef with Ugali/Rice/Kienyeji Vegetable", 
    price: 600, 
    category: "Lunch",
    description: "1/2 kg beef served with ugali, rice, or kienyeji vegetables",
    image: ricee
  },
  { 
    id: 18, 
    name: "3/4 kg Beef with Ugali/Rice/Kienyeji Vegetable", 
    price: 850, 
    category: "Lunch",
    description: "3/4 kg beef served with ugali, rice, or kienyeji vegetables",
    image: ricee
  },
  { 
    id: 19, 
    name: "1 kg Beef with Ugali/Rice/Kienyeji Vegetable", 
    price: 1100, 
    category: "Lunch",
    description: "1 kg beef served with ugali, rice, or kienyeji vegetables",
    image:ricee
  },
  { 
    id: 20, 
    name: "1/4 kg Chicken with Ugali/Rice/Kienyeji Vegetable", 
    price: 450, 
    category: "Lunch",
    description: "1/4 kg chicken served with ugali, rice, or kienyeji vegetables",
    image: ciken
  },
  { 
    id: 21, 
    name: "1/2 kg Chicken with Ugali/Rice/Kienyeji Vegetable", 
    price: 900, 
    category: "Lunch",
    description: "1/2 kg chicken served with ugali, rice, or kienyeji vegetables",
    image: chicken
  },
  { 
    id: 22, 
    name: "1 kg Chicken with Ugali/Rice/Kienyeji Vegetable", 
    price: 1700, 
    category: "Lunch",
    description: "1 kg chicken served with ugali, rice, or kienyeji vegetables",
    image: chicken
  },
  { 
    id: 23, 
    name: "1/4 kg Pork Choma", 
    price: 300, 
    category: "Lunch",
    description: "1/4 kg grilled pork",
    image: porkcom
  },
  { 
    id: 24, 
    name: "1/2 kg Pork Choma", 
    price: 600, 
    category: "Lunch",
    description: "1/2 kg grilled pork",
    image: porkcom2
  },
  { 
    id: 25, 
    name: "3/4 kg Pork Choma", 
    price: 900, 
    category: "Lunch",
    description: "3/4 kg grilled pork",
    image: pork3
  },
  { 
    id: 26, 
    name: "1 kg Pork Choma", 
    price: 1200, 
    category: "Lunch",
    description: "1 kg grilled pork",
    image: pork3
  },
  { 
    id: 27, 
    name: "Pork with Ugali and Greens", 
    price: 250, 
    category: "Special Lunch",
    description: "Pork served with ugali and greens",
    image: porkugli
  },
  { 
    id: 28, 
    name: "Beef with Ugali and Greens", 
    price: 250, 
    category: "Special Lunch",
    description: "Beef served with ugali and greens",
    image: beegreen
  },
  { 
    id: 29, 
    name: "Chapati & Minji", 
    price: 200, 
    category: "Special Lunch",
    description: "Chapati served with minji",
    image: chminji
  },
  { 
    id: 30, 
    name: "Rice & Minji", 
    price: 200, 
    category: "Special Lunch",
    description: "Rice served with minji",
    image: riceminji
  },
  { 
    id: 31, 
    name: "Rice & Njahi", 
    price: 150, 
    category: "Special Lunch",
    description: "Rice served with njahi",
    image: ricejhi
  },
  { 
    id: 32, 
    name: "Chapati & Beans", 
    price: 100, 
    category: "Special Lunch",
    description: "Chapati served with beans",
    image: beenchpo
  },
  { 
    id: 33, 
    name: "Chapati & Kamande", 
    price: 150, 
    category: "Special Lunch",
    description: "Chapati served with kamande",
    image: kkkk
  },
  { 
    id: 34, 
    name: "Githeri", 
    price: 150, 
    category: "Special Lunch",
    description: "Traditional githeri",
    image: githeri
  },
  { 
    id: 35, 
    name: "Mokimo & Cabbage",
    price: 150, 
    category: "Special Lunch",
    description: "Mokimo served with cabbage",
    image: mukimo
  },
  { 
    id: 36, 
    name: "Yoghurt", 
    price: 100, 
    category: "Soft Drinks",
    description: "Fresh yoghurt",
    image: Yoghurt

  },
  { 
    id: 37, 
    name: "Mala", 
    price: 50, 
    category: "Soft Drinks",
    description: "Traditional fermented milk",
    image: ma
  },
  { 
    id: 38, 
    name: "Soda", 
    price: 100, 
    category: "Soft Drinks",
    description: "Assorted sodas",
    image: Soda
  },
  { 
    id: 39, 
    name: "Energy Drink", 
    price: 150, 
    category: "Soft Drinks",
    description: "Energy boosting drink",
    image: energy
  },
  { 
    id: 40, 
    name: "Minute Maid", 
    price: 150, 
    category: "Soft Drinks",
    description: "Fresh juice",
    image: Minute
  },
  { 
    id: 41, 
    name: "Water", 
    price: 50, 
    category: "Soft Drinks",
    description: "Purified water",
    image: wter
  },
];

const Menu = () => {
  const [filter, setFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { cartItems, addToCart, clearCart } = useCart(); // Use the cart context
  const navigate = useNavigate();

  // Get unique categories from menu items
  const categories = ["All", ...new Set(sampleMenu.map(item => item.category))];
  
  // Filter menu items by category and search term
  const filteredMenu = sampleMenu.filter((item) => {
    const matchesCategory = filter ? item.category === filter : true;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle add to cart
  const handleAddToCart = (item) => {
    addToCart(item);
    message.success(`${item.name} added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Our Menu</h1>
        
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          {/* Search bar */}
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          
          {/* Category filter */}
          <select 
            onChange={(e) => setFilter(e.target.value === "All" ? "" : e.target.value)} 
            value={filter || "All"}
            className="px-4 py-2 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Menu items grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenu.length > 0 ? (
          filteredMenu.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div 
                className="h-48 bg-cover bg-center" 
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <span className="text-lg font-bold text-orange-600">KSh {item.price}</span>
                </div>
                <p className="text-gray-600 text-sm mt-2">{item.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                    {item.category}
                  </span>
                  <button 
                    onClick={() => handleAddToCart(item)} 
                    className="flex items-center space-x-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full transition-colors duration-300"
                  >
                    <ShoppingCartOutlined fontSize="small" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 text-lg">No menu items found. Try a different search or category.</p>
          </div>
        )}
      </div>
      
      {/* Cart summary - this would likely be a component in a real app */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-orange-200 z-40">
          <div className="flex items-center justify-between border-b pb-2 mb-2">
            <h3 className="font-semibold">Your Cart ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</h3>
            <button 
              onClick={() => clearCart()} 
              className="text-xs text-gray-500 hover:text-red-500"
            >
              Clear
            </button>
          </div>
          <div className="max-h-40 overflow-auto">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center py-1">
                <span>{item.quantity} × {item.name}</span>
                <span>KSh {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-2 pt-2 flex justify-between font-bold">
            <span>Total:</span>
            <span>KSh {cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
          </div>
          <button  onClick={() => navigate("/checkout")} 
            className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md">
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Menu;