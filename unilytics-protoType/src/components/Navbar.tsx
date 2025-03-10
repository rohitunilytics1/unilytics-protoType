// src/components/layout/Navbar.tsx
import { Search, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import MobileSidebar from "./MobileSidebar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <header className="border-b border-gray-200 bg-black text-white flex items-center justify-between px-4 h-16">
      <div className="flex items-center">
        <div className="mr-2 md:hidden">
          <MobileSidebar />
        </div>
        
        <Link to="/">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center mr-2">
              <span className="text-white font-bold">U</span>
            </div>
            <span className="font-bold text-lg">Unilytics</span>
          </div>
        </Link>
        
        <div className="relative ml-6 hidden sm:block">
          <div className="flex items-center border rounded-md bg-white px-3 py-1 text-black">
            <Search className="h-4 w-4 text-black mr-2" />
            <Input
              className="border-0 bg-transparent text-sm w-28 md:w-40 lg:w-60 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              placeholder="Search"
            />
            <div className="text-xs text-gray-400 hidden md:flex items-center gap-1 ml-2">
              <span>Ctrl</span>
              <span>+</span>
              <span>K</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <Link to="/notifications">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
          </Button>
        </Link>
        <Link to="/account-plans">
          <Button variant="outline" className="hidden md:block text-white border-gray-700 text-xs md:text-sm">
            Account Plans
          </Button>
        </Link>
        <Link to="/support">
          <Button variant="outline" className="text-white border-gray-700 text-xs md:text-sm">
            Support
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;