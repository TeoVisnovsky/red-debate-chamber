import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, X, UserPlus, Clock, Play, Pause, RotateCcw } from "lucide-react";

interface ModeratedCaucusProps {
  delegates: string[];
}

export const ModeratedCaucus: React.FC<ModeratedCaucusProps> = ({ delegates }) => {
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
    resetSpeakerTimer();
  };

  return (
    <Card className="bg-card border-2 border-primary p-6 mt-4">
      <h3 className="text-xl font-bold text-primary mb-4">MODERATED CAUCUS</h3>

      {/* Timers Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Total Caucus Timer */}
        <div className="p-4 bg-muted rounded border-2 border-primary">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-primary" />
            <h4 className="font-bold text-primary">TOTAL TIME</h4>
          </div>
          <div className="text-3xl font-bold font-mono text-center mb-3 text-primary">
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
              className="text-center"
              disabled={isTotalRunning || totalTime > 0}
            />
            <span className="flex items-center font-bold">MIN</span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={isTotalRunning ? () => setIsTotalRunning(false) : startTotalTimer}
              className="flex-1"
              variant={isTotalRunning ? "outline" : "default"}
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
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Individual Speaker Timer */}
        <div className="p-4 bg-muted rounded border-2 border-secondary">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-secondary" />
            <h4 className="font-bold text-secondary">SPEAKER TIME</h4>
          </div>
          <div className="text-3xl font-bold font-mono text-center mb-3 text-secondary">
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
              className="text-center"
            />
            <span className="flex items-center font-bold">SEC</span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={isSpeakerRunning ? () => setIsSpeakerRunning(false) : startSpeakerTimer}
              className="flex-1"
              variant={isSpeakerRunning ? "outline" : "secondary"}
            >
              {isSpeakerRunning ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
              {isSpeakerRunning ? "PAUSE" : "START"}
            </Button>
            <Button
              onClick={resetSpeakerTimer}
              variant="outline"
              size="icon"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

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
