import { History, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SearchHistory as SearchHistoryType } from "@shared/schema";

interface SearchHistoryProps {
  history: SearchHistoryType[];
  onSelectHistory: (ean: string) => void;
  onClearHistory: () => void;
}

export function SearchHistory({ history, onSelectHistory, onClearHistory }: SearchHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No search history yet</p>
        <p className="text-xs mt-1">Your scanned products will appear here</p>
      </div>
    );
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Recent Searches
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearHistory}
          className="h-8"
          data-testid="button-clear-history"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="space-y-2">
        {history.map((item) => (
          <Card
            key={item.id}
            className="p-3 hover-elevate active-elevate-2 cursor-pointer"
            onClick={() => onSelectHistory(item.ean)}
            data-testid={`history-item-${item.id}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {item.productName}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  {item.ean}
                </p>
              </div>
              <div className="text-xs text-muted-foreground shrink-0">
                {formatTimestamp(item.timestamp)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
