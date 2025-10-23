import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, Users2 } from "lucide-react";

export const EUUnmoderatedCaucus: React.FC = () => {
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
    <Card className="bg-eu-card/50 backdrop-blur-md border border-eu-primary/30 rounded-2xl p-6 mt-4 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-eu flex items-center justify-center shadow-eu">
          <Users2 className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-eu-primary to-blue-400 bg-clip-text text-transparent">
          UNMODERATED CAUCUS
        </h3>
      </div>

      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-eu-primary blur-2xl opacity-30" />
          <div className="relative text-6xl md:text-7xl font-bold tracking-tight font-mono bg-gradient-to-br from-eu-primary via-blue-400 to-eu-primary bg-clip-text text-transparent">
            {formatTime(time)}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-6 items-center">
        <Input
          type="number"
          min="1"
          max="60"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          placeholder="Minutes"
          className="flex-1 text-center bg-eu-muted/50 border-eu-primary/30 text-eu-foreground rounded-xl text-lg font-semibold"
          disabled={isRunning || time > 0}
        />
        <span className="text-eu-muted-foreground font-bold">MIN</span>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={isRunning ? () => setIsRunning(false) : handleStart}
          className={`flex-1 gap-2 font-semibold rounded-xl shadow-lg ${
            isRunning 
              ? "bg-eu-muted/50 hover:bg-eu-muted text-eu-foreground border border-eu-primary/30" 
              : "bg-gradient-eu hover:opacity-90 text-white"
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              PAUSE
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              START
            </>
          )}
        </Button>
        <Button
          onClick={handleReset}
          className="border-eu-primary/30 text-eu-primary hover:bg-eu-primary/10 bg-eu-muted/30 backdrop-blur-sm rounded-xl px-6"
          variant="outline"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      <div className="mt-6 p-4 bg-eu-muted/30 rounded-xl border border-eu-primary/20">
        <p className="text-sm text-eu-muted-foreground text-center">
          Free discussion period - delegates may freely converse
        </p>
      </div>
    </Card>
  );
};
