import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, Star } from "lucide-react";

export const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSetTime = () => {
    const minutes = parseInt(inputMinutes);
    if (!isNaN(minutes) && minutes > 0) {
      setSeconds(minutes * 60);
      setInputMinutes("");
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  return (
    <Card className="bg-card border-2 border-primary p-6">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-secondary fill-secondary" />
        <h2 className="text-2xl font-bold text-primary">TIMER</h2>
        <Star className="w-5 h-5 text-secondary fill-secondary" />
      </div>
      
      <div className="text-center mb-6">
        <div className="text-7xl font-bold text-primary mb-4 tracking-wider font-mono">
          {formatTime(seconds)}
        </div>
        
        <div className="flex gap-2 justify-center mb-4">
          <Input
            type="number"
            placeholder="Minutes"
            value={inputMinutes}
            onChange={(e) => setInputMinutes(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSetTime()}
            className="w-32 text-center bg-input border-primary"
          />
          <Button onClick={handleSetTime} variant="secondary" size="sm">
            SET
          </Button>
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          disabled={seconds === 0}
          className="gap-2"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" /> PAUSE
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> START
            </>
          )}
        </Button>
        <Button onClick={handleReset} variant="outline">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
