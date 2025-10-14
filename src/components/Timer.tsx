import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, Star, Bell } from "lucide-react";
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

export const Timer = ({ seconds, setSeconds, isRunning, setIsRunning }: TimerProps) => {
  const [inputMinutes, setInputMinutes] = useState("");
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasNotifiedRef = useRef(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds - 1);
      }, 1000);
      // Reset notification flag when timer is running
      hasNotifiedRef.current = false;
      setIsBlinking(false);
    } else if (seconds === 0 && isRunning) {
      setIsRunning(false);
      
      // Only notify once when timer reaches zero
      if (!hasNotifiedRef.current) {
        hasNotifiedRef.current = true;
        setIsBlinking(true);
        setShowTimeUpDialog(true);
        
        // Show toast notification
        toast({
          title: "⏰ TIME'S UP!",
          description: "The speaking time has ended.",
          variant: "destructive",
        });

        // Play audio notification
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSt+zPDTgjMGHm7A7+OZPQ0PUJHZ8Kd+KgQiccrx0oU7Bw==');
          audio.play().catch(() => {
            // Ignore audio play errors (browser restrictions)
          });
        } catch (e) {
          // Ignore audio errors
        }

        // Stop blinking after 10 seconds
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
      <Card className={`bg-card border-2 border-primary p-6 transition-all ${
        isBlinking ? 'animate-pulse border-destructive border-4' : ''
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-secondary fill-secondary" />
          <h2 className="text-2xl font-bold text-primary">TIMER</h2>
          {isBlinking && <Bell className="w-5 h-5 text-destructive animate-bounce" />}
          <Star className="w-5 h-5 text-secondary fill-secondary" />
        </div>
        
        <div className="text-center mb-6">
          <div className={`text-7xl font-bold mb-4 tracking-wider font-mono transition-colors ${
            isBlinking ? 'text-destructive' : 'text-primary'
          }`}>
            {formatTime(seconds)}
          </div>
          {seconds === 0 && isBlinking && (
            <div className="text-destructive font-bold text-xl animate-bounce">
              ⏰ TIME'S UP! ⏰
            </div>
          )}
          
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

    <AlertDialog open={showTimeUpDialog} onOpenChange={setShowTimeUpDialog}>
      <AlertDialogContent className="border-4 border-destructive">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl flex items-center gap-2">
            <Bell className="w-6 h-6 text-destructive" />
            TIME'S UP!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-lg">
            The speaking time has ended. Please proceed to the next speaker or action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={() => setShowTimeUpDialog(false)}
            className="bg-primary hover:bg-primary/90"
          >
            Acknowledged
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
};
