import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/context/CartContext";
import axiosInstance from "@/lib/Api";
import toast from "react-hot-toast";
import {
  Truck,
  MapPin,
  User,
  Lock,
  Package,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { checkoutSchema, type CheckoutFormValues } from "@/lib/zodValidation";
import { wilayas, shippingOptions } from "@/data";

const CompleteOrder = () => {
  const { cart, total, loading } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // Enhanced shipping options with icons
  const shippingOptionsWithIcons = shippingOptions.map((option) => ({
    ...option,
    icon: option.id === "standard" ? Truck : Package,
  }));

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      wilaya: "",
      shippingMethod: "standard",
      notes: "",
    },
  });

  const selectedShipping = shippingOptions.find(
    (opt) => opt.id === form.watch("shippingMethod"),
  );
  const shippingCost = selectedShipping?.price || 0;
  const grandTotal = total + shippingCost;

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      setSubmitting(true);
      const response = await axiosInstance.post("/order", {
        ...data,
        items: cart,
        total: grandTotal,
      });
      toast.success("Order placed successfully!");
      navigate(`/order-confirmation/${response.data.orderId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Add items to your cart before checking out
        </p>
        <Button onClick={() => navigate("/")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/cart")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl lg:text-4xl font-bold flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-primary" />
            Complete Your Order
          </h1>
          <p className="text-muted-foreground mt-2">
            Fill in your details to complete your purchase
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Checkout Form */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Ahmed" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Benali" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="ahmed@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+213 555 123 456"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Shipping Address & Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Shipping Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123 Main Street, Apt 4B"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City *</FormLabel>
                            <FormControl>
                              <Input placeholder="Algiers" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="wilaya"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Wilaya *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select wilaya" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {wilayas.map((wilaya) => (
                                  <SelectItem key={wilaya} value={wilaya}>
                                    {wilaya}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator className="my-6" />

                    <FormField
                      control={form.control}
                      name="shippingMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold flex items-center gap-2">
                            <Truck className="w-4 h-4" />
                            Shipping Method
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-3 mt-3"
                            >
                              {shippingOptionsWithIcons.map((option) => (
                                <div
                                  key={option.id}
                                  className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition ${
                                    field.value === option.id
                                      ? "border-primary bg-primary/5 shadow-sm"
                                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                                  }`}
                                >
                                  <RadioGroupItem
                                    value={option.id}
                                    id={option.id}
                                  />
                                  <Label
                                    htmlFor={option.id}
                                    className="flex-1 cursor-pointer"
                                  >
                                    <div className="flex items-center w-full justify-between">
                                      <div className="flex items-center gap-3">
                                        <option.icon className="w-5 h-5 text-muted-foreground" />
                                        <div>
                                          <p className="font-semibold">
                                            {option.name}
                                          </p>
                                          <p className="text-sm text-muted-foreground">
                                            {option.time}
                                          </p>
                                        </div>
                                      </div>
                                      <p className="font-semibold  text-green-500">
                                        {option.price === 0
                                          ? "FREE"
                                          : `${option.price} DA`}
                                      </p>
                                    </div>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="my-6" />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Notes (Optional)</FormLabel>
                          <FormControl>
                            <textarea
                              className="w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                              rows={3}
                              placeholder="Any special instructions for your order..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full"
                  size="lg"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Place Order - ${grandTotal.toFixed(2)}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By placing your order, you agree to our terms and conditions.
                  Payment will be collected on delivery.
                </p>
              </form>
            </Form>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-4">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 mt-6">
                {/* Cart Items */}
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="relative  w-16 h-16 bg-muted rounded flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-contain p-1"
                        />
                        <Badge className="absolute -top-0 right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                          {item.quantity}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${item.product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subtotal ({cart.length} items)
                    </span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? (
                        <span className="text-green-600 font-semibold">
                          FREE
                        </span>
                      ) : (
                        `${shippingCost} DA`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">$0.00</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-base pt-2">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-green-500 text-xl">
                      {grandTotal.toFixed(2)} DZ
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Trust Badges */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span>Secure checkout guaranteed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteOrder;
