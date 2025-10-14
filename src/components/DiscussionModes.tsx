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
    <Card className="bg-card border-2 border-primary p-6">
      <div className="flex items-center gap-2 mb-6">
        <Star className="w-5 h-5 text-secondary fill-secondary" />
        <h2 className="text-2xl font-bold text-primary">DISCUSSION MODE</h2>
        <Star className="w-5 h-5 text-secondary fill-secondary" />
      </div>

      {activeMode && (
        <div className="mb-4 p-4 bg-gradient-soviet rounded border-2 border-secondary">
          <Badge className="mb-2 bg-secondary text-secondary-foreground">
            ACTIVE MODE
          </Badge>
          <p className="text-primary-foreground font-bold text-lg">
            {modes.find((m) => m.id === activeMode)?.name}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;
          
          return (
            <Button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              variant={isActive ? "default" : "outline"}
              className={`h-auto p-4 flex flex-col items-start gap-2 ${
                isActive ? "border-2 border-secondary shadow-soviet" : ""
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                <Icon className="w-5 h-5" />
                <span className="font-bold text-sm">{mode.name}</span>
              </div>
              <span className="text-xs opacity-80 text-left font-normal">
                {mode.description}
              </span>
            </Button>
          );
        })}
      </div>

      {activeMode && (
        <Button
          onClick={() => setActiveMode(null)}
          variant="outline"
          className="w-full mt-4"
        >
          End Current Mode
        </Button>
      )}

      {/* Mode-specific Components */}
      {activeMode === "gsl" && <GeneralSpeakersList delegates={delegates} />}
      {activeMode === "moderated" && <ModeratedCaucus delegates={delegates} />}
      {activeMode === "unmoderated" && <UnmoderatedCaucus />}
      {activeMode === "voting" && <VotingProcedure delegates={delegates} />}
    </Card>
  );
};
