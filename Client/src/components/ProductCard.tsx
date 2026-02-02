import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import StarRating from "./ui/StarRating";

export function ProductCard({
  product,
  addToCart,
}: {
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number; // crossed-out price
    currency?: string;
    discountPercent?: number;
    averageRating?: number;
    numOfReviews?: number;
  };
  addToCart: (id: string) => void;
}) {

  return (
    <Card className="h-full w-full mx-auto overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/product/${product.id}`} className="block">
        <CardHeader className="p-0 relative">
          {/* Product Image */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-38 object-contain"
          />

          {typeof product.discountPercent === "number" && (
            <Badge
              variant="destructive"
              className="absolute top-2 right-2 text-xs font-semibold"
            >
              %{product.discountPercent}
            </Badge>
          )}
        </CardHeader>

        <CardContent className="p-4 space-y-1">

          <div className="flex items-center gap-1">
            <StarRating rating={product.averageRating ?? 0} />
          </div>

          <h3 className="text-sm font-medium line-clamp-2 min-h-[40px]">
            {product.name}
          </h3>

          <div className="flex items-center">
            <span className="text-lg font-bold text-primary">
              {product.price} {"Dz"}   
            </span>
              <span className="text-sm text-muted-foreground line-through">
                {product.originalPrice}
              </span>
          </div>
        </CardContent>
      </Link>

      <div className="px-4 flex items-center gap-2">
        <Button
          className="flex-1 bg-primary hover:bg-primary/20"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
          
            addToCart(product.id);
          }}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to cart
        </Button>


      </div>
    </Card>
  );
}

export default ProductCard;
