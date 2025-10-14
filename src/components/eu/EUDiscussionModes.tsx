import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flag, MessageSquare, Users2, Vote, ListOrdered } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EUGeneralSpeakersList } from "@/components/eu/EUGeneralSpeakersList";
import { EUModeratedCaucus } from "@/components/eu/EUModeratedCaucus";
import { EUUnmoderatedCaucus } from "@/components/eu/EUUnmoderatedCaucus";
import { EUVotingProcedure } from "@/components/eu/EUVotingProcedure";

type DiscussionMode = "gsl" | "moderated" | "unmoderated" | "voting" | null;

interface DiscussionModesProps {
  delegates: string[];
  onModeComponentChange?: (component: React.ReactNode) => void;
  onSetTimer?: (seconds: number, autoStart?: boolean) => void;
}

export const EUDiscussionModes = ({ delegates, onModeComponentChange, onSetTimer }: DiscussionModesProps) => {
  const [activeMode, setActiveMode] = useState<DiscussionMode>(null);

  useEffect(() => {
    if (onModeComponentChange) {
      if (activeMode === "gsl") {
        onModeComponentChange(<EUGeneralSpeakersList delegates={delegates} onSetTimer={onSetTimer} />);
      } else if (activeMode === "moderated") {
        onModeComponentChange(<EUModeratedCaucus delegates={delegates} />);
      } else if (activeMode === "unmoderated") {
        onModeComponentChange(<EUUnmoderatedCaucus />);
      } else if (activeMode === "voting") {
        onModeComponentChange(<EUVotingProcedure delegates={delegates} />);
      } else {
        onModeComponentChange(null);
      }
    }
  }, [activeMode, delegates, onModeComponentChange, onSetTimer]);

  const modes = [
    {
      id: "gsl" as DiscussionMode,
      name: "General Speakers List",
      icon: ListOrdered,
      description: "Formal debate with speaker queue",
    },
    {
      id: "moderated" as DiscussionMode,
      name: "Moderated Caucus",
      icon: MessageSquare,
      description: "Time-limited structured discussion",
    },
    {
      id: "unmoderated" as DiscussionMode,
      name: "Unmoderated Caucus",
      icon: Users2,
      description: "Free discussion period",
    },
    {
      id: "voting" as DiscussionMode,
      name: "Voting Procedure",
      icon: Vote,
      description: "Resolution voting session",
    },
  ];

  return (
    <>
      <Card className="bg-eu-card/50 backdrop-blur-md border border-eu-primary/30 rounded-2xl p-0 overflow-hidden shadow-lg">
        {/* Header */}
        <div className="relative p-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-eu opacity-20" />
          <div className="relative">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-eu flex items-center justify-center shadow-eu">
                <Flag className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-eu-primary to-blue-400 bg-clip-text text-transparent tracking-tight">
              DISCUSSION MODE
            </h2>
            <p className="text-center text-xs text-eu-accent font-semibold mt-1 tracking-widest">
              PARLIAMENTARY PROCEDURE
            </p>
          </div>
        </div>

        {activeMode && (
          <div className="relative p-4 mx-4 mb-4 bg-gradient-eu-gold rounded-xl shadow-eu-gold">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-eu-accent-foreground/70">ACTIVE SESSION:</p>
                <p className="text-eu-accent-foreground font-bold text-base">
                  {modes.find((m) => m.id === activeMode)?.name.toUpperCase()}
                </p>
              </div>
              <Badge className="bg-eu-primary text-white border-none font-bold px-3 py-1 rounded-lg shadow-md">
                LIVE
              </Badge>
            </div>
          </div>
        )}

        {/* Mode Options */}
        <div className="p-4 space-y-2">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            
            return (
              <Button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                variant="ghost"
                className={`h-auto w-full p-4 flex items-center justify-between gap-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-gradient-eu text-white shadow-eu hover:opacity-90" 
                    : "bg-eu-muted/30 text-eu-foreground hover:bg-eu-muted/50 border border-eu-primary/20"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl transition-all ${
                    isActive 
                      ? "bg-eu-accent/20 border-2 border-eu-accent" 
                      : "bg-eu-primary/10 border border-eu-primary/30"
                  }`}>
                    <Icon className={`w-6 h-6 ${isActive ? 'text-eu-accent' : 'text-eu-primary'}`} />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <div className={`text-sm font-bold tracking-wide truncate ${
                      isActive ? 'text-white' : 'text-eu-foreground'
                    }`}>
                      {mode.name}
                    </div>
                    <div className={`text-xs font-normal truncate ${
                      isActive ? 'text-white/80' : 'text-eu-muted-foreground'
                    }`}>
                      {mode.description}
                    </div>
                  </div>
                </div>
                {isActive && (
                  <Badge className="bg-eu-accent text-eu-accent-foreground font-bold text-xs flex-shrink-0 px-3 py-1 rounded-lg shadow-eu-gold">
                    ACTIVE
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        {activeMode && (
          <div className="p-4 pt-0">
            <Button
              onClick={() => setActiveMode(null)}
              variant="outline"
              className="w-full border border-blue-500/50 bg-blue-500/10 hover:bg-blue-500 hover:text-white text-blue-500 font-bold tracking-wide rounded-xl transition-all shadow-lg hover:shadow-blue-500/30"
            >
              ✕ END CURRENT MODE
            </Button>
          </div>
        )}
      </Card>

      {/* Mode-specific Components - Only render here if onModeComponentChange is not provided (mobile view) */}
      {!onModeComponentChange && (
        <>
          {activeMode === "gsl" && <EUGeneralSpeakersList delegates={delegates} onSetTimer={onSetTimer} />}
          {activeMode === "moderated" && <EUModeratedCaucus delegates={delegates} />}
          {activeMode === "unmoderated" && <EUUnmoderatedCaucus />}
          {activeMode === "voting" && <EUVotingProcedure delegates={delegates} />}
        </>
      )}
    </>
  );
};
