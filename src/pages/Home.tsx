
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Heart, ShoppingCart, Star } from 'lucide-react';
import { mockProducts } from '@/data/mockProducts';
import { useShop } from '@/context/ShopContext';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { addToCart, addToWishlist, isInWishlist } = useShop();
  
  // Featured products - just use first 5 from mock data
  const featuredProducts = mockProducts.slice(0, 5);
  
  // Latest arrivals - use different products
  const latestArrivals = mockProducts.slice(5, 10);
  
  // Carousel autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === latestArrivals.length - 1 ? 0 : prev + 1));
      updateCarouselPosition();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [latestArrivals.length]);
  
  const updateCarouselPosition = () => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth;
      carouselRef.current.style.transform = `translateX(-${activeSlide * slideWidth}px)`;
    }
  };
  
  useEffect(() => {
    updateCarouselPosition();
    // Update on window resize
    window.addEventListener('resize', updateCarouselPosition);
    return () => window.removeEventListener('resize', updateCarouselPosition);
  }, [activeSlide]);
  
  // Handle product actions
  const handleAddToCart = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      addToCart(product, 1);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };
  
  const handleToggleWishlist = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      addToWishlist(product);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };
  
  return (
    <main>
      {/* Hero section */}
      <section className="relative bg-gradient-to-r from-slate-50 to-slate-100 overflow-hidden ">
        <div className="container mx-auto px-4 py-5 md:py-12">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
              <h1 className="text-5xl md:text-6xl font-['Helvetica-times-now'] font-medium leading-tight mb-6">
                Custom Printed <br />
                <span className="text-brand-yellow">T-Shirts</span> Online
              </h1>
              <p className="text-slate-600 mb-8 max-w-md">
                Create your unique style with our premium custom print t-shirts.
                High-quality fabrics meet your creative designs for the perfect personalized apparel.
              </p>
              
              <div className="flex gap-6 mb-12">
                <div>
                  <div className="bg-white p-4 rounded-full shadow-md mb-4 inline-block">
                    <img src="/images/icons/tshirt.png" alt="T-shirt" className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Quality Materials</h3>
                  <p className="text-slate-500 text-sm">Premium cotton for maximum comfort and durability.</p>
                </div>
                
                <div>
                  <div className="bg-white p-4 rounded-full shadow-md mb-4 inline-block">
                    <img src="/images/icons/like.svg" alt="Satisfaction" className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">On-demand Service</h3>
                  <p className="text-slate-500 text-sm">Quick turnaround times with attention to detail.</p>
                </div>
              </div>
              
              <Link to="/custom">
                <Button className="bg-brand-yellow hover:bg-yellow-500 text-white rounded-full px-8 py-6">
                  Design Your Shirt
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white animate-float">
                <img 
                  src="https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                  alt="Custom T-shirt" 
                  className="w-full h-auto" 
                />
              </div>
              
              {/* Decoration elements */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-brand-yellow rounded-full opacity-20"></div>
              <div className="absolute -bottom-5 -left-5 w-16 h-16 bg-blue-400 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Latest arrivals carousel */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-['Helvetica-times-now'] font-medium">Latest Arrivals</h2>
            <Link to="/shop" className="text-brand-yellow hover:underline flex items-center">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="relative overflow-hidden">
            <div 
              ref={carouselRef}
              className="flex transition-transform duration-500 ease-out"
            >
              {latestArrivals.map((product) => (
                <div key={product.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      {product.tag && (
                        <div className="absolute top-4 left-4 bg-brand-yellow text-white text-xs px-3 py-1 rounded-full">
                          {product.tag}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="rounded-full"
                          onClick={() => handleAddToCart(product.id)}
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="rounded-full"
                          onClick={() => handleToggleWishlist(product.id)}
                        >
                          <Heart 
                            className="h-4 w-4" 
                            fill={isInWishlist(product.id) ? "currentColor" : "none"} 
                          />
                        </Button>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-500">{product.rating}</span>
                      </div>
                      <h3 className="font-medium mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">₹{product.discountedPrice}</span>
                        <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
                        <span className="text-xs text-green-600">{product.discount}% OFF</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Carousel dots */}
            <div className="flex justify-center mt-6 gap-2">
              {latestArrivals.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeSlide ? "bg-brand-yellow w-8" : "bg-gray-300"
                  }`}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured products grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-['Helvetica-times-now'] font-medium">Featured Products</h2>
            <Link to="/shop" className="text-brand-yellow hover:underline flex items-center">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-md group">
                <Link to={`/shop/${product.id}`} className="block">
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {product.tag && (
                      <div className="absolute top-4 left-4 bg-brand-yellow text-white text-xs px-2 py-1 rounded">
                        {product.tag}
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white px-2 py-1 rounded text-xs">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                </Link>
                
                <div className="p-4 flex justify-between">
                  <div>
                    <Link to={`/shop/${product.id}`} className="block">
                      <h3 className="font-medium text-sm">{product.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product.description}</p>
                    </Link>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-medium text-sm">₹{product.discountedPrice}</span>
                      <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
                      <span className="text-xs text-green-600">{product.discount}% OFF</span>
                    </div>
                  </div>
                  
                  <button 
                    className="text-gray-500 hover:text-brand-yellow transition-colors"
                    onClick={() => handleToggleWishlist(product.id)}
                  >
                    <Heart 
                      className="h-4 w-4" 
                      fill={isInWishlist(product.id) ? "currentColor" : "none"} 
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to action - custom designs */}
      <section className="py-16 bg-gradient-to-r from-brand-dark to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block px-4 py-1 border-2 border-brand-yellow rounded-full text-brand-yellow text-sm mb-4">
              Let's Talk
            </div>
            <h2 className="text-4xl md:text-5xl font-['Helvetica-times-now'] font-medium mb-6">
              Make Your Custom <span className="text-brand-yellow">Order</span>
            </h2>
            <p className="text-gray-300 mb-8">
              Ready to bring your vision to life? Our custom design service allows you to create unique t-shirts 
              tailored to your exact specifications. High-quality prints, premium materials, fast delivery.
            </p>
            
            <Link to="/custom">
              <Button className="bg-brand-yellow hover:bg-yellow-500 text-white px-8 py-6 rounded-full">
                Start Designing Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Contact form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-block px-4 py-1 border-2 border-brand-yellow rounded-full text-gray-600 text-sm mb-4">
                Contact Us
              </div>
              <h2 className="text-4xl font-['Helvetica-times-now'] font-medium">
                Need Help? <span className="text-brand-yellow">Get in Touch</span>
              </h2>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstname" className="text-sm text-gray-500">First Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      id="firstname" 
                      className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-transparent focus:border-brand-yellow focus:bg-white transition-colors outline-none"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="lastname" className="text-sm text-gray-500">Last Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      id="lastname" 
                      className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-transparent focus:border-brand-yellow focus:bg-white transition-colors outline-none"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm text-gray-500">Email</label>
                <div className="relative">
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-transparent focus:border-brand-yellow focus:bg-white transition-colors outline-none"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm text-gray-500">Message</label>
                <div className="relative">
                  <textarea 
                    id="message" 
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-transparent focus:border-brand-yellow focus:bg-white transition-colors outline-none resize-none"
                    placeholder="Write your message..."
                    required
                  ></textarea>
                </div>
              </div>
              
              <div className="text-center">
                <Button className="bg-brand-yellow hover:bg-yellow-500 text-white px-8 py-6 rounded-xl">
                  Submit Now
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
