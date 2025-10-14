import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, FileText, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VotingProcedureProps {
  delegates: string[];
}

interface Motion {
  id: string;
  title: string;
  description: string;
  status: "voting" | "passed" | "failed";
  votes: { [delegate: string]: "favor" | "against" | null };
}

export const VotingProcedure = ({ delegates }: VotingProcedureProps) => {
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

  const vote = (motionId: string, delegate: string, voteType: "favor" | "against") => {
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
      variant: passed ? "default" : "destructive",
    });
  };

  const getVoteCounts = (motion: Motion) => {
    const favor = Object.values(motion.votes).filter((v) => v === "favor").length;
    const against = Object.values(motion.votes).filter((v) => v === "against").length;
    return { favor, against };
  };

  const activeMotionData = motions.find((m) => m.id === activeMotion);

  return (
    <Card className="bg-card border-2 border-primary p-6 mt-4">
      <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        VOTING PROCEDURE
      </h3>

      {/* Create Motion */}
      <div className="mb-6 p-4 bg-muted rounded border border-border">
        <h4 className="font-bold text-primary mb-3">CREATE NEW MOTION</h4>
        <Input
          placeholder="Motion title..."
          value={newMotionTitle}
          onChange={(e) => setNewMotionTitle(e.target.value)}
          className="mb-2 bg-input border-primary"
        />
        <Textarea
          placeholder="Motion description (optional)..."
          value={newMotionDesc}
          onChange={(e) => setNewMotionDesc(e.target.value)}
          className="mb-2 bg-input border-primary"
          rows={2}
        />
        <Button onClick={createMotion} variant="secondary" className="w-full">
          Generate Motion
        </Button>
      </div>

      {/* Active Motion Voting */}
      {activeMotionData && (
        <div className="mb-6 p-4 bg-gradient-soviet rounded border-2 border-secondary">
          <Badge className="mb-2 bg-secondary text-secondary-foreground">ACTIVE VOTE</Badge>
          <h4 className="text-lg font-bold text-primary-foreground mb-2">
            {activeMotionData.title}
          </h4>
          {activeMotionData.description && (
            <p className="text-sm text-primary-foreground/80 mb-4">
              {activeMotionData.description}
            </p>
          )}

          <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
            {delegates.map((delegate) => (
              <div
                key={delegate}
                className="flex items-center justify-between p-2 bg-card/50 rounded"
              >
                <span className="font-medium text-primary-foreground">{delegate}</span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => vote(activeMotionData.id, delegate, "favor")}
                    variant={
                      activeMotionData.votes[delegate] === "favor" ? "default" : "outline"
                    }
                    size="sm"
                    className="h-8"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => vote(activeMotionData.id, delegate, "against")}
                    variant={
                      activeMotionData.votes[delegate] === "against" ? "destructive" : "outline"
                    }
                    size="sm"
                    className="h-8"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-3">
            <Badge variant="secondary">
              In Favor: {getVoteCounts(activeMotionData).favor}
            </Badge>
            <Badge variant="destructive">
              Against: {getVoteCounts(activeMotionData).against}
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => resolveMotion(activeMotionData.id, true)}
              variant="default"
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4" />
              PASS
            </Button>
            <Button
              onClick={() => resolveMotion(activeMotionData.id, false)}
              variant="destructive"
              className="flex-1"
            >
              <XCircle className="w-4 h-4" />
              FAIL
            </Button>
          </div>
        </div>
      )}

      {/* Motion History */}
      <div className="space-y-2">
        <h4 className="font-bold text-primary mb-2">MOTION HISTORY</h4>
        {motions.filter(m => m.status !== "voting").length === 0 ? (
          <p className="text-muted-foreground text-center py-4 text-sm">
            No resolved motions yet.
          </p>
        ) : (
          motions
            .filter((m) => m.status !== "voting")
            .map((motion) => {
              const counts = getVoteCounts(motion);
              return (
                <div
                  key={motion.id}
                  className="p-3 bg-muted rounded border border-border"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{motion.title}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {counts.favor} - {counts.against}
                        </Badge>
                      </div>
                    </div>
                    <Badge
                      variant={motion.status === "passed" ? "default" : "destructive"}
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
