
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { mockProducts } from '@/data/mockProducts';
import { Product } from '@/types/product';
import { PlusCircle, Package, Users, ShoppingBag, Edit, Trash2, Upload } from 'lucide-react';

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 999,
    discountedPrice: 799,
    discount: 20,
    image: '',
    category: 'men',
    subCategory: 'regular',
    tag: 'New',
    inStock: true,
    sizes: [],
    colors: [],
  });
  
  const [imagePreview, setImagePreview] = useState<string>('');
  
  useEffect(() => {
    // Check if user is admin
    if (!isAuthenticated || !user?.isAdmin) {
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);
  
  // Calculate discounted price when price or discount changes
  useEffect(() => {
    if (newProduct.price && newProduct.discount) {
      const discountAmount = (newProduct.price * (newProduct.discount / 100));
      const calculatedDiscountedPrice = newProduct.price - discountAmount;
      setNewProduct(prev => ({
        ...prev,
        discountedPrice: Math.round(calculatedDiscountedPrice)
      }));
    }
  }, [newProduct.price, newProduct.discount]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // For price and discount, convert to numbers
    if (name === 'price' || name === 'discount') {
      setNewProduct({
        ...newProduct,
        [name]: Number(value),
      });
    } else {
      setNewProduct({
        ...newProduct,
        [name]: value,
      });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: checked,
    });
  };
  
  const handleSizeToggle = (size: string) => {
    const sizes = newProduct.sizes || [];
    const updatedSizes = sizes.includes(size)
      ? sizes.filter(s => s !== size)
      : [...sizes, size];
    
    setNewProduct({
      ...newProduct,
      sizes: updatedSizes,
    });
  };
  
  const handleColorToggle = (color: string) => {
    const colors = newProduct.colors || [];
    const updatedColors = colors.includes(color)
      ? colors.filter(c => c !== color)
      : [...colors, color];
    
    setNewProduct({
      ...newProduct,
      colors: updatedColors,
    });
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setImagePreview(imageUrl);
        setNewProduct({
          ...newProduct,
          image: imageUrl,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.image) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new product
    const product: Product = {
      id: `product-${Date.now()}`,
      name: newProduct.name || '',
      description: newProduct.description || '',
      price: Number(newProduct.price) || 0,
      discountedPrice: Number(newProduct.discountedPrice) || 0,
      discount: Number(newProduct.discount) || 0,
      image: newProduct.image || '',
      category: newProduct.category || 'men',
      subCategory: newProduct.subCategory,
      tag: newProduct.tag,
      inStock: newProduct.inStock || true,
      rating: 5.0,
      sizes: newProduct.sizes,
      colors: newProduct.colors,
    };
    
    // Add to products
    setProducts([...products, product]);
    
    // Reset form
    setNewProduct({
      name: '',
      description: '',
      price: 999,
      discountedPrice: 799,
      discount: 20,
      image: '',
      category: 'men',
      subCategory: 'regular',
      tag: 'New',
      inStock: true,
      sizes: [],
      colors: [],
    });
    setImagePreview('');
    
    toast({
      title: "Success",
      description: "Product has been added successfully.",
    });
  };
  
  const deleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({
      title: "Deleted",
      description: "Product has been deleted successfully.",
    });
  };
  
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow'];
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-display font-medium mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="products">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Products</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span>Orders</span>
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Customers</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Products tab */}
        <TabsContent value="products">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-medium mb-4">Product List</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Image</th>
                      <th className="text-left py-3 px-2">Name</th>
                      <th className="text-left py-3 px-2">Category</th>
                      <th className="text-left py-3 px-2">Price</th>
                      <th className="text-left py-3 px-2">Status</th>
                      <th className="text-right py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-2 max-w-[200px] truncate">{product.name}</td>
                        <td className="py-3 px-2 capitalize">{product.category}</td>
                        <td className="py-3 px-2">₹{product.discountedPrice}</td>
                        <td className="py-3 px-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right space-x-2">
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-red-500"
                            onClick={() => deleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-medium mb-4">Add New Product</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    rows={3}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Original Price *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount % *</Label>
                    <Input
                      id="discount"
                      name="discount"
                      type="number"
                      value={newProduct.discount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discountedPrice">Discounted Price (Calculated)</Label>
                  <Input
                    id="discountedPrice"
                    name="discountedPrice"
                    type="number"
                    value={newProduct.discountedPrice}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">Product Image *</Label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 bg-gray-50">
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <Upload size={20} />
                          <span className="text-xs mt-1">Upload</span>
                        </div>
                      )}
                    </label>
                    
                    <div className="flex-1">
                      <Input
                        placeholder="Or enter image URL"
                        value={!imagePreview ? newProduct.image : ''}
                        onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                        disabled={!!imagePreview}
                      />
                      {imagePreview && (
                        <button 
                          type="button" 
                          className="text-sm text-red-500 mt-1"
                          onClick={() => {
                            setImagePreview('');
                            setNewProduct({...newProduct, image: ''});
                          }}
                        >
                          Clear image
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={newProduct.category} 
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="men">Men</SelectItem>
                        <SelectItem value="women">Women</SelectItem>
                        <SelectItem value="unisex">Unisex</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                        <SelectItem value="sustainable">Sustainable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subCategory">Sub-Category</Label>
                    <Select 
                      value={newProduct.subCategory} 
                      onValueChange={(value) => handleSelectChange('subCategory', value)}
                    >
                      <SelectTrigger id="subCategory">
                        <SelectValue placeholder="Select sub-category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="oversized">Oversized</SelectItem>
                        <SelectItem value="crop">Crop</SelectItem>
                        <SelectItem value="long-sleeve">Long Sleeve</SelectItem>
                        <SelectItem value="v-neck">V-Neck</SelectItem>
                        <SelectItem value="pocket">Pocket</SelectItem>
                        <SelectItem value="special">Special</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tag">Tag</Label>
                  <Select 
                    value={newProduct.tag} 
                    onValueChange={(value) => handleSelectChange('tag', value)}
                  >
                    <SelectTrigger id="tag">
                      <SelectValue placeholder="Select tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Sale">Sale</SelectItem>
                      <SelectItem value="Hot">Hot</SelectItem>
                      <SelectItem value="Trending">Trending</SelectItem>
                      <SelectItem value="Exclusive">Exclusive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Available Sizes</Label>
                  <div className="flex flex-wrap gap-3">
                    {availableSizes.map(size => (
                      <label 
                        key={size} 
                        className={`
                          cursor-pointer border rounded-md px-3 py-1 text-sm
                          ${(newProduct.sizes || []).includes(size) 
                            ? 'bg-brand-yellow text-white border-brand-yellow' 
                            : 'bg-white text-gray-700 border-gray-300'}
                        `}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={(newProduct.sizes || []).includes(size)}
                          onChange={() => handleSizeToggle(size)}
                        />
                        {size}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Available Colors</Label>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.map(color => (
                      <label 
                        key={color} 
                        className={`
                          cursor-pointer border rounded-md px-3 py-1 text-sm
                          ${(newProduct.colors || []).includes(color) 
                            ? 'bg-brand-yellow text-white border-brand-yellow' 
                            : 'bg-white text-gray-700 border-gray-300'}
                        `}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={(newProduct.colors || []).includes(color)}
                          onChange={() => handleColorToggle(color)}
                        />
                        {color}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={newProduct.inStock}
                    onCheckedChange={(checked) => 
                      setNewProduct({...newProduct, inStock: checked === true})
                    }
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
                
                <Button type="submit" className="w-full bg-brand-yellow hover:bg-yellow-500 text-white">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </form>
            </div>
          </div>
        </TabsContent>
        
        {/* Orders tab */}
        <TabsContent value="orders">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-medium mb-4">Orders Management</h2>
            <p className="text-gray-500">This feature is coming soon.</p>
          </div>
        </TabsContent>
        
        {/* Customers tab */}
        <TabsContent value="customers">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-medium mb-4">Customer Management</h2>
            <p className="text-gray-500">This feature is coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
