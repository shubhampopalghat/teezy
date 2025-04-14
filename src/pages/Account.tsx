
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { 
  Package, 
  User, 
  ShoppingBag, 
  Settings, 
  LogOut 
} from 'lucide-react';

// Mock orders data - In a real app, this would come from an API
const mockOrders = [
  {
    id: '1',
    date: '2025-04-10',
    status: 'Delivered',
    total: '$89.99',
    items: 'Custom T-Shirt (Black, L)'
  },
  {
    id: '2',
    date: '2025-04-05',
    status: 'Processing',
    total: '$45.50',
    items: 'Graphic Tee (White, M)'
  },
  {
    id: '3',
    date: '2025-03-28',
    status: 'Delivered',
    total: '$124.75',
    items: 'Custom Hoodie (Gray, XL), Beanie'
  }
];

const Account = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Not Logged In</CardTitle>
            <CardDescription>
              Please log in to view your account details.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    // redirect to home would happen automatically in navbar context
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar - Mobile: Top tabs, Desktop: Left sidebar */}
        <div className="sm:hidden w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="profile" className="flex flex-col items-center gap-1">
                <User size={16} />
                <span className="text-xs">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex flex-col items-center gap-1">
                <ShoppingBag size={16} />
                <span className="text-xs">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex flex-col items-center gap-1">
                <Settings size={16} />
                <span className="text-xs">Settings</span>
              </TabsTrigger>
              <TabsTrigger value="logout" className="flex flex-col items-center gap-1" onClick={handleLogout}>
                <LogOut size={16} />
                <span className="text-xs">Logout</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="hidden sm:block w-full sm:w-64 shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">My Account</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col">
                <Button 
                  variant={activeTab === "profile" ? "default" : "ghost"} 
                  className="justify-start rounded-none h-12"
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="mr-2" size={18} />
                  <span>Profile</span>
                </Button>
                <Button 
                  variant={activeTab === "orders" ? "default" : "ghost"} 
                  className="justify-start rounded-none h-12"
                  onClick={() => setActiveTab("orders")}
                >
                  <ShoppingBag className="mr-2" size={18} />
                  <span>Orders</span>
                </Button>
                <Button 
                  variant={activeTab === "settings" ? "default" : "ghost"} 
                  className="justify-start rounded-none h-12"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="mr-2" size={18} />
                  <span>Settings</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="justify-start rounded-none h-12 text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2" size={18} />
                  <span>Logout</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-shrink-0 w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    <User size={64} className="text-gray-400" />
                  </div>
                  <div className="space-y-6 flex-1">
                    <div className="grid gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Name</h3>
                        <p className="text-base font-medium mt-1">{user.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p className="text-base font-medium mt-1">{user.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Account Type</h3>
                        <p className="text-base font-medium mt-1">{user.isAdmin ? 'Administrator' : 'Customer'}</p>
                      </div>
                    </div>
                    <Button className="mt-4">Edit Profile</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "orders" && (
            <Card>
              <CardHeader>
                <CardTitle>My Orders</CardTitle>
                <CardDescription>Track and manage your purchases</CardDescription>
              </CardHeader>
              <CardContent>
                {mockOrders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">#{order.id}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>{order.items}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === 'Delivered' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{order.total}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Package size={48} className="mx-auto text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium">No orders yet</h3>
                    <p className="text-gray-500 mt-1">When you place an order, it will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Notification preferences, password change, etc. would go here */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email notifications</h3>
                      <p className="text-sm text-gray-500">Receive updates about your orders and promotions</p>
                    </div>
                    {/* This would be a toggle in a real implementation */}
                    <div className="bg-brand-yellow w-12 h-6 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button variant="outline" className="w-full sm:w-auto">Change Password</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
