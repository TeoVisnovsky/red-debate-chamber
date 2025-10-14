import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, Flag, Bell } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TimerProps {
  seconds: number;
  setSeconds: (seconds: number) => void;
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
}

export const EUTimer = ({ seconds, setSeconds, isRunning, setIsRunning }: TimerProps) => {
  const [inputMinutes, setInputMinutes] = useState("");
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const hasNotifiedRef = useRef(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds - 1);
      }, 1000);
      hasNotifiedRef.current = false;
      setIsBlinking(false);
    } else if (seconds === 0 && isRunning) {
      setIsRunning(false);
      
      if (!hasNotifiedRef.current) {
        hasNotifiedRef.current = true;
        setIsBlinking(true);
        setShowTimeUpDialog(true);
        
        toast({
          title: "⏰ TIME'S UP!",
          description: "The speaking time has ended.",
        });

        try {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSt+zPDTgjMGHm7A7+OZPQ0PUJHZ8Kd+KgQiccrx0oU7Bw==');
          audio.play().catch(() => {});
        } catch (e) {}

        setTimeout(() => {
          setIsBlinking(false);
        }, 10000);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds, setSeconds, setIsRunning]);

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
    <>
      <Card className={`bg-eu-card/50 backdrop-blur-md border border-eu-primary/30 rounded-2xl p-6 transition-all shadow-lg hover:shadow-eu ${
        isBlinking ? 'animate-pulse !border-eu-accent !border-2 shadow-[0_0_30px_rgba(255,204,0,0.6)]' : ''
      }`}>
        {/* Header with glow effect */}
        <div className="flex items-center justify-center gap-2 mb-6 relative">
          <div className="absolute inset-0 bg-gradient-eu opacity-10 blur-xl rounded-full" />
          <div className="relative flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-eu-gold flex items-center justify-center shadow-eu-gold">
              <Flag className="w-4 h-4 text-eu-accent-foreground" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-eu-primary to-blue-400 bg-clip-text text-transparent tracking-tight">
              SESSION TIMER
            </h2>
            {isBlinking && <Bell className="w-5 h-5 text-eu-accent animate-bounce drop-shadow-[0_0_10px_rgba(255,204,0,0.8)]" />}
          </div>
        </div>
        
        {/* Timer Display */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            {/* Glow effect behind timer */}
            <div className={`absolute inset-0 blur-2xl transition-opacity ${
              isBlinking ? 'bg-eu-accent opacity-50' : 'bg-eu-primary opacity-30'
            }`} />
            
            <div className={`relative text-7xl md:text-8xl font-bold tracking-tight font-mono transition-all duration-300 ${
              isBlinking 
                ? 'text-eu-accent drop-shadow-[0_0_20px_rgba(255,204,0,0.9)]' 
                : 'bg-gradient-to-br from-eu-primary via-blue-400 to-eu-primary bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]'
            }`}>
              {formatTime(seconds)}
            </div>
          </div>
          
          {seconds === 0 && isBlinking && (
            <div className="mt-4 text-eu-accent font-bold text-lg animate-bounce drop-shadow-[0_0_10px_rgba(255,204,0,0.8)]">
              ⏰ TIME'S UP! ⏰
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="flex gap-2 justify-center mb-6">
          <Input
            type="number"
            placeholder="Minutes"
            value={inputMinutes}
            onChange={(e) => setInputMinutes(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSetTime()}
            className="w-32 text-center bg-eu-muted/50 border-eu-primary/30 text-eu-foreground rounded-xl focus:border-eu-primary focus:ring-2 focus:ring-eu-primary/20 backdrop-blur-sm"
          />
          <Button 
            onClick={handleSetTime} 
            className="bg-gradient-eu-gold hover:opacity-90 text-eu-accent-foreground font-semibold rounded-xl shadow-eu-gold"
            size="sm"
          >
            SET
          </Button>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            disabled={seconds === 0}
            className="gap-2 bg-gradient-eu hover:opacity-90 text-white font-semibold px-6 rounded-xl shadow-eu transition-all disabled:opacity-50"
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
          <Button 
            onClick={handleReset} 
            className="border-eu-primary/30 text-eu-primary hover:bg-eu-primary/10 bg-eu-muted/30 backdrop-blur-sm rounded-xl"
            variant="outline"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      <AlertDialog open={showTimeUpDialog} onOpenChange={setShowTimeUpDialog}>
        <AlertDialogContent className="border-4 border-eu-accent shadow-[0_0_30px_rgba(255,204,0,0.4)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl flex items-center gap-2">
              <Bell className="w-6 h-6 text-eu-accent drop-shadow-[0_0_10px_rgba(255,204,0,0.8)]" />
              TIME'S UP!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              The speaking time has ended. Please proceed to the next speaker or action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setShowTimeUpDialog(false)}
              className="bg-eu-primary hover:bg-eu-primary/90"
            >
              Acknowledged
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
