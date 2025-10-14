import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, X, UserPlus } from "lucide-react";

interface GeneralSpeakersListProps {
  delegates: string[];
}

export const GeneralSpeakersList = ({ delegates }: GeneralSpeakersListProps) => {
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

  const moveSpeakerUp = (index: number) => {
    if (index > 0) {
      const newQueue = [...speakerQueue];
      [newQueue[index - 1], newQueue[index]] = [newQueue[index], newQueue[index - 1]];
      setSpeakerQueue(newQueue);
    }
  };

  const moveSpeakerDown = (index: number) => {
    if (index < speakerQueue.length - 1) {
      const newQueue = [...speakerQueue];
      [newQueue[index], newQueue[index + 1]] = [newQueue[index + 1], newQueue[index]];
      setSpeakerQueue(newQueue);
    }
  };

  const nextSpeaker = () => {
    setSpeakerQueue(speakerQueue.slice(1));
  };

  return (
    <Card className="bg-card border-2 border-primary p-6 mt-4">
      <h3 className="text-xl font-bold text-primary mb-4">GENERAL SPEAKERS LIST</h3>

      {speakerQueue.length > 0 && (
        <div className="mb-4 p-4 bg-gradient-soviet rounded border-2 border-secondary">
          <Badge className="mb-2 bg-secondary text-secondary-foreground">CURRENT SPEAKER</Badge>
          <p className="text-primary-foreground font-bold text-lg">{speakerQueue[0]}</p>
          <Button onClick={nextSpeaker} variant="secondary" className="mt-2 w-full">
            Next Speaker
          </Button>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <Select value={selectedDelegate} onValueChange={setSelectedDelegate}>
          <SelectTrigger className="bg-input border-primary">
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
        <Button onClick={addSpeaker} size="icon" variant="secondary">
          <UserPlus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {speakerQueue.slice(1).map((speaker, index) => (
          <div
            key={`${speaker}-${index}`}
            className="flex items-center justify-between p-3 bg-muted rounded border border-border"
          >
            <div className="flex items-center gap-2">
              <Badge variant="outline">{index + 2}</Badge>
              <span className="font-medium">{speaker}</span>
            </div>
            <div className="flex gap-1">
              <Button
                onClick={() => moveSpeakerUp(index + 1)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => moveSpeakerDown(index + 1)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => removeSpeaker(speaker)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {speakerQueue.length === 0 && (
        <p className="text-muted-foreground text-center py-8">
          No speakers in queue. Add comrades to begin.
        </p>
      )}
    </Card>
  );
};
