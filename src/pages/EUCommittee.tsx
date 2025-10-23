import React, { useState, useCallback, useEffect } from "react";
import { EUTimer } from "@/components/eu/EUTimer";
import { EUDelegateManager } from "@/components/eu/EUDelegateManager";
import { EUDiscussionModes } from "@/components/eu/EUDiscussionModes";
import { ArrowLeft, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "eu-delegates";

const EUCommittee: React.FC = () => {
  const navigate = useNavigate();
  
  // Initialize delegates from localStorage
  const [delegates, setDelegates] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
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
    <div className="min-h-screen bg-eu-background p-4 md:p-8 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-eu-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-eu-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto mb-4">
          <Button 
            onClick={() => navigate('/')}
            variant="ghost"
            className="border border-eu-primary/30 text-eu-primary hover:bg-eu-primary/10 hover:border-eu-primary backdrop-blur-sm rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Committee Selection
          </Button>
        </div>

        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="relative">
            {/* Decorative line */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-eu-primary/50 to-transparent" />
            
            <div className="relative text-center space-y-6 py-12 px-4">
              {/* EU Stars Circle */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 bg-gradient-eu rounded-full blur-xl opacity-50 animate-pulse" />
                  <div className="relative bg-gradient-to-br from-eu-primary to-blue-700 rounded-full w-32 h-32 flex items-center justify-center border-2 border-eu-accent shadow-eu">
                    {[...Array(12)].map((_, i) => {
                      const angle = (i * 30) - 90;
                      const x = 50 + 35 * Math.cos(angle * Math.PI / 180);
                      const y = 50 + 35 * Math.sin(angle * Math.PI / 180);
                      return (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-eu-accent rounded-full shadow-eu-gold"
                          style={{ 
                            left: `${x}%`, 
                            top: `${y}%`,
                            transform: 'translate(-50%, -50%)',
                            animation: `pulse 2s ease-in-out infinite`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-eu-primary via-blue-400 to-eu-primary bg-clip-text text-transparent tracking-tight mb-3">
                  EUROPEAN UNION
                </h1>
                <div className="flex items-center justify-center gap-3 text-eu-accent font-semibold text-sm md:text-base tracking-widest">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-eu-accent" />
                  <span>IN VARIETATE CONCORDIA</span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-eu-accent" />
                </div>
                <p className="text-eu-muted-foreground mt-2 text-sm">United in Diversity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Timer and Modes */}
          <div className="lg:col-span-1 space-y-6">
            <EUTimer 
              seconds={timerSeconds} 
              setSeconds={setTimerSeconds}
              isRunning={isTimerRunning}
              setIsRunning={setIsTimerRunning}
            />
            <EUDiscussionModes delegates={delegates} onModeComponentChange={setModeComponents} onSetTimer={handleSetTimer} />
          </div>

          {/* Right Column - Delegates and Active Mode Component */}
          <div className="lg:col-span-2 space-y-6">
            <EUDelegateManager delegates={delegates} setDelegates={setDelegates} />
            {modeComponents}
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-7xl mx-auto mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-eu-card/50 backdrop-blur-md border border-eu-primary/30 rounded-2xl shadow-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-eu flex items-center justify-center">
              <Flag className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm text-eu-foreground font-semibold tracking-wide">
              EUROPEAN PARLIAMENT & COUNCIL
            </p>
            <div className="w-8 h-8 rounded-full bg-gradient-eu-gold flex items-center justify-center">
              <Flag className="w-4 h-4 text-eu-accent-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EUCommittee;
