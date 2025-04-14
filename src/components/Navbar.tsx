
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would be connected to auth state

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-10">
            <Link to="/" className="text-2xl font-display font-semibold">
              Teezy
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium hover:text-brand-yellow transition-colors">
                Home
              </Link>
              <Link to="/shop" className="text-sm font-medium hover:text-brand-yellow transition-colors">
                Shop
              </Link>
              <Link to="/custom" className="text-sm font-medium text-brand-yellow hover:opacity-80 transition-colors">
                Get Custom Designs
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2">
              <Search size={16} className="text-slate-400 mr-2" />
              <Input 
                placeholder="Search products..." 
                className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm w-48"
              />
            </div>
            
            <div className="flex items-center gap-3">
              {!isLoggedIn ? (
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hidden md:flex gap-2 hover:text-brand-yellow">
                    <User size={16} />
                    <span>Login</span>
                  </Button>
                </Link>
              ) : (
                <Link to="/account">
                  <Button variant="ghost" size="sm" className="hidden md:flex gap-2 hover:text-brand-yellow">
                    <User size={16} />
                    <span>Account</span>
                  </Button>
                </Link>
              )}
              
              <Link to="/wishlist" className="p-2 hover:text-brand-yellow transition-colors">
                <Heart size={18} />
              </Link>
              
              <Link to="/cart" className="p-2 hover:text-brand-yellow transition-colors">
                <ShoppingCart size={18} />
              </Link>
              
              <button 
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-white shadow-lg z-20">
          <nav className="flex flex-col py-4 px-6 space-y-4">
            <Link to="/" className="py-2" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/shop" className="py-2" onClick={() => setIsMenuOpen(false)}>
              Shop
            </Link>
            <Link to="/custom" className="py-2 text-brand-yellow" onClick={() => setIsMenuOpen(false)}>
              Get Custom Designs
            </Link>
            <div className="flex items-center bg-slate-100 rounded-full px-4 py-2 mt-2">
              <Search size={16} className="text-slate-400 mr-2" />
              <Input 
                placeholder="Search products..." 
                className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              />
            </div>
            {!isLoggedIn && (
              <Link to="/login" className="py-2" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
