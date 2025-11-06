import { X, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Product } from "@shared/schema";

interface StoreMapProps {
  product: Product;
  onClose: () => void;
}

export function StoreMap({ product, onClose }: StoreMapProps) {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.6));

  // Store layout - simplified grocery store floor plan
  const aisles = [
    { id: "A1", x: 10, y: 20, width: 15, height: 60, label: "Aisle 1" },
    { id: "A2", x: 30, y: 20, width: 15, height: 60, label: "Aisle 2" },
    { id: "A3", x: 50, y: 20, width: 15, height: 60, label: "Aisle 3" },
    { id: "A4", x: 70, y: 20, width: 15, height: 60, label: "Aisle 4" },
  ];

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col" data-testid="map-view">
      {/* Map Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Store Map</h2>
          <p className="text-sm text-muted-foreground">{product.name}</p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          data-testid="button-close-map"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative overflow-hidden bg-muted/20">
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `scale(${zoom})`,
            transition: "transform 0.2s ease-out",
          }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full max-w-2xl"
            style={{ maxHeight: "80vh" }}
          >
            {/* Store Outline */}
            <rect
              x="5"
              y="10"
              width="90"
              height="80"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-border"
            />

            {/* Entrance */}
            <rect
              x="42"
              y="88"
              width="16"
              height="4"
              fill="currentColor"
              className="text-primary/20"
            />
            <text
              x="50"
              y="95"
              fontSize="3"
              textAnchor="middle"
              className="fill-muted-foreground"
            >
              ENTRANCE
            </text>

            {/* Aisles */}
            {aisles.map((aisle) => (
              <g key={aisle.id}>
                <rect
                  x={aisle.x}
                  y={aisle.y}
                  width={aisle.width}
                  height={aisle.height}
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0.3"
                  className={
                    product.aisle === aisle.id
                      ? "text-primary/30 stroke-primary"
                      : "text-muted/50 stroke-border"
                  }
                />
                <text
                  x={aisle.x + aisle.width / 2}
                  y={aisle.y + aisle.height / 2}
                  fontSize="3.5"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground"
                >
                  {aisle.label}
                </text>
              </g>
            ))}

            {/* Product Location Marker */}
            <g data-testid="product-marker">
              {/* Pulsing circle */}
              <circle
                cx={product.mapX}
                cy={product.mapY}
                r="3"
                fill="currentColor"
                className="text-destructive animate-pulse"
              />
              <circle
                cx={product.mapX}
                cy={product.mapY}
                r="2"
                fill="white"
              />
              {/* Label */}
              <text
                x={product.mapX}
                y={product.mapY - 5}
                fontSize="3"
                fontWeight="medium"
                textAnchor="middle"
                className="fill-foreground"
              >
                📍 Product Here
              </text>
            </g>
          </svg>
        </div>

        {/* Map Legend */}
        <Card className="absolute top-4 left-4 p-3 space-y-2" data-testid="map-legend">
          <h3 className="text-sm font-medium">Legend</h3>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-destructive" />
              <span>Product Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary/30 border border-primary rounded" />
              <span>Current Aisle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted/50 border border-border rounded" />
              <span>Other Aisles</span>
            </div>
          </div>
        </Card>

        {/* Zoom Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2">
          <Button
            size="icon"
            onClick={handleZoomIn}
            className="w-14 h-14 rounded-full"
            data-testid="button-zoom-in"
          >
            <ZoomIn className="w-6 h-6" />
          </Button>
          <Button
            size="icon"
            onClick={handleZoomOut}
            className="w-14 h-14 rounded-full"
            data-testid="button-zoom-out"
          >
            <ZoomOut className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Product Info Footer */}
      <div className="p-4 border-t bg-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="text-base font-medium">
              {product.aisle}, Shelf {product.shelf}
            </p>
          </div>
          <Button onClick={onClose} variant="outline" data-testid="button-back-to-product">
            Back to Product
          </Button>
        </div>
      </div>
    </div>
  );
}
