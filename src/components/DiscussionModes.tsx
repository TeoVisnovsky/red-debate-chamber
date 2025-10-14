import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare, Users2, Vote, ListOrdered } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ModeratedCaucus } from "./ModeratedCaucus";
import { UnmoderatedCaucus } from "./UnmoderatedCaucus";
import { VotingProcedure } from "./VotingProcedure";
import { GeneralSpeakersList } from "./GeneralSpeakersList";

type DiscussionMode = "gsl" | "moderated" | "unmoderated" | "voting" | null;

interface DiscussionModesProps {
  delegates: string[];
}

export const DiscussionModes = ({ delegates }: DiscussionModesProps) => {
  const [activeMode, setActiveMode] = useState<DiscussionMode>(null);

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
      <Card className="bg-card border-4 border-primary p-0 overflow-hidden">
        <div className="bg-gradient-soviet p-4 border-b-4 border-secondary">
          <div className="flex items-center justify-center gap-2">
            <Star className="w-6 h-6 text-secondary fill-secondary" />
            <h2 className="text-2xl font-black text-primary-foreground tracking-wider text-stroke">
              РЕЖИМ ОБСУЖДЕНИЯ
            </h2>
            <Star className="w-6 h-6 text-secondary fill-secondary" />
          </div>
          <p className="text-center text-sm text-secondary font-bold mt-1">
            DISCUSSION MODE
          </p>
        </div>

        {activeMode && (
          <div className="bg-secondary p-3 border-b-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-secondary-foreground/70">ACTIVE:</p>
                <p className="text-secondary-foreground font-black text-lg">
                  {modes.find((m) => m.id === activeMode)?.name.toUpperCase()}
                </p>
              </div>
              <Badge className="bg-primary text-primary-foreground border-2 border-primary-foreground font-black">
                ENGAGED
              </Badge>
            </div>
          </div>
        )}

        <div className="p-4 grid grid-cols-1 gap-0">
          {modes.map((mode, index) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            
            return (
              <div key={mode.id}>
                <Button
                  onClick={() => setActiveMode(mode.id)}
                  variant={isActive ? "default" : "ghost"}
                  className={`h-auto w-full p-4 flex items-center justify-between border-0 ${
                    isActive 
                      ? "bg-primary text-primary-foreground font-black" 
                      : "bg-transparent text-foreground hover:bg-muted font-bold"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 flex items-center justify-center border-2 ${
                      isActive ? "border-secondary bg-primary" : "border-primary bg-card"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm tracking-wider">{mode.name.toUpperCase()}</div>
                      <div className="text-xs opacity-70 font-normal">{mode.description}</div>
                    </div>
                  </div>
                  {isActive && (
                    <Badge className="bg-secondary text-secondary-foreground font-black text-xs">
                      ACTIVE
                    </Badge>
                  )}
                </Button>
                {index < modes.length - 1 && (
                  <div className="h-px bg-border" />
                )}
              </div>
            );
          })}
        </div>

        {activeMode && (
          <div className="p-4 pt-0">
            <Button
              onClick={() => setActiveMode(null)}
              variant="outline"
              className="w-full border-2 border-primary bg-muted hover:bg-destructive hover:text-destructive-foreground hover:border-destructive font-black tracking-wider"
            >
              ✕ END CURRENT MODE
            </Button>
          </div>
        )}
      </Card>

      {/* Mode-specific Components */}
      {activeMode === "gsl" && <GeneralSpeakersList delegates={delegates} />}
      {activeMode === "moderated" && <ModeratedCaucus delegates={delegates} />}
      {activeMode === "unmoderated" && <UnmoderatedCaucus />}
      {activeMode === "voting" && <VotingProcedure delegates={delegates} />}
    </>
  );
};
