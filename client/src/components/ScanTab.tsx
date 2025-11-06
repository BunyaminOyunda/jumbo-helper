import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ScanTabProps {
  onScan: (ean: string) => void;
  onSwitchToFinder: () => void;
}

export function ScanTab({ onScan, onSwitchToFinder }: ScanTabProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [isScanning]);

  const startScanning = async () => {
    try {
      setError(null);
      const scanner = new Html5Qrcode("barcode-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          if (mountedRef.current) {
            onScan(decodedText);
            scanner.stop().catch(console.error);
            setIsScanning(false);
          }
        },
        () => {
          // Error callback - ignore scan failures
        }
      );

      if (mountedRef.current) {
        setIsScanning(true);
        setHasPermission(true);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError("Camera access denied. Please enable camera permissions.");
        setHasPermission(false);
        setIsScanning(false);
      }
    }
  };

  const stopScanning = () => {
    if (scannerRef.current && isScanning) {
      scannerRef.current.stop().then(() => {
        if (mountedRef.current) {
          setIsScanning(false);
        }
      }).catch(console.error);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* Camera Viewfinder */}
      <div className="relative">
        <div
          id="barcode-reader"
          className={`w-full rounded-lg overflow-hidden ${
            isScanning ? "aspect-video" : "aspect-video bg-muted flex items-center justify-center"
          }`}
          data-testid="camera-viewfinder"
        >
          {!isScanning && (
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <Camera className="w-16 h-16 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {hasPermission === false
                  ? "Camera access required to scan barcodes"
                  : "Tap Start Scanning to locate products"}
              </p>
            </div>
          )}
        </div>

        {isScanning && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-primary rounded-lg animate-pulse" />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" data-testid="error-message">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Scan Instructions */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {isScanning
            ? "Point camera at barcode to scan automatically"
            : "Position the barcode within the camera frame"}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mt-auto">
        {!isScanning ? (
          <Button
            onClick={startScanning}
            className="h-12 text-base font-medium"
            data-testid="button-start-scanning"
          >
            <Camera className="w-5 h-5 mr-2" />
            Start Scanning
          </Button>
        ) : (
          <Button
            onClick={stopScanning}
            variant="outline"
            className="h-12 text-base font-medium"
            data-testid="button-stop-scanning"
          >
            Stop Scanning
          </Button>
        )}

        <button
          onClick={onSwitchToFinder}
          className="text-sm text-primary hover-elevate active-elevate-2 h-12 rounded-md"
          data-testid="link-manual-entry"
        >
          Enter code manually
        </button>
      </div>
    </div>
  );
}
