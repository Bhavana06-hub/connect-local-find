
import { Link } from "react-router-dom";
import { Wifi, MapPin, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Wifi className="h-6 w-6 text-blue-400" />
              <span className="font-bold text-xl">WifiLocator</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Find the best WiFi spots in Visakhapatnam. Whether you need a quiet place to work or a cozy cafe to relax, we help you stay connected.
            </p>
            <div className="flex items-center text-gray-400 text-sm">
              <MapPin className="h-4 w-4 mr-2" />
              Visakhapatnam, India
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/locations" className="text-gray-400 hover:text-white transition-colors">
                  Find Locations
                </Link>
              </li>
              <li>
                <Link to="/add-location" className="text-gray-400 hover:text-white transition-colors">
                  Add Location
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="mailto:support@wifilocator.com" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  support@wifilocator.com
                </a>
              </li>
              <li>
                <span className="text-gray-400">Help & FAQ</span>
              </li>
              <li>
                <span className="text-gray-400">Privacy Policy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} WifiLocator. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center mt-4 md:mt-0">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> for the community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
