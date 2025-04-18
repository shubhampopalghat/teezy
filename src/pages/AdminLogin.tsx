
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (data: { email: string; password: string }) => {
    if (!data.email || !data.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      
      // Check if the email contains "admin" to simulate admin login
      // In a real app, this would use a proper role-based system
      if (!data.email.includes('admin')) {
        toast({
          title: "Access Denied",
          description: "This login page is for administrators only.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      toast({
        title: "Success",
        description: "Welcome back, administrator",
      });
      navigate('/admin');
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-brand-yellow" />
            </div>
          </div>
          <h1 className="text-3xl font-['Helvetica-times-now'] font-medium mb-2 font-helvetica">Administrator Access</h1>
          <p className="text-gray-600">Sign in to manage your products and orders</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Email</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <FormControl>
                        <Input
                          placeholder="admin@example.com"
                          className="pl-10"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-brand-yellow hover:bg-yellow-500 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In as Administrator"}
              </Button>
              
              <div className="text-center text-sm">
                <span className="text-gray-600">Not an administrator?</span>{" "}
                <a href="/login" className="text-brand-yellow hover:underline font-medium">
                  Go to regular login
                </a>
              </div>
            </form>
          </Form>
        </div>
        
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <h3 className="text-sm font-medium mb-2">Administrator Demo Access</h3>
          <p className="text-xs text-gray-500 mb-2">Use these credentials to test admin features:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="font-medium">Email:</div>
            <div>admin@example.com</div>
            <div className="font-medium">Password:</div>
            <div>password123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
