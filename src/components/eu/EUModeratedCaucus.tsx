import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, UserPlus, X } from "lucide-react";

interface ModeratedCaucusProps {
  delegates: string[];
}

export const EUModeratedCaucus = ({ delegates }: ModeratedCaucusProps) => {
  const [speakerQueue, setSpeakerQueue] = useState<string[]>([]);
  const [selectedDelegate, setSelectedDelegate] = useState("");

  const addSpeaker = () => {
    if (selectedDelegate && !speakerQueue.includes(selectedDelegate)) {
      setSpeakerQueue([...speakerQueue, selectedDelegate]);
      setSelectedDelegate("");
    }
  };

  const removeSpeaker = (speaker: string) => {
    setSpeakerQueue(speakerQueue.filter((s) => s !== speaker));
  };

  const nextSpeaker = () => {
    setSpeakerQueue(speakerQueue.slice(1));
  };

  return (
    <Card className="bg-eu-card/50 backdrop-blur-md border border-eu-primary/30 rounded-2xl p-6 mt-4 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-eu flex items-center justify-center shadow-eu">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-eu-primary to-blue-400 bg-clip-text text-transparent">
          MODERATED CAUCUS
        </h3>
      </div>

      {speakerQueue.length > 0 && (
        <div className="mb-6 p-6 bg-gradient-eu rounded-2xl shadow-eu relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
          <div className="relative">
            <Badge className="mb-3 bg-eu-accent text-eu-accent-foreground font-bold px-4 py-1 rounded-lg shadow-eu-gold">
              CURRENT SPEAKER
            </Badge>
            <p className="text-white font-bold text-2xl mb-4">{speakerQueue[0]}</p>
            <Button 
              onClick={nextSpeaker} 
              className="w-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30 rounded-xl font-semibold"
            >
              Next Speaker
            </Button>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <Select value={selectedDelegate} onValueChange={setSelectedDelegate}>
          <SelectTrigger className="bg-eu-muted/50 border-eu-primary/30 text-eu-foreground rounded-xl">
            <SelectValue placeholder="Select delegate..." />
          </SelectTrigger>
          <SelectContent>
            {delegates
              .filter((d) => !speakerQueue.includes(d))
              .map((delegate) => (
                <SelectItem key={delegate} value={delegate}>
                  {delegate}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Button 
          onClick={addSpeaker} 
          size="icon" 
          className="bg-gradient-eu-gold hover:opacity-90 text-eu-accent-foreground rounded-xl shadow-eu-gold w-12 h-12"
        >
          <UserPlus className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {speakerQueue.slice(1).map((speaker, index) => (
          <div
            key={`${speaker}-${index}`}
            className="group flex items-center justify-between p-4 bg-eu-muted/30 rounded-xl border border-eu-primary/20 hover:border-eu-primary/50 hover:bg-eu-muted/50 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-eu flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {index + 2}
              </div>
              <span className="font-semibold text-eu-foreground">{speaker}</span>
            </div>
            <Button
              onClick={() => removeSpeaker(speaker)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-blue-500/20 text-eu-muted-foreground hover:text-blue-400 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {speakerQueue.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-eu-muted/50 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-eu-primary/50" />
          </div>
          <p className="text-eu-muted-foreground text-sm">
            No speakers in queue. Add delegates to begin.
          </p>
        </div>
      )}
    </Card>
  );
};
