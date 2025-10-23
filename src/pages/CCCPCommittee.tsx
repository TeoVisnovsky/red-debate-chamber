import React, { useState, useCallback, useEffect } from "react";
import { Timer } from "@/components/Timer";
import { DelegateManager } from "@/components/DelegateManager";
import { DiscussionModes } from "@/components/DiscussionModes";
import { Star, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "cccp-delegates";

const CCCPCommittee: React.FC = () => {
  const navigate = useNavigate();
  
  // Initialize delegates from localStorage
  const [delegates, setDelegates] = useState<string[]>(() => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return [];
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Failed to load delegates:", error);
      return [];
    }
  });
  
  const [modeComponents, setModeComponents] = useState<React.ReactNode>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Save delegates to localStorage whenever they change
  useEffect(() => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(delegates));
    } catch (error) {
      console.error("Failed to save delegates:", error);
    }
  }, [delegates]);

  // Memoize timer handler to prevent unnecessary re-renders
  const handleSetTimer = useCallback((seconds: number, autoStart: boolean = false) => {
    setTimerSeconds(seconds);
    setIsTimerRunning(autoStart);
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto mb-4">
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
          className="border-2 border-primary text-primary hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Committee Selection
        </Button>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center space-y-4 py-8 border-b-4 border-primary">
          <div className="flex items-center justify-center gap-3">
            <Star className="w-8 h-8 text-secondary fill-secondary" />
            <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tight">
              THE PRESIDIUM
            </h1>
            <Star className="w-8 h-8 text-secondary fill-secondary" />
          </div>
          <p className="text-xl text-secondary font-bold tracking-wide">
            SUPREME SOVIET OF THE UNION OF SOVIET SOCIALIST REPUBLICS
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Timer and Modes */}
        <div className="lg:col-span-1 space-y-6">
          <Timer 
            seconds={timerSeconds} 
            setSeconds={setTimerSeconds}
            isRunning={isTimerRunning}
            setIsRunning={setIsTimerRunning}
          />
          <DiscussionModes delegates={delegates} onModeComponentChange={setModeComponents} onSetTimer={handleSetTimer} />
        </div>

        {/* Right Column - Delegates and Active Mode Component */}
        <div className="lg:col-span-2 space-y-6">
          <DelegateManager delegates={delegates} setDelegates={setDelegates} />
          {modeComponents}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-card border-2 border-primary rounded">
          <Star className="w-4 h-4 text-secondary fill-secondary" />
          <p className="text-sm text-muted-foreground font-bold">
            WORKERS OF THE WORLD, UNITE!
          </p>
          <Star className="w-4 h-4 text-secondary fill-secondary" />
        </div>
      </div>
    </div>
  );
};

export default CCCPCommittee;
