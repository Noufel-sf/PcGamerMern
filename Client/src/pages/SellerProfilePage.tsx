import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Store, 
  MapPin, 
  Calendar, 
  Star, 
  Users, 
  Package, 
  MessageCircle,
  Mail,
  Phone,
  Globe,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProductCard } from '@/components/ProductCard';
import { Separator } from '@/components/ui/separator';

// Mock seller data
const mockSeller = {
  id: 'seller-1',
  name: 'TechGear Store',
  avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TechGear',
  coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=300&fit=crop',
  description: 'Your trusted source for premium electronics and gadgets. We offer the latest technology products with competitive prices and excellent customer service.',
  rating: 4.7,
  totalReviews: 1543,
  totalProducts: 87,
  followers: 12543,
  joinedDate: '2022-03-15',
  location: 'New York, USA',
  responseTime: '< 1 hour',
  responseRate: '98%',
  verified: true,
  contact: {
    email: 'support@techgearstore.com',
    phone: '+1 (555) 123-4567',
    website: 'www.techgearstore.com'
  },
  socialMedia: {
    facebook: 'techgearstore',
    twitter: '@techgearstore',
    instagram: '@techgearstore'
  },
  policies: {
    returnPolicy: '30 days return policy',
    shipping: 'Free shipping on orders over $50',
    warranty: '1-year manufacturer warranty on all products'
  }
};

// Mock products from this seller
const mockSellerProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    price: 79.99,
    originalPrice: 129.99,
    currency: 'USD',
    discountPercent: 38,
    averageRating: 4.5,
    numOfReviews: 234
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    price: 199.99,
    originalPrice: 299.99,
    currency: 'USD',
    discountPercent: 33,
    averageRating: 4.8,
    numOfReviews: 567
  },
  {
    id: '3',
    name: 'Laptop Stand Aluminum',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
    price: 49.99,
    originalPrice: 79.99,
    currency: 'USD',
    discountPercent: 37,
    averageRating: 4.6,
    numOfReviews: 189
  },
  {
    id: '4',
    name: 'USB-C Hub Multiport Adapter',
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=300&h=300&fit=crop',
    price: 34.99,
    originalPrice: 59.99,
    currency: 'USD',
    discountPercent: 42,
    averageRating: 4.4,
    numOfReviews: 312
  },
  {
    id: '5',
    name: 'Wireless Charging Pad',
    image: 'https://images.unsplash.com/photo-1591290619762-c588f7e59def?w=300&h=300&fit=crop',
    price: 24.99,
    originalPrice: 39.99,
    currency: 'USD',
    discountPercent: 37,
    averageRating: 4.3,
    numOfReviews: 445
  },
  {
    id: '6',
    name: 'Mechanical Gaming Keyboard',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=300&fit=crop',
    price: 89.99,
    originalPrice: 149.99,
    currency: 'USD',
    discountPercent: 40,
    averageRating: 4.7,
    numOfReviews: 678
  },
  {
    id: '7',
    name: 'Portable Bluetooth Speaker',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
    price: 59.99,
    originalPrice: 99.99,
    currency: 'USD',
    discountPercent: 40,
    averageRating: 4.5,
    numOfReviews: 523
  },
  {
    id: '8',
    name: 'HD Webcam 1080p',
    image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=300&h=300&fit=crop',
    price: 69.99,
    originalPrice: 119.99,
    currency: 'USD',
    discountPercent: 42,
    averageRating: 4.6,
    numOfReviews: 267
  }
];



export default function SellerProfilePage() {
  const { sellerId } = useParams();
  const [activeTab, setActiveTab] = useState('products');

  // Mock user and cart function (you can replace with your actual context)
  const user = null;
  const addToCart = (id: string) => {
    console.log('Add to cart:', id);
  };

  return (
    <div className="min-h-screen bg-background">
      

      {/* Seller Info Section */}
      <div className="container mx-auto px-4 mt-20 relative z-10">
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                <AvatarImage src={mockSeller.avatar} alt={mockSeller.name} />
                <AvatarFallback className="text-3xl">{mockSeller.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button className="mt-4 w-full md:w-auto">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Seller
              </Button>
            </div>

            {/* Seller Details */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start gap-2 mb-3">
                <h1 className="text-3xl font-bold">{mockSeller.name}</h1>
                
              </div>

              <p className="text-muted-foreground mb-4 max-w-3xl">
                {mockSeller.description}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                
                
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-semibold text-sm">{mockSeller.location}</div>
                    <div className="text-xs text-muted-foreground">Location</div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(mockSeller.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </div>
                <Separator orientation="vertical" className="h-4" />
                
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex items-center  gap-4">
            <TabsTrigger value="products" className="cursor-pointer">
              <Package className="w-4 h-4 mr-2" />
              Products ({mockSellerProducts.length})
            </TabsTrigger>
            <TabsTrigger value="about" className="cursor-pointer">
              <Store className="w-4 h-4 mr-2" />
              About
            </TabsTrigger>
            
          </TabsList>
{/* 
          <TabsContent value="products" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {mockSellerProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  user={user}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </TabsContent> */}

          {/* About Tab */}
          <TabsContent value="about" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Email</div>
                        <div className="font-medium">{mockSeller.contact.email}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Phone</div>
                        <div className="font-medium">{mockSeller.contact.phone}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Website</div>
                        <div className="font-medium">{mockSeller.contact.website}</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">Social Media</h4>
                    <div className="flex gap-3">
                      <Button variant="outline" size="icon">
                        <Facebook className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Twitter className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Instagram className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Store Policies */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Store Policies</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Return Policy</h4>
                      <p className="text-sm text-muted-foreground">{mockSeller.policies.returnPolicy}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Shipping</h4>
                      <p className="text-sm text-muted-foreground">{mockSeller.policies.shipping}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Warranty</h4>
                      <p className="text-sm text-muted-foreground">{mockSeller.policies.warranty}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

      
        </Tabs>
      </div>
    </div>
  );
}
