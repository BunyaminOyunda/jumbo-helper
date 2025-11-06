import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FinderTabProps {
  onSearch: (ean: string) => void;
}

export function FinderTab({ onSearch }: FinderTabProps) {
  const [ean, setEan] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus the input when tab becomes active
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate EAN (13 digits)
    if (!ean) {
      setError("Please enter a barcode number");
      return;
    }

    if (!/^\d+$/.test(ean)) {
      setError("Barcode must contain only numbers");
      return;
    }

    if (ean.length < 8) {
      setError("Barcode must be at least 8 digits");
      return;
    }

    onSearch(ean);
  };

  return (
    <div className="flex flex-col h-full p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* EAN Input Field */}
        <div className="space-y-2">
          <Label htmlFor="ean-input" className="text-sm font-medium">
            Product Barcode
          </Label>
          <Input
            ref={inputRef}
            id="ean-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter barcode number (EAN-13, UPC, etc.)"
            value={ean}
            onChange={(e) => {
              setEan(e.target.value);
              setError(null);
            }}
            className="h-12 text-base font-mono"
            data-testid="input-ean"
          />
          {error && (
            <p className="text-sm text-destructive" data-testid="error-ean">
              {error}
            </p>
          )}
        </div>

        {/* Search Button */}
        <Button
          type="submit"
          className="h-12 text-base font-medium mt-4"
          data-testid="button-search"
        >
          <Search className="w-5 h-5 mr-2" />
          Find Product
        </Button>

        {/* Helper Text */}
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Enter the barcode number found on the product label. Common formats include
            EAN-13 (13 digits) and UPC (12 digits).
          </p>
        </div>
      </form>
    </div>
  );
}
