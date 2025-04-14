
import { Link } from 'react-router-dom';
import { useShop } from '@/context/ShopContext';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Heart, ShoppingCart, Trash, Star } from 'lucide-react';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useShop();
  
  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
    toast({
      title: "Removed from wishlist",
      description: "The item has been removed from your wishlist.",
    });
  };
  
  const handleAddToCart = (productId: string) => {
    const product = wishlist.find(p => p.id === productId);
    if (product) {
      addToCart(product, 1);
      removeFromWishlist(productId);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };
  
  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <Heart className="h-16 w-16 mx-auto text-gray-300 mb-6" />
          <h1 className="text-3xl font-['Helvetica-times-now'] font-medium mb-4">Your Wishlist is Empty</h1>
          <p className="text-gray-600 mb-8">
            You haven't saved any items to your wishlist yet.
            Browse our collection and find something you love!
          </p>
          <Link to="/shop">
            <Button className="bg-brand-yellow hover:bg-yellow-500 text-white px-8">
              Explore Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-['Helvetica-times-now'] font-medium">Your Wishlist</h1>
        <span className="text-gray-500">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm group">
            <div className="relative">
              <Link to={`/shop/${product.id}`}>
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </Link>
              
              <button 
                className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full text-red-500 hover:bg-white transition-colors"
                onClick={() => handleRemoveFromWishlist(product.id)}
                title="Remove from wishlist"
              >
                <Trash className="h-4 w-4" />
              </button>
              
              {product.tag && (
                <div className="absolute top-3 left-3 bg-brand-yellow text-white text-xs px-2 py-1 rounded">
                  {product.tag}
                </div>
              )}
              
              {product.rating && (
                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{product.rating}</span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <Link to={`/shop/${product.id}`}>
                <h3 className="font-medium mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-1">{product.description}</p>
              </Link>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">₹{product.discountedPrice || product.price}</span>
                  {product.discount && (
                    <>
                      <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
                      <span className="text-xs text-green-600">{product.discount}% OFF</span>
                    </>
                  )}
                </div>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="rounded-full px-3"
                  onClick={() => handleAddToCart(product.id)}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  <span className="text-xs">Add</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
