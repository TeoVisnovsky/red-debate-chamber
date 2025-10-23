import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw } from "lucide-react";

export const UnmoderatedCaucus: React.FC = () => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [minutes, setMinutes] = useState<string>("5");

  useEffect(() => {
    let interval: number;
    if (isRunning && time > 0) {
      interval = window.setInterval(() => {
        setTime((t) => Math.max(0, t - 1));
      }, 1000);
    } else if (time === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    if (time === 0) {
      setTime(parseInt(minutes) * 60);
    }
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <Card className="bg-card border-2 border-primary p-6 mt-4">
      <h3 className="text-xl font-bold text-primary mb-4">UNMODERATED CAUCUS</h3>

      <div className="text-center mb-6">
        <div className="text-6xl font-bold text-primary mb-4 font-mono">
          {formatTime(time)}
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          type="number"
          min="1"
          max="60"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          placeholder="Minutes"
          className="bg-input border-primary text-center"
          disabled={isRunning || time > 0}
        />
        <span className="flex items-center text-muted-foreground font-bold">MIN</span>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={isRunning ? () => setIsRunning(false) : handleStart}
          variant={isRunning ? "secondary" : "default"}
          className="flex-1"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              PAUSE
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              START
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
