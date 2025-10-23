import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, Minus, Vote, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VotingProcedureProps {
  delegates: string[];
}

interface Motion {
  id: string;
  title: string;
  description: string;
  status: "voting" | "passed" | "failed";
  votes: Record<string, "favor" | "against" | "abstain" | null>;
}

export const EUVotingProcedure: React.FC<VotingProcedureProps> = ({ delegates }) => {
  const [motions, setMotions] = useState<Motion[]>([]);
  const [newMotionTitle, setNewMotionTitle] = useState("");
  const [newMotionDesc, setNewMotionDesc] = useState("");
  const [activeMotion, setActiveMotion] = useState<string | null>(null);

  const createMotion = () => {
    if (!newMotionTitle.trim()) return;

    const motion: Motion = {
      id: Date.now().toString(),
      title: newMotionTitle,
      description: newMotionDesc,
      status: "voting",
      votes: delegates.reduce((acc, d) => ({ ...acc, [d]: null }), {}),
    };

    setMotions([motion, ...motions]);
    setActiveMotion(motion.id);
    setNewMotionTitle("");
    setNewMotionDesc("");
    toast({
      title: "Motion Created",
      description: `${newMotionTitle} is now open for voting.`,
    });
  };

  const vote = (motionId: string, delegate: string, voteType: "favor" | "against" | "abstain") => {
    setMotions(
      motions.map((m) =>
        m.id === motionId
          ? { ...m, votes: { ...m.votes, [delegate]: voteType } }
          : m
      )
    );
  };

  const resolveMotion = (motionId: string, passed: boolean) => {
    setMotions(
      motions.map((m) =>
        m.id === motionId ? { ...m, status: passed ? "passed" : "failed" } : m
      )
    );
    setActiveMotion(null);
    toast({
      title: passed ? "Motion Passed" : "Motion Failed",
      description: passed ? "The motion has been approved." : "The motion has been rejected.",
    });
  };

  const getVoteCounts = (motion: Motion) => {
    const favor = Object.values(motion.votes).filter((v) => v === "favor").length;
    const against = Object.values(motion.votes).filter((v) => v === "against").length;
    const abstain = Object.values(motion.votes).filter((v) => v === "abstain").length;
    return { favor, against, abstain };
  };

  const activeMotionData = motions.find((m) => m.id === activeMotion);

  return (
    <Card className="bg-eu-card/50 backdrop-blur-md border border-eu-primary/30 rounded-2xl p-6 mt-4 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-eu flex items-center justify-center shadow-eu">
          <Vote className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-eu-primary to-blue-400 bg-clip-text text-transparent">
          VOTING PROCEDURE
        </h3>
      </div>

      {/* Create Motion */}
      <div className="mb-6 p-5 bg-eu-muted/30 rounded-xl border border-eu-primary/20">
        <h4 className="font-bold text-eu-primary mb-3 text-lg">CREATE NEW MOTION</h4>
        <Input
          placeholder="Motion title..."
          value={newMotionTitle}
          onChange={(e) => setNewMotionTitle(e.target.value)}
          className="mb-3 bg-eu-muted/50 border-eu-primary/30 text-eu-foreground rounded-xl"
        />
        <Textarea
          placeholder="Motion description (optional)..."
          value={newMotionDesc}
          onChange={(e) => setNewMotionDesc(e.target.value)}
          className="mb-3 bg-eu-muted/50 border-eu-primary/30 text-eu-foreground rounded-xl"
          rows={2}
        />
        <Button 
          onClick={createMotion} 
          className="w-full bg-gradient-eu-gold hover:opacity-90 text-eu-accent-foreground font-semibold rounded-xl shadow-eu-gold"
        >
          Generate Motion
        </Button>
      </div>

      {/* Active Motion Voting */}
      {activeMotionData && (
        <div className="mb-6 p-6 bg-gradient-eu rounded-2xl shadow-eu relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
          <div className="relative">
            <Badge className="mb-3 bg-eu-accent text-eu-accent-foreground font-bold px-4 py-1 rounded-lg shadow-eu-gold">
              ACTIVE VOTE
            </Badge>
            <h4 className="text-xl font-bold text-white mb-2">
              {activeMotionData.title}
            </h4>
            {activeMotionData.description && (
              <p className="text-sm text-white/90 mb-5 leading-relaxed">
                {activeMotionData.description}
              </p>
            )}

            <div className="space-y-2 mb-5 max-h-64 overflow-y-auto custom-scrollbar pr-2">
              {delegates.map((delegate) => (
                <div
                  key={delegate}
                  className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                >
                  <span className="font-semibold text-white">{delegate}</span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => vote(activeMotionData.id, delegate, "favor")}
                      className={`h-9 px-4 rounded-lg font-semibold transition-all ${
                        activeMotionData.votes[delegate] === "favor"
                          ? "bg-eu-accent text-eu-accent-foreground shadow-eu-gold"
                          : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                      }`}
                      size="sm"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => vote(activeMotionData.id, delegate, "against")}
                      className={`h-9 px-4 rounded-lg font-semibold transition-all ${
                        activeMotionData.votes[delegate] === "against"
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/50"
                          : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                      }`}
                      size="sm"
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => vote(activeMotionData.id, delegate, "abstain")}
                      className={`h-9 px-4 rounded-lg font-semibold transition-all ${
                        activeMotionData.votes[delegate] === "abstain"
                          ? "bg-gray-500 text-white shadow-lg"
                          : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                      }`}
                      size="sm"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mb-4">
              <Badge className="bg-eu-accent text-eu-accent-foreground font-bold px-4 py-2 rounded-lg text-base shadow-eu-gold">
                In Favor: {getVoteCounts(activeMotionData).favor}
              </Badge>
              <Badge className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg text-base shadow-lg shadow-indigo-500/50">
                Against: {getVoteCounts(activeMotionData).against}
              </Badge>
              <Badge className="bg-gray-500 text-white font-bold px-4 py-2 rounded-lg text-base shadow-lg">
                Abstain: {getVoteCounts(activeMotionData).abstain}
              </Badge>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => resolveMotion(activeMotionData.id, true)}
                className="flex-1 gap-2 bg-eu-accent hover:opacity-90 text-eu-accent-foreground font-bold rounded-xl shadow-eu-gold"
              >
                <CheckCircle className="w-5 h-5" />
                PASS MOTION
              </Button>
              <Button
                onClick={() => resolveMotion(activeMotionData.id, false)}
                className="flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/50"
              >
                <XCircle className="w-5 h-5" />
                FAIL MOTION
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Motion History */}
      <div className="space-y-2">
        <h4 className="font-bold text-eu-primary mb-3 text-lg">MOTION HISTORY</h4>
        {motions.filter(m => m.status !== "voting").length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-eu-muted/50 flex items-center justify-center mx-auto mb-4">
              <Vote className="w-8 h-8 text-eu-primary/50" />
            </div>
            <p className="text-eu-muted-foreground text-sm">
              No resolved motions yet.
            </p>
          </div>
        ) : (
          motions
            .filter((m) => m.status !== "voting")
            .map((motion) => {
              const counts = getVoteCounts(motion);
              return (
                <div
                  key={motion.id}
                  className="p-4 bg-eu-muted/30 rounded-xl border border-eu-primary/20 hover:border-eu-primary/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-eu-foreground mb-2">{motion.title}</p>
                      <div className="flex gap-2">
                        <Badge className="bg-eu-accent/20 text-eu-accent border border-eu-accent/30 font-semibold px-3 py-1 rounded-lg text-xs">
                          {counts.favor} In Favor
                        </Badge>
                        <Badge className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-semibold px-3 py-1 rounded-lg text-xs">
                          {counts.against} Against
                        </Badge>
                        <Badge className="bg-gray-500/20 text-gray-400 border border-gray-500/30 font-semibold px-3 py-1 rounded-lg text-xs">
                          {counts.abstain} Abstain
                        </Badge>
                      </div>
                    </div>
                    <Badge
                      className={`font-bold px-4 py-1 rounded-lg ${
                        motion.status === "passed"
                          ? "bg-gradient-eu-gold text-eu-accent-foreground shadow-eu-gold"
                          : "bg-indigo-600 text-white shadow-lg shadow-indigo-500/50"
                      }`}
                    >
                      {motion.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              );
            })
        )}
      </div>
    </Card>
  );
};
