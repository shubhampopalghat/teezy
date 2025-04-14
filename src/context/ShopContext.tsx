
import { createContext, useState, useContext, ReactNode } from 'react';
import { Product, CartItem, WishlistItem, CustomDesign } from '@/types/product';

interface ShopContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  customDesigns: CustomDesign[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  saveCustomDesign: (design: CustomDesign) => void;
  getCartTotal: () => number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [customDesigns, setCustomDesigns] = useState<CustomDesign[]>([]);

  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    setCart(prevCart => {
      // Check if item is already in cart
      const existingItem = prevCart.find(item => 
        item.id === product.id && 
        item.size === size && 
        item.color === color
      );

      if (existingItem) {
        // Update quantity if item exists
        return prevCart.map(item => 
          item.id === product.id && item.size === size && item.color === color 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        return [...prevCart, { 
          ...product, 
          quantity,
          size,
          color
        }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId 
          ? { ...item, quantity: Math.max(1, quantity) } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.id)) {
      setWishlist(prev => [...prev, product]);
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  const saveCustomDesign = (design: CustomDesign) => {
    setCustomDesigns(prev => [...prev, design]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.discountedPrice || item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  return (
    <ShopContext.Provider value={{
      cart,
      wishlist,
      customDesigns,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      clearCart,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      saveCustomDesign,
      getCartTotal,
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
