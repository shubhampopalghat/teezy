
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '@/context/ShopContext';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Check } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateCartItemQuantity, clearCart, getCartTotal } = useShop();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateCartItemQuantity(productId, newQuantity);
  };
  
  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    });
  };
  
  const handleCheckout = () => {
    // Simulate checkout process
    setIsCheckingOut(true);
    setTimeout(() => {
      clearCart();
      setIsCheckingOut(false);
      toast({
        title: "Order placed",
        description: "Your order has been placed successfully!",
      });
    }, 2000);
  };
  
  // Calculate subtotal
  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 99 : 0;
  const total = subtotal + shipping;
  
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-6" />
          <h1 className="text-3xl font-display font-medium mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
            Browse our collection and find something you'll love!
          </p>
          <Link to="/shop">
            <Button className="bg-brand-yellow hover:bg-yellow-500 text-white px-8">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-medium">Your Cart</h1>
        <span className="text-gray-500">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {cart.map((item) => (
              <div 
                key={`${item.id}-${item.size}-${item.color}`} 
                className="flex flex-col sm:flex-row border-b border-gray-100 p-4 last:border-0"
              >
                <div className="w-full sm:w-24 h-24 bg-gray-50 rounded-lg overflow-hidden mb-4 sm:mb-0 sm:mr-4 flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="text-sm text-gray-500 space-y-1 mt-1">
                        {item.size && <p>Size: {item.size}</p>}
                        {item.color && <p>Color: {item.color}</p>}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 sm:mt-0">
                      <div className="flex items-center border rounded-full overflow-hidden bg-gray-50">
                        <button 
                          className="px-3 py-1 hover:bg-gray-100 transition-colors"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button 
                          className="px-3 py-1 hover:bg-gray-100 transition-colors"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      
                      <div className="ml-6 text-right">
                        <div className="font-medium">₹{item.discountedPrice || item.price}</div>
                        <button 
                          className="text-red-500 text-sm hover:underline mt-1 flex items-center"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <Link to="/shop" className="inline-flex items-center text-brand-yellow hover:underline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-medium mb-6">Order Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>₹{shipping}</span>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mt-4">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Including GST</p>
            </div>
          </div>
          
          <Button 
            className="w-full mt-6 bg-brand-yellow hover:bg-yellow-500 text-white h-12"
            onClick={handleCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? (
              <>
                <Check className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Checkout"
            )}
          </Button>
          
          <div className="mt-6 text-xs text-gray-500">
            <p className="mb-2">We accept:</p>
            <div className="flex gap-2">
              <div className="bg-gray-100 rounded p-1 inline-block">
                <span className="font-medium">Visa</span>
              </div>
              <div className="bg-gray-100 rounded p-1 inline-block">
                <span className="font-medium">Mastercard</span>
              </div>
              <div className="bg-gray-100 rounded p-1 inline-block">
                <span className="font-medium">PayPal</span>
              </div>
              <div className="bg-gray-100 rounded p-1 inline-block">
                <span className="font-medium">UPI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
