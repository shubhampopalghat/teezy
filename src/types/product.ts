
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
  category: string;
  subCategory?: string;
  tag?: string;
  inStock: boolean;
  rating?: number;
  sizes?: string[];
  colors?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  size?: string;
  color?: string;
}

export interface WishlistItem extends Product {}

export interface CustomDesign {
  tshirtColor: string;
  text?: string;
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  logoUrl?: string;
  logoPosition?: { x: number; y: number };
  logoScale?: number;
  size?: string;
}
