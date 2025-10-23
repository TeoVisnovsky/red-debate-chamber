import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, UserPlus, X, Clock, Play, Pause, RotateCcw } from "lucide-react";

interface ModeratedCaucusProps {
  delegates: string[];
}

export const EUModeratedCaucus: React.FC<ModeratedCaucusProps> = ({ delegates }) => {
  const [speakerQueue, setSpeakerQueue] = useState<string[]>([]);
  const [selectedDelegate, setSelectedDelegate] = useState<string>("");
  
  // Total caucus timer
  const [totalTime, setTotalTime] = useState<number>(0);
  const [totalMinutes, setTotalMinutes] = useState<string>("10");
  const [isTotalRunning, setIsTotalRunning] = useState<boolean>(false);
  
  // Individual speaker timer
  const [speakerTime, setSpeakerTime] = useState<number>(0);
  const [speakerSeconds, setSpeakerSeconds] = useState<string>("60");
  const [isSpeakerRunning, setIsSpeakerRunning] = useState<boolean>(false);

  // Total caucus timer effect
  useEffect(() => {
    let interval: number;
    if (isTotalRunning && totalTime > 0) {
      interval = window.setInterval(() => {
        setTotalTime((t) => Math.max(0, t - 1));
      }, 1000);
    } else if (totalTime === 0 && isTotalRunning) {
      setIsTotalRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTotalRunning, totalTime]);

  // Individual speaker timer effect
  useEffect(() => {
    let interval: number;
    if (isSpeakerRunning && speakerTime > 0) {
      interval = window.setInterval(() => {
        setSpeakerTime((t) => Math.max(0, t - 1));
      }, 1000);
    } else if (speakerTime === 0 && isSpeakerRunning) {
      setIsSpeakerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isSpeakerRunning, speakerTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startTotalTimer = () => {
    if (totalTime === 0) {
      setTotalTime(parseInt(totalMinutes) * 60);
    }
    setIsTotalRunning(true);
  };

  const startSpeakerTimer = () => {
    setSpeakerTime(parseInt(speakerSeconds));
    setIsSpeakerRunning(true);
  };

  const resetSpeakerTimer = () => {
    setIsSpeakerRunning(false);
    setSpeakerTime(0);
  };

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
    resetSpeakerTimer();
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

      {/* Timers Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Total Caucus Timer */}
        <div className="p-4 bg-eu-muted/30 rounded-xl border border-eu-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-eu-primary" />
            <h4 className="font-bold text-eu-primary">TOTAL TIME</h4>
          </div>
          <div className="text-3xl font-bold font-mono text-center mb-3 bg-gradient-to-r from-eu-primary to-blue-400 bg-clip-text text-transparent">
            {formatTime(totalTime)}
          </div>
          <div className="flex gap-2 mb-2">
            <Input
              type="number"
              min="1"
              max="60"
              value={totalMinutes}
              onChange={(e) => setTotalMinutes(e.target.value)}
              placeholder="Minutes"
              className="text-center bg-eu-muted/50 border-eu-primary/30 text-eu-foreground rounded-lg"
              disabled={isTotalRunning || totalTime > 0}
            />
            <span className="flex items-center font-bold text-eu-foreground">MIN</span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={isTotalRunning ? () => setIsTotalRunning(false) : startTotalTimer}
              className={`flex-1 rounded-lg font-semibold ${
                isTotalRunning 
                  ? "bg-eu-muted/50 hover:bg-eu-muted text-eu-foreground border border-eu-primary/30" 
                  : "bg-gradient-eu hover:opacity-90 text-white shadow-eu"
              }`}
            >
              {isTotalRunning ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
              {isTotalRunning ? "PAUSE" : "START"}
            </Button>
            <Button
              onClick={() => {
                setIsTotalRunning(false);
                setTotalTime(0);
              }}
              variant="outline"
              size="icon"
              className="border-eu-primary/30 text-eu-primary hover:bg-eu-primary/10 rounded-lg"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Individual Speaker Timer */}
        <div className="p-4 bg-gradient-eu-gold/10 rounded-xl border border-eu-accent/30">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-eu-accent" />
            <h4 className="font-bold text-eu-accent">SPEAKER TIME</h4>
          </div>
          <div className="text-3xl font-bold font-mono text-center mb-3 text-eu-accent">
            {formatTime(speakerTime)}
          </div>
          <div className="flex gap-2 mb-2">
            <Input
              type="number"
              min="10"
              max="300"
              value={speakerSeconds}
              onChange={(e) => setSpeakerSeconds(e.target.value)}
              placeholder="Seconds"
              className="text-center bg-eu-muted/50 border-eu-accent/30 text-eu-foreground rounded-lg"
            />
            <span className="flex items-center font-bold text-eu-foreground">SEC</span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={isSpeakerRunning ? () => setIsSpeakerRunning(false) : startSpeakerTimer}
              className={`flex-1 rounded-lg font-semibold ${
                isSpeakerRunning 
                  ? "bg-eu-muted/50 hover:bg-eu-muted text-eu-foreground border border-eu-accent/30" 
                  : "bg-gradient-eu-gold hover:opacity-90 text-eu-accent-foreground shadow-eu-gold"
              }`}
            >
              {isSpeakerRunning ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
              {isSpeakerRunning ? "PAUSE" : "START"}
            </Button>
            <Button
              onClick={resetSpeakerTimer}
              variant="outline"
              size="icon"
              className="border-eu-accent/30 text-eu-accent hover:bg-eu-accent/10 rounded-lg"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
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
