
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '@/context/ShopContext';
import { mockProducts } from '@/data/mockProducts';
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { toast } from "@/components/ui/use-toast";
import { 
  Heart, 
  ShoppingCart, 
  ChevronRight,
  Star,
  Check,
  ArrowLeft,
  Share2
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState(mockProducts[0]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart, addToWishlist, isInWishlist } = useShop();
  
  // Fetch product data
  useEffect(() => {
    if (id) {
      const foundProduct = mockProducts.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedImage(foundProduct.image);
        // Set default selections if available
        if (foundProduct.sizes && foundProduct.sizes.length > 0) {
          setSelectedSize(foundProduct.sizes[0]);
        }
        if (foundProduct.colors && foundProduct.colors.length > 0) {
          setSelectedColor(foundProduct.colors[0]);
        }
      }
    }
    setLoading(false);
  }, [id]);
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedColor && product.colors && product.colors.length > 0) {
      toast({
        title: "Please select a color",
        variant: "destructive",
      });
      return;
    }
    
    addToCart(product, quantity, selectedSize, selectedColor);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  // Handle toggle wishlist
  const handleToggleWishlist = () => {
    addToWishlist(product);
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
    });
  };
  
  // Handle quantity change
  const increaseQuantity = () => setQuantity(q => q + 1);
  const decreaseQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));
  
  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
  }
  
  // Create images array with main image and any additional images
  const productImages = [product.image, ...(product.images || [])].filter(Boolean);
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-brand-yellow">Home</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link to="/shop" className="hover:text-brand-yellow">Shop</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-900">{product.name}</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product images */}
        <div>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-4">
            <img 
              src={selectedImage} 
              alt={product.name} 
              className="w-full h-auto aspect-square object-cover"
            />
          </div>
          
          {productImages.length > 1 && (
            <Carousel className="w-full">
              <CarouselContent>
                {productImages.map((image, index) => (
                  <CarouselItem key={index} className="basis-1/4">
                    <div 
                      className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                        selectedImage === image ? 'border-brand-yellow' : 'border-transparent'
                      }`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} - view ${index + 1}`} 
                        className="w-full h-24 object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}
        </div>
        
        {/* Product info */}
        <div>
          {/* Product name and rating */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{product.rating}</span>
              </div>
              {product.tag && (
                <div className="bg-brand-yellow text-white text-xs px-2 py-1 rounded">
                  {product.tag}
                </div>
              )}
            </div>
            
            <h1 className="text-3xl font-['Helvetica-times-now'] font-medium mb-3">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
          </div>
          
          {/* Price */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-medium">₹{product.discountedPrice}</span>
              <span className="text-gray-500 line-through">₹{product.price}</span>
              <span className="text-green-600 text-sm">{product.discount}% OFF</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
          </div>
          
          {/* Size selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-3">Select Size</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      selectedSize === size 
                        ? 'border-brand-yellow bg-brand-yellow/10 text-brand-yellow' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Color selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-8">
              <h3 className="font-medium mb-3">Select Color</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map(color => (
                  <button
                    key={color}
                    className={`w-12 h-12 rounded-full border-2 relative ${
                      selectedColor === color 
                        ? 'border-brand-yellow ring-2 ring-brand-yellow ring-offset-2' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select ${color} color`}
                  >
                    {selectedColor === color && (
                      <Check className="h-6 w-6 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity selector */}
          <div className="mb-8">
            <h3 className="font-medium mb-3">Quantity</h3>
            <div className="flex items-center w-32 border rounded-full overflow-hidden">
              <button 
                className="px-3 py-2 hover:bg-gray-100 transition-colors"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="w-10 text-center">{quantity}</span>
              <button 
                className="px-3 py-2 hover:bg-gray-100 transition-colors"
                onClick={increaseQuantity}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to cart buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button 
              className="flex-1 bg-brand-yellow hover:bg-yellow-500 text-white h-12"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1 border-gray-200 hover:bg-gray-50 h-12"
              onClick={handleToggleWishlist}
            >
              <Heart 
                className="mr-2 h-5 w-5" 
                fill={isInWishlist(product.id) ? "currentColor" : "none"} 
              />
              Wishlist
            </Button>
          </div>
          
          {/* Product details */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Category</span>
                <span className="capitalize">{product.category}</span>
              </div>
              
              {product.subCategory && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Type</span>
                  <span className="capitalize">{product.subCategory}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Availability</span>
                <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Share buttons */}
          <div className="mt-8 flex items-center gap-4">
            <span className="text-gray-600">Share:</span>
            <div className="flex gap-3">
              <button className="text-gray-500 hover:text-brand-yellow transition-colors">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Back to shop */}
      <div className="mt-12">
        <Link to="/shop" className="inline-flex items-center text-brand-yellow hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shop
        </Link>
      </div>
    </div>
  );
};

export default ProductDetail;
