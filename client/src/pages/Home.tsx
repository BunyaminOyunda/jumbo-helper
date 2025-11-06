import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Search, Wifi, WifiOff, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ScanTab } from "@/components/ScanTab";
import { FinderTab } from "@/components/FinderTab";
import { ProductCard } from "@/components/ProductCard";
import { StoreMap } from "@/components/StoreMap";
import { SearchHistory } from "@/components/SearchHistory";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Product, SearchHistory as SearchHistoryType } from "@shared/schema";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"scan" | "finder">("scan");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch search history
  const { data: searchHistory = [] } = useQuery<SearchHistoryType[]>({
    queryKey: ["/api/history"],
  });

  // Search product mutation
  const searchMutation = useMutation({
    mutationFn: async (ean: string) => {
      const response = await apiRequest("GET", `/api/products/${ean}`);
      return await response.json() as Product;
    },
    onSuccess: (product) => {
      setSelectedProduct(product);
      // Add to history
      addToHistoryMutation.mutate({
        ean: product.ean,
        productName: product.name,
        timestamp: Date.now(),
      });
    },
    onError: () => {
      toast({
        title: "Product Not Found",
        description: "No product found with this barcode. Please try another.",
        variant: "destructive",
      });
    },
  });

  // Add to history mutation
  const addToHistoryMutation = useMutation({
    mutationFn: async (historyItem: Omit<SearchHistoryType, "id">) => {
      return await apiRequest("POST", "/api/history", historyItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
    },
  });

  // Clear history mutation
  const clearHistoryMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", "/api/history");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
      toast({
        title: "History Cleared",
        description: "Search history has been cleared.",
      });
    },
  });

  const handleScan = (ean: string) => {
    searchMutation.mutate(ean);
  };

  const handleSearch = (ean: string) => {
    searchMutation.mutate(ean);
  };

  const handleShowMap = () => {
    setShowMap(true);
  };

  const handleCloseMap = () => {
    setShowMap(false);
  };

  const handleSelectHistory = (ean: string) => {
    searchMutation.mutate(ean);
  };

  const handleClearHistory = () => {
    clearHistoryMutation.mutate();
  };

  if (showMap && selectedProduct) {
    return <StoreMap product={selectedProduct} onClose={handleCloseMap} />;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="shrink-0 border-b bg-card">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-lg font-medium text-foreground">Store Finder</h1>
            <p className="text-xs text-muted-foreground">Locate products instantly</p>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <div className="flex items-center gap-1 text-xs text-muted-foreground" data-testid="status-online">
                <Wifi className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline">Online</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs text-muted-foreground" data-testid="status-offline">
                <WifiOff className="w-4 h-4 text-destructive" />
                <span className="hidden sm:inline">Offline</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "scan" | "finder")}
          className="h-full flex flex-col"
        >
          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="scan" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <ScanTab
                onScan={handleScan}
                onSwitchToFinder={() => setActiveTab("finder")}
              />
            </TabsContent>

            <TabsContent value="finder" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <FinderTab onSearch={handleSearch} />
            </TabsContent>
          </div>

          {/* Loading State */}
          {searchMutation.isPending && (
            <div className="flex items-center justify-center p-8 bg-background/95 backdrop-blur absolute inset-0 z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Searching for product...</p>
              </div>
            </div>
          )}

          {/* Product Result */}
          {selectedProduct && !searchMutation.isPending && (
            <div className="p-4 border-t bg-background overflow-y-auto max-h-[50vh]">
              <ProductCard product={selectedProduct} onShowMap={handleShowMap} />
            </div>
          )}

          {/* Search History */}
          {!selectedProduct && !searchMutation.isPending && searchHistory.length > 0 && (
            <div className="border-t bg-background overflow-y-auto max-h-[40vh]">
              <SearchHistory
                history={searchHistory}
                onSelectHistory={handleSelectHistory}
                onClearHistory={handleClearHistory}
              />
            </div>
          )}

          {/* Bottom Tab Bar */}
          <TabsList className="grid w-full grid-cols-2 h-14 rounded-none border-t shrink-0" data-testid="tab-bar">
            <TabsTrigger
              value="scan"
              className="h-full flex flex-col gap-1 text-xs uppercase font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              data-testid="tab-scan"
            >
              <Camera className="w-5 h-5" />
              <span>Scan</span>
            </TabsTrigger>
            <TabsTrigger
              value="finder"
              className="h-full flex flex-col gap-1 text-xs uppercase font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              data-testid="tab-finder"
            >
              <Search className="w-5 h-5" />
              <span>Finder</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </main>
    </div>
  );
}
