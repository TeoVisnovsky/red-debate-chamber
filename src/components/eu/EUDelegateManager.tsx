import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus, X, Flag, Users, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DelegateManagerProps {
  delegates: string[];
  setDelegates: (delegates: string[]) => void;
}

export const EUDelegateManager: React.FC<DelegateManagerProps> = ({ delegates, setDelegates }) => {
  const [newDelegate, setNewDelegate] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const addDelegate = () => {
    if (newDelegate.trim() && !delegates.includes(newDelegate.trim())) {
      setDelegates([...delegates, newDelegate.trim()]);
      setNewDelegate("");
      toast({
        title: "Member State Added",
        description: `${newDelegate.trim()} has joined the delegation.`,
      });
    }
  };

  const removeDelegate = (delegate: string) => {
    setDelegates(delegates.filter((d) => d !== delegate));
    toast({
      title: "Member State Removed",
      description: `${delegate} has left the delegation.`,
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-eu-card/50 backdrop-blur-md border border-eu-primary/30 rounded-2xl p-6 shadow-lg">
        <CollapsibleTrigger asChild>
          <div className="flex items-center gap-3 mb-4 cursor-pointer hover:opacity-80 transition-all group">
            <div className="w-10 h-10 rounded-full bg-gradient-eu flex items-center justify-center shadow-eu group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-eu-primary to-blue-400 bg-clip-text text-transparent flex items-center gap-2 flex-1">
              MEMBER STATES
            </h2>
            <Badge className="text-sm bg-gradient-eu-gold text-eu-accent-foreground font-bold px-3 py-1 rounded-lg shadow-eu-gold">
              {delegates.length}
            </Badge>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-eu-primary transition-transform group-hover:scale-110" />
            ) : (
              <ChevronDown className="w-5 h-5 text-eu-primary transition-transform group-hover:scale-110" />
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          {/* Add Member State Input */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Input
                placeholder="Add member state..."
                value={newDelegate}
                onChange={(e) => setNewDelegate(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addDelegate()}
                className="bg-eu-muted/50 border-eu-primary/30 text-eu-foreground rounded-xl focus:border-eu-primary focus:ring-2 focus:ring-eu-primary/20 backdrop-blur-sm pl-4"
              />
            </div>
            <Button 
              onClick={addDelegate} 
              size="icon" 
              className="bg-gradient-eu-gold hover:opacity-90 text-eu-accent-foreground rounded-xl shadow-eu-gold transition-all w-12 h-12"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {/* Member States List */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {delegates.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-eu-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Flag className="w-8 h-8 text-eu-primary/50" />
                </div>
                <p className="text-eu-muted-foreground text-sm">
                  No member states present. Add delegations to begin.
                </p>
              </div>
            ) : (
              delegates.map((delegate, index) => (
                <div
                  key={delegate}
                  className="group flex items-center justify-between p-4 bg-eu-muted/30 rounded-xl border border-eu-primary/20 hover:border-eu-primary/50 hover:bg-eu-muted/50 transition-all"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-eu flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-eu-foreground">{delegate}</span>
                  </div>
                  <Button
                    onClick={() => removeDelegate(delegate)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-blue-500/20 text-eu-muted-foreground hover:text-blue-400 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          {delegates.length > 0 && (
            <div className="mt-4 pt-4 border-t border-eu-primary/20 flex items-center justify-between">
              <Badge className="text-sm bg-gradient-eu text-white font-semibold px-4 py-2 rounded-lg shadow-eu">
                Total: {delegates.length} member states
              </Badge>
              <div className="flex gap-1">
                {[...Array(Math.min(5, delegates.length))].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-eu-accent animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
