
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '@/context/ShopContext';
import { mockProducts } from '@/data/mockProducts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { 
  Filter, 
  Heart, 
  ShoppingCart, 
  Star, 
  SlidersHorizontal, 
  X, 
  ChevronDown,
  Search
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Shop = () => {
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  const { addToCart, addToWishlist, isInWishlist } = useShop();
  
  // Extract unique categories and subcategories
  const categories = Array.from(new Set(products.map(p => p.category)));
  const subCategories = Array.from(new Set(products.map(p => p.subCategory).filter(Boolean)));
  
  // Filter products based on selected filters and search query
  useEffect(() => {
    let filtered = [...products];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Apply subcategory filter
    if (selectedSubCategory) {
      filtered = filtered.filter(product => product.subCategory === selectedSubCategory);
    }
    
    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, selectedSubCategory]);
  
  // Handle product actions
  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart(product, 1);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };
  
  const handleToggleWishlist = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToWishlist(product);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSearchQuery('');
  };
  
  // Format category name for display
  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-medium mb-2">Shop Collection</h1>
          <p className="text-gray-600">Discover our range of premium t-shirts for every style</p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          {/* Mobile filters button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    <button
                      className={`block w-full text-left px-2 py-1 rounded ${
                        !selectedCategory ? 'bg-brand-yellow/10 text-brand-yellow' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedCategory(null)}
                    >
                      All Categories
                    </button>
                    {categories.map(category => (
                      <button
                        key={category}
                        className={`block w-full text-left px-2 py-1 rounded ${
                          selectedCategory === category ? 'bg-brand-yellow/10 text-brand-yellow' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {formatCategoryName(category)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Sub-Categories</h3>
                  <div className="space-y-2">
                    <button
                      className={`block w-full text-left px-2 py-1 rounded ${
                        !selectedSubCategory ? 'bg-brand-yellow/10 text-brand-yellow' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedSubCategory(null)}
                    >
                      All Types
                    </button>
                    {subCategories.map(subCategory => (
                      <button
                        key={subCategory}
                        className={`block w-full text-left px-2 py-1 rounded ${
                          selectedSubCategory === subCategory ? 'bg-brand-yellow/10 text-brand-yellow' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedSubCategory(subCategory)}
                      >
                        {formatCategoryName(subCategory || '')}
                      </button>
                    ))}
                  </div>
                </div>
                
                <SheetClose asChild>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={resetFilters}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-auto"
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop filters sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-medium">Filters</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={resetFilters}
                className="h-8 text-sm text-gray-500 hover:text-brand-yellow"
              >
                Clear all
              </Button>
            </div>
            
            <Accordion type="single" collapsible defaultValue="categories">
              <AccordionItem value="categories" className="border-none">
                <AccordionTrigger className="py-2 hover:no-underline">
                  Categories
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    <button
                      className={`block w-full text-left px-2 py-1 text-sm rounded ${
                        !selectedCategory ? 'bg-brand-yellow/10 text-brand-yellow' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedCategory(null)}
                    >
                      All Categories
                    </button>
                    {categories.map(category => (
                      <button
                        key={category}
                        className={`block w-full text-left px-2 py-1 text-sm rounded ${
                          selectedCategory === category ? 'bg-brand-yellow/10 text-brand-yellow' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {formatCategoryName(category)}
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="subcategories" className="border-none">
                <AccordionTrigger className="py-2 hover:no-underline">
                  Types
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    <button
                      className={`block w-full text-left px-2 py-1 text-sm rounded ${
                        !selectedSubCategory ? 'bg-brand-yellow/10 text-brand-yellow' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedSubCategory(null)}
                    >
                      All Types
                    </button>
                    {subCategories.map(subCategory => (
                      <button
                        key={subCategory}
                        className={`block w-full text-left px-2 py-1 text-sm rounded ${
                          selectedSubCategory === subCategory ? 'bg-brand-yellow/10 text-brand-yellow' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedSubCategory(subCategory)}
                      >
                        {formatCategoryName(subCategory || '')}
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        
        {/* Products grid */}
        <div className="flex-grow">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">Try changing your filters or search query</p>
              <Button variant="outline" onClick={resetFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-500">{filteredProducts.length} products</p>
                
                {/* Desktop sort dropdown would go here */}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm group">
                    <Link to={`/shop/${product.id}`}>
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
                        <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{product.rating}</span>
                        </div>
                      </div>
                    </Link>
                    
                    <div className="p-4">
                      <Link to={`/shop/${product.id}`}>
                        <h3 className="font-medium mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-500 mb-2 line-clamp-1">{product.description}</p>
                      </Link>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">₹{product.discountedPrice}</span>
                            <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
                            <span className="text-xs text-green-600">{product.discount}% OFF</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleToggleWishlist(product.id)}
                          >
                            <Heart 
                              className="h-4 w-4" 
                              fill={isInWishlist(product.id) ? "currentColor" : "none"} 
                            />
                          </Button>
                          
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 rounded-full"
                            onClick={() => handleAddToCart(product.id)}
                          >
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
