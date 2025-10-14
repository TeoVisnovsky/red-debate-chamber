import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Star, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DelegateManagerProps {
  delegates: string[];
  setDelegates: (delegates: string[]) => void;
}

export const DelegateManager = ({ delegates, setDelegates }: DelegateManagerProps) => {
  const [newDelegate, setNewDelegate] = useState("");

  const addDelegate = () => {
    if (newDelegate.trim() && !delegates.includes(newDelegate.trim())) {
      setDelegates([...delegates, newDelegate.trim()]);
      setNewDelegate("");
      toast({
        title: "Comrade Added",
        description: `${newDelegate.trim()} has joined the committee.`,
      });
    }
  };

  const removeDelegate = (delegate: string) => {
    setDelegates(delegates.filter((d) => d !== delegate));
    toast({
      title: "Comrade Removed",
      description: `${delegate} has left the committee.`,
      variant: "destructive",
    });
  };

  return (
    <Card className="bg-card border-2 border-primary p-6">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-secondary fill-secondary" />
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Users className="w-6 h-6" />
          DELEGATES
        </h2>
        <Star className="w-5 h-5 text-secondary fill-secondary" />
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Add delegate/country..."
          value={newDelegate}
          onChange={(e) => setNewDelegate(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addDelegate()}
          className="bg-input border-primary"
        />
        <Button onClick={addDelegate} size="icon" variant="secondary">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {delegates.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No delegates present. Add comrades to begin.
          </p>
        ) : (
          delegates.map((delegate) => (
            <div
              key={delegate}
              className="flex items-center justify-between p-3 bg-muted rounded border border-border hover:border-primary transition-colors"
            >
              <span className="font-medium">{delegate}</span>
              <Button
                onClick={() => removeDelegate(delegate)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      {delegates.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <Badge variant="secondary" className="text-sm">
            Total: {delegates.length} delegates
          </Badge>
        </div>
      )}
    </Card>
  );
};
