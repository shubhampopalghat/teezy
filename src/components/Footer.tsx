
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8">
      {/* Scrolling banner */}
      <div className="overflow-hidden py-6 mb-10 border-y border-white/10">
        <div className="flex animate-carousel whitespace-nowrap">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="mx-4 text-4xl font-display text-brand-yellow inline-block">
              Quality Custom Prints
              <span className="mx-4">•</span>
              Sustainable Materials
              <span className="mx-4">•</span>
              Express Delivery
              <span className="mx-4">•</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand info */}
          <div>
            <h2 className="text-3xl font-display font-medium mb-6">Teezy</h2>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-2">
                <span>📞</span>
                <span>+1 (234) 567-8901</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>401 Broadway, 24th Floor, New York, NY 10013</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-brand-yellow transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-yellow transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-yellow transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-yellow transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Essential Links */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-brand-yellow">Essential</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/about" className="hover:text-brand-yellow transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-brand-yellow transition-colors">Careers</Link></li>
              <li><Link to="/pricing" className="hover:text-brand-yellow transition-colors">Pricing</Link></li>
              <li><Link to="/services" className="hover:text-brand-yellow transition-colors">Services</Link></li>
              <li><Link to="/contact" className="hover:text-brand-yellow transition-colors">Get In Touch</Link></li>
            </ul>
          </div>

          {/* More Pages */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-brand-yellow">More Pages</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/production" className="hover:text-brand-yellow transition-colors">Production</Link></li>
              <li><Link to="/investors" className="hover:text-brand-yellow transition-colors">Investors</Link></li>
              <li><Link to="/news" className="hover:text-brand-yellow transition-colors">News</Link></li>
              <li><Link to="/faq" className="hover:text-brand-yellow transition-colors">FAQ's</Link></li>
              <li><Link to="/contact" className="hover:text-brand-yellow transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Latest Posts */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-brand-yellow">Latest Posts</h3>
            <div className="space-y-6">
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80" 
                    alt="Blog post" 
                    className="w-full h-full object-cover" />
                </div>
                <div>
                  <Link to="/blog/1" className="text-gray-400 hover:text-brand-yellow transition-colors text-sm">
                    Sustainable Fashion: The Future of Apparel
                  </Link>
                  <p className="text-gray-500 text-xs mt-1">April 7, 2023</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1594032194509-0056023973b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80" 
                    alt="Blog post" 
                    className="w-full h-full object-cover" />
                </div>
                <div>
                  <Link to="/blog/2" className="text-gray-400 hover:text-brand-yellow transition-colors text-sm">
                    Custom Prints: Express Your Unique Style
                  </Link>
                  <p className="text-gray-500 text-xs mt-1">March 15, 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />
        
        <div className="text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Teezy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
