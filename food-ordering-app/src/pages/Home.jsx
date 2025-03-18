import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, LinkedIn, Room, Phone, Email } from "@mui/icons-material";

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative h-96 md:h-screen max-h-screen overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/70 to-red-900/70 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')",
            backgroundPosition: "center 55%"
          }}
        ></div>
        
        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-white p-6">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">Coffee Bar & Kitchen</h1>
          <p className="text-xl md:text-2xl max-w-lg text-center mb-8">
            Handcrafted coffee and delicious meals made with love and quality ingredients
          </p>
          <Link 
            to="/menu" 
            className="mt-4 px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-full text-lg transition-colors duration-300"
          >
            Explore Our Menu
          </Link>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="py-16 px-4 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Our Offerings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Food Category */}
          <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="h-64 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" }}></div>
            <div className="p-6 bg-orange-50">
              <h3 className="text-2xl font-semibold mb-2">Food</h3>
              <p className="text-gray-700 mb-4">Delicious meals made with fresh ingredients to satisfy your hunger.</p>
              <Link to="/menu/food" className="text-orange-600 hover:text-orange-800 font-medium flex items-center">
                View Food Menu
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Drinks Category */}
          <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="h-64 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" }}></div>
            <div className="p-6 bg-orange-50">
              <h3 className="text-2xl font-semibold mb-2">Drinks</h3>
              <p className="text-gray-700 mb-4">Refreshing beverages from specialty coffees to fresh juices.</p>
              <Link to="/menu/drinks" className="text-orange-600 hover:text-orange-800 font-medium flex items-center">
                View Drinks Menu
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
          
          {/* Specials Category */}
          <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="h-64 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1559715745-e1b33a271c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" }}></div>
            <div className="p-6 bg-orange-50">
              <h3 className="text-2xl font-semibold mb-2">Specials</h3>
              <p className="text-gray-700 mb-4">Discover our chef's specials and seasonal offerings.</p>
              <Link to="/menu/specials" className="text-orange-600 hover:text-orange-800 font-medium flex items-center">
                View Specials
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-orange-100 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-lg mb-8">Experience the best flavors delivered straight to your door.</p>
          <Link 
            to="/menu" 
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full text-lg transition-colors duration-300"
          >
            Order Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        {/* Map Section */}
        <div className="w-full h-64 md:h-80">
          <div className="relative w-full h-full">
            {/* We're using an iframe to embed a map - replace with your actual map embed code */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369668400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23e28c1191%3A0x49f75d3281df052a!2s150%20Park%20Row%2C%20New%20York%2C%20NY%2010007!5e0!3m2!1sen!2sus!4v1647698458595!5m2!1sen!2sus"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              title="Coffee Bar Location"
              className="absolute inset-0"
            ></iframe>
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 p-3 rounded-lg">
              <div className="flex items-center text-yellow-400">
                <Room className="mr-2" />
                <span className="font-semibold">Visit Us</span>
              </div>
              <p className="mt-1">150 Park Row, New York, NY 10007</p>
            </div>
          </div>
        </div>

        {/* Footer Content */}
        <div className="container mx-auto px-6 pt-10 pb-6">
          <div className="flex flex-wrap">
            {/* About */}
            <div className="w-full md:w-1/4 text-center md:text-left mb-8 md:mb-0">
              <h5 className="uppercase mb-6 font-bold text-yellow-400">About Us</h5>
              <p className="mb-4 text-gray-300">
                Coffee Bar & Kitchen serves the finest handcrafted coffee and delicious meals made with love and quality ingredients since 2010.
              </p>
            </div>
            
            {/* Quick Links */}
            <div className="w-full md:w-1/4 text-center md:text-left mb-8 md:mb-0">
              <h5 className="uppercase mb-6 font-bold text-yellow-400">Quick Links</h5>
              <ul className="mb-4">
                <li className="mt-2">
                  <Link to="/menu" className="hover:underline text-gray-300 hover:text-white">Menu</Link>
                </li>
                <li className="mt-2">
                  <Link to="/about" className="hover:underline text-gray-300 hover:text-white">About Us</Link>
                </li>
                <li className="mt-2">
                  <Link to="/contact" className="hover:underline text-gray-300 hover:text-white">Contact</Link>
                </li>
                <li className="mt-2">
                  <Link to="/track-order" className="hover:underline text-gray-300 hover:text-white">Track Order</Link>
                </li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div className="w-full md:w-1/4 text-center md:text-left mb-8 md:mb-0">
              <h5 className="uppercase mb-6 font-bold text-yellow-400">Contact Us</h5>
              <ul className="mb-4">
                <li className="mt-2 flex items-center justify-center md:justify-start">
                  <Phone className="mr-2 text-sm" />
                  <span className="text-gray-300">(212) 555-1234</span>
                </li>
                <li className="mt-2 flex items-center justify-center md:justify-start">
                  <Email className="mr-2 text-sm" />
                  <span className="text-gray-300">info@coffeebar.com</span>
                </li>
                <li className="mt-2 flex items-center justify-center md:justify-start">
                  <Room className="mr-2 text-sm" />
                  <span className="text-gray-300">150 Park Row, New York</span>
                </li>
              </ul>
            </div>
            
            {/* Hours */}
            <div className="w-full md:w-1/4 text-center md:text-left">
              <h5 className="uppercase mb-6 font-bold text-yellow-400">Hours</h5>
              <ul className="mb-4">
                <li className="mt-2">
                  <span className="text-gray-300">Mon - Fri: 7:00AM - 9:00PM</span>
                </li>
                <li className="mt-2">
                  <span className="text-gray-300">Saturday: 8:00AM - 10:00PM</span>
                </li>
                <li className="mt-2">
                  <span className="text-gray-300">Sunday: 8:00AM - 8:00PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-400">© 2025 Coffee Bar & Kitchen. All Rights Reserved.</p>
            </div>
            <div className="flex">
              <a href="https://facebook.com" className="mx-2 hover:text-yellow-400">
                <Facebook />
              </a>
              <a href="https://instagram.com" className="mx-2 hover:text-yellow-400">
                <Instagram />
              </a>
              <a href="https://twitter.com" className="mx-2 hover:text-yellow-400">
                <Twitter />
              </a>
              <a href="https://linkedin.com" className="mx-2 hover:text-yellow-400">
                <LinkedIn />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;