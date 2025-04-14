
import { useState, useEffect, useRef } from 'react';
import { useShop } from '@/context/ShopContext';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BrushIcon, Type, Image as ImageIcon, Palette, Save, ShoppingCart } from 'lucide-react';

const CustomDesign = () => {
  // Canvas and design state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tshirtColor, setTshirtColor] = useState('#ffffff');
  const [textInput, setTextInput] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(30);
  const [fontFamily, setFontFamily] = useState('Helvetica, Times New Roman, sans-serif');
  const [selectedSize, setSelectedSize] = useState('M');
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [logoPosition, setLogoPosition] = useState({ x: 150, y: 150 });
  const [logoScale, setLogoScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const { addToCart } = useShop();
  
  // Available options
  const colors = [
    { name: 'White', value: '#ffffff' },
    { name: 'Black', value: '#000000' },
    { name: 'Navy', value: '#0a192f' },
    { name: 'Red', value: '#e11d48' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Purple', value: '#9333ea' },
    { name: 'Gray', value: '#6b7280' },
  ];
  
  const fonts = [
    { name: 'Helvetica', value: 'Helvetica, sans-serif' },
    { name: 'Times New Roman', value: 'Times New Roman, serif' },
    { name: 'Courier New', value: 'Courier New, monospace' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
  ];
  
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (result) {
        const img = new Image();
        img.onload = () => {
          setLogoImage(result as string);
          renderCanvas();
        };
        img.src = result as string;
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Canvas rendering logic
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw T-shirt shape
    drawTShirt(ctx, tshirtColor);
    
    // Draw text if entered
    if (textInput) {
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.fillText(textInput, canvas.width / 2, 150);
    }
    
    // Draw logo if uploaded
    if (logoImage) {
      const img = new Image();
      img.onload = () => {
        const scaledWidth = img.width * logoScale;
        const scaledHeight = img.height * logoScale;
        ctx.drawImage(
          img, 
          logoPosition.x - scaledWidth / 2, 
          logoPosition.y - scaledHeight / 2, 
          scaledWidth, 
          scaledHeight
        );
      };
      img.src = logoImage;
    }
  };
  
  // Helper function to draw a simple t-shirt shape
  const drawTShirt = (ctx: CanvasRenderingContext2D, color: string) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // T-shirt body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(width * 0.2, height * 0.1); // top left of collar
    ctx.lineTo(width * 0.4, height * 0.1); // left collar
    ctx.lineTo(width * 0.45, height * 0.2); // left inner collar
    ctx.lineTo(width * 0.55, height * 0.2); // right inner collar
    ctx.lineTo(width * 0.6, height * 0.1); // right collar
    ctx.lineTo(width * 0.8, height * 0.1); // top right of collar
    ctx.lineTo(width * 0.9, height * 0.3); // sleeve right
    ctx.lineTo(width * 0.8, height * 0.4); // under sleeve right
    ctx.lineTo(width * 0.8, height * 0.9); // bottom right
    ctx.lineTo(width * 0.2, height * 0.9); // bottom left
    ctx.lineTo(width * 0.2, height * 0.4); // under sleeve left
    ctx.lineTo(width * 0.1, height * 0.3); // sleeve left
    ctx.closePath();
    ctx.fill();
    
    // Add some shading for 3D effect
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.beginPath();
    ctx.moveTo(width * 0.2, height * 0.4);
    ctx.lineTo(width * 0.1, height * 0.3);
    ctx.lineTo(width * 0.2, height * 0.1);
    ctx.lineTo(width * 0.2, height * 0.4);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(width * 0.8, height * 0.4);
    ctx.lineTo(width * 0.9, height * 0.3);
    ctx.lineTo(width * 0.8, height * 0.1);
    ctx.lineTo(width * 0.8, height * 0.4);
    ctx.closePath();
    ctx.fill();
    
    // Add a simple collar line
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width * 0.45, height * 0.2);
    ctx.lineTo(width * 0.5, height * 0.25);
    ctx.lineTo(width * 0.55, height * 0.2);
    ctx.stroke();
  };
  
  // Handle mouse events for logo dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!logoImage) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if the click is within the logo area
    const distance = Math.sqrt(
      Math.pow(x - logoPosition.x, 2) + Math.pow(y - logoPosition.y, 2)
    );
    
    if (distance < 50 * logoScale) {
      setIsDragging(true);
      setDragOffset({
        x: x - logoPosition.x,
        y: y - logoPosition.y,
      });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !logoImage) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setLogoPosition({
      x: x - dragOffset.x,
      y: y - dragOffset.y,
    });
    
    renderCanvas();
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Add custom design to cart
  const addDesignToCart = () => {
    // Create a product-like object for the custom design
    const customProduct = {
      id: `custom-${Date.now()}`,
      name: 'Custom Designed T-Shirt',
      description: textInput ? `Custom t-shirt with text: "${textInput}"` : 'Custom designed t-shirt',
      price: 1499,
      discountedPrice: 1299,
      image: canvasRef.current?.toDataURL() || '',
      category: 'custom',
      tag: 'Custom',
      inStock: true,
    };
    
    addToCart(customProduct, 1, selectedSize);
    
    toast({
      title: "Added to cart",
      description: "Your custom designed t-shirt has been added to cart.",
    });
  };
  
  // Initialize canvas and update on any design change
  useEffect(() => {
    renderCanvas();
  }, [tshirtColor, textInput, textColor, fontSize, fontFamily, logoImage, logoScale]);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-medium mb-4">
          Design Your <span className="text-brand-yellow">Custom</span> T-Shirt
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create your unique t-shirt design by adding text, uploading images, 
          and selecting colors. Drag elements to position them exactly where you want.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Preview canvas */}
        <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center">
          <div className="tshirt-canvas-container">
            <canvas 
              ref={canvasRef} 
              width={300} 
              height={400}
              className="mx-auto cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              aria-label="T-shirt Design Canvas"
            />
            
            <div className="text-center mt-4 text-sm text-gray-500">
              {logoImage && <p>Click and drag the logo to reposition it</p>}
            </div>
          </div>
        </div>
        
        {/* Design controls */}
        <div className="controls-container">
          <Tabs defaultValue="color">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="color" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span>Color</span>
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                <span>Text</span>
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                <span>Image</span>
              </TabsTrigger>
              <TabsTrigger value="save" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span>Save</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Color tab */}
            <TabsContent value="color" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Choose T-Shirt Color</h3>
                <div className="grid grid-cols-4 gap-4">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      className={`w-full aspect-square rounded-full border-2 ${
                        tshirtColor === color.value ? 'border-brand-yellow ring-2 ring-brand-yellow ring-offset-2' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setTshirtColor(color.value)}
                      aria-label={`Select ${color.name} color`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-4 mt-2">
                  {colors.map((color) => (
                    <div key={color.value} className="text-center text-xs text-gray-500">
                      {color.name}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            {/* Text tab */}
            <TabsContent value="text" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="text-input">Text</Label>
                  <Input
                    id="text-input"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Enter text for your design"
                  />
                </div>
                
                <div>
                  <Label htmlFor="text-color">Text Color</Label>
                  <div className="grid grid-cols-8 gap-2 mt-2">
                    {['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'].map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border ${
                          textColor === color ? 'border-brand-yellow ring-2 ring-brand-yellow ring-offset-2' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setTextColor(color)}
                        aria-label={`Select text color ${color}`}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Font Size</Label>
                  <div className="py-4">
                    <Slider
                      value={[fontSize]}
                      min={12}
                      max={60}
                      step={1}
                      onValueChange={(value) => setFontSize(value[0])}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Small</span>
                    <span>Large</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="font-family">Font Family</Label>
                  <Select 
                    value={fontFamily} 
                    onValueChange={setFontFamily}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fonts.map((font) => (
                        <SelectItem key={font.name} value={font.value}>
                          {font.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            {/* Image tab */}
            <TabsContent value="image" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="logo-upload">Upload Logo or Image</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      id="logo-upload"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      Choose Image
                    </Button>
                  </div>
                  
                  {logoImage && (
                    <div className="mt-4">
                      <img 
                        src={logoImage} 
                        alt="Uploaded logo" 
                        className="max-h-24 mx-auto object-contain"
                      />
                    </div>
                  )}
                </div>
                
                {logoImage && (
                  <div>
                    <Label>Logo Size</Label>
                    <div className="py-4">
                      <Slider
                        value={[logoScale * 100]}
                        min={10}
                        max={200}
                        step={5}
                        onValueChange={(value) => setLogoScale(value[0] / 100)}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Small</span>
                      <span>Large</span>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Save tab */}
            <TabsContent value="save" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="size-select">Select Size</Label>
                  <Select 
                    value={selectedSize} 
                    onValueChange={setSelectedSize}
                  >
                    <SelectTrigger id="size-select">
                      <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-6">
                  <Button 
                    className="w-full bg-brand-yellow hover:bg-yellow-500 text-white h-12"
                    onClick={addDesignToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart - ₹1,299
                  </Button>
                </div>
                
                <div className="text-center text-sm text-gray-500 mt-2">
                  <p>Your custom design will be printed exactly as shown.</p>
                  <p>Production time: 3-5 business days.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CustomDesign;

