
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
import { mockProducts } from '@/data/mockProducts';
import { Product } from '@/types/product';
import { PlusCircle, Package, Users, ShoppingBag, Edit, Trash2 } from 'lucide-react';

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
    tag: '',
    inStock: true,
  });
  
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
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
      tag: '',
      inStock: true,
    });
    
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
                    <Label htmlFor="price">Price *</Label>
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
                    <Label htmlFor="discountedPrice">Discounted Price</Label>
                    <Input
                      id="discountedPrice"
                      name="discountedPrice"
                      type="number"
                      value={newProduct.discountedPrice}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount %</Label>
                    <Input
                      id="discount"
                      name="discount"
                      type="number"
                      value={newProduct.discount}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tag">Tag</Label>
                    <Input
                      id="tag"
                      name="tag"
                      value={newProduct.tag}
                      onChange={handleInputChange}
                      placeholder="New, Sale, etc."
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL *</Label>
                  <Input
                    id="image"
                    name="image"
                    value={newProduct.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
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
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="inStock"
                    name="inStock"
                    checked={newProduct.inStock}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300"
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
