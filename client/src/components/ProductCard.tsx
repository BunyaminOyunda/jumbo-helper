import { MapPin, DollarSign, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onShowMap: () => void;
}

export function ProductCard({ product, onShowMap }: ProductCardProps) {
  return (
    <Card className="p-4 space-y-4" data-testid={`card-product-${product.id}`}>
      {/* Product Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-medium text-foreground" data-testid="text-product-name">
            {product.name}
          </h2>
          <Badge variant="secondary" className="shrink-0">
            {product.category}
          </Badge>
        </div>
        <p className="text-sm font-mono text-muted-foreground" data-testid="text-ean">
          EAN: {product.ean}
        </p>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-muted-foreground" />
        <span className="text-xl font-medium text-foreground" data-testid="text-price">
          ${product.price.toFixed(2)}
        </span>
      </div>

      {/* Location Info */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <Package className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Aisle</p>
            <p className="text-sm font-medium" data-testid="text-aisle">
              {product.aisle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Shelf</p>
            <p className="text-sm font-medium" data-testid="text-shelf">
              {product.shelf}
            </p>
          </div>
        </div>
      </div>

      {/* Show on Map Button */}
      <Button
        onClick={onShowMap}
        className="w-full h-12 text-base font-medium"
        data-testid="button-show-map"
      >
        <MapPin className="w-5 h-5 mr-2" />
        Show on Map
      </Button>
    </Card>
  );
}
