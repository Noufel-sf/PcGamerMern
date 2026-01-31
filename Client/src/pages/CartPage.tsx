import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Counter } from '@/components/animate-ui/components/counter';
import { SkeletonItem, SkeletonSummary } from '@/components/CartItemsSkeleton';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';
import Api from '@/lib/Api';
import { Link } from 'react-router-dom';


import {
  ShoppingBag,
  Trash2,
  Tag,
  Shield,
  Truck,
  CreditCard,
  Lock,
  ArrowRight,
  ArrowLeft,
  Gift,
  AlertCircle,
} from 'lucide-react';

const CartPage = () => {
  const {
    cart: cartItems,
    total,
    loading,
    updateCartItems,
    deleteCartItem,
    clearCart,
  } = useCart();

  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const handleQuantityUpdate = async (productId, newVal, currentVal) => {
    if (newVal < 1) {
      await deleteCartItem(productId);
      toast.success('Item removed from cart');
    } else {
      const action = newVal > currentVal ? 'increase' : 'decrease';
      await updateCartItems(productId, action);
    }
  };

  const handlePromoCode = () => {
    if (promoCode.trim()) {
      setPromoApplied(true);
      toast.success('Promo code applied!');
    } else {
      toast.error('Please enter a valid promo code');
    }
  };

  const checkOut = async () => {
    try {
      const { data } = await Api.post('/order');
      window.location.href = data.url;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    }
  };

  const savings = promoApplied ? total * 0.1 : 0; // 10% discount
  const finalTotal = total - savings;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/allproducts')}
            className="gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Button>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-primary" />
            Shopping Cart
          </h1>
          <p className="text-muted-foreground">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in
            your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              [...Array(3)].map((_, i) => <SkeletonItem key={i} />)
            ) : cartItems.length > 0 ? (
              <>
              

                {/* Cart items */}
                {cartItems.map((item) => (
                  <Card
                    key={item?.product?.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product image */}
                        <div className="relative w-full sm:w-32 h-32 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                          <img
                            src={item?.product?.image}
                            alt={item?.product?.name}
                            className="w-full h-full object-contain p-2 cursor-pointer hover:scale-105 transition"
                            onClick={() =>
                              navigate(`/product/${item?.product?.id}`)
                            }
                          />
                        </div>

                        {/* Product info */}
                        <div className="flex-1 space-y-2">
                          <h3
                            className="font-semibold text-lg line-clamp-2 cursor-pointer hover:text-primary transition"
                            onClick={() =>
                              navigate(`/product/${item?.product?.id}`)
                            }
                          >
                            {item?.product?.name}
                          </h3>

                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-primary">
                              ${item?.product?.price}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              In Stock
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                            <Truck className="w-4 h-4" />
                            <span className="font-medium">
                              Eligible for FREE delivery
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-4 pt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                Qty:
                              </span>
                              <Counter
                                number={item.quantity}
                                setNumber={(newVal) =>
                                  handleQuantityUpdate(
                                    item.product.id,
                                    newVal,
                                    item.quantity
                                  )
                                }
                              />
                            </div>

                            <Separator orientation="vertical" className="h-6" />

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCartItem(item.product.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Clear cart */}
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </Button>
              </>
            ) : (
              <Card className="p-12 text-center">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">
                  Your cart is empty
                </h3>
                <p className="text-muted-foreground mb-6">
                  Looks like you haven't added anything to your cart yet
                </p>
                <Button onClick={() => navigate('/allproducts')} size="lg">
                  Start Shopping
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Card>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-4">
            {loading ? (
              <SkeletonSummary />
            ) : (
              <>
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                

                    {/* Price breakdown */}
                    <div className="space-y-3 mt-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">${total.toFixed(2)}</span>
                      </div>

                      {savings > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600">Discount</span>
                          <span className="font-medium text-green-600">
                            -${savings.toFixed(2)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium text-green-600">FREE</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span className="font-medium">$0.00</span>
                      </div>

                      <Separator />

                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-primary">
                          ${finalTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <Link to ="/completeorder">
                    <Button
                      size="lg"
                      variant="primary"
                      className="w-full mt-2 text-base font-semibold"
                      onClick={checkOut}
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Complete Order 
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                    </Link>
                    <div className="flex mt-3  items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Lock className="w-3 h-3" />
                      <span>Secure checkout - Your data is protected</span>
                    </div>
                  </CardContent>
                </Card>

              
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
