import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, X, UserPlus, GripVertical, Clock, Play } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface GeneralSpeakersListProps {
  delegates: string[];
  onSetTimer?: (seconds: number, autoStart?: boolean) => void;
}

interface SpeakerEntry {
  id: string;
  name: string;
  time: number;
}

interface SortableItemProps {
  speaker: SpeakerEntry;
  index: number;
  onRemove: (id: string) => void;
  onTimeChange: (id: string, time: number) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ speaker, index, onRemove, onTimeChange }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: speaker.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex items-center justify-between p-4 bg-eu-muted/30 rounded-xl border border-eu-primary/20 hover:border-eu-primary/50 hover:bg-eu-muted/50 transition-all"
    >
      <div className="flex items-center gap-3 flex-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="w-4 h-4 text-eu-muted-foreground hover:text-eu-primary transition-colors" />
        </div>
        <div className="w-8 h-8 rounded-lg bg-gradient-eu flex items-center justify-center text-white text-sm font-bold shadow-sm">
          {index + 2}
        </div>
        <span className="font-semibold text-eu-foreground flex-1">{speaker.name}</span>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-eu-primary" />
          <Input
            type="number"
            min="0"
            value={speaker.time}
            onChange={(e) => onTimeChange(speaker.id, parseInt(e.target.value) || 0)}
            className="w-20 h-9 text-center bg-eu-muted/50 border-eu-primary/30 text-eu-foreground rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <span className="text-sm text-eu-muted-foreground">sec</span>
        </div>
      </div>
      <Button
        onClick={() => onRemove(speaker.id)}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 ml-2 hover:bg-blue-500/20 text-eu-muted-foreground hover:text-blue-400 rounded-lg transition-all opacity-0 group-hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export const EUGeneralSpeakersList: React.FC<GeneralSpeakersListProps> = ({ delegates, onSetTimer }) => {
  const [speakerQueue, setSpeakerQueue] = useState<SpeakerEntry[]>([]);
  const [selectedDelegate, setSelectedDelegate] = useState<string>("");
  const [defaultSpeakerTime, setDefaultSpeakerTime] = useState<number>(60);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addSpeaker = () => {
    if (selectedDelegate && !speakerQueue.some(s => s.name === selectedDelegate)) {
      const newSpeaker: SpeakerEntry = {
        id: `${selectedDelegate}-${Date.now()}`,
        name: selectedDelegate,
        time: defaultSpeakerTime,
      };
      setSpeakerQueue([...speakerQueue, newSpeaker]);
      setSelectedDelegate("");
    }
  };

  const removeSpeaker = (id: string) => {
    setSpeakerQueue(speakerQueue.filter((s) => s.id !== id));
  };

  const updateSpeakerTime = (id: string, time: number) => {
    setSpeakerQueue(speakerQueue.map(s => 
      s.id === id ? { ...s, time } : s
    ));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSpeakerQueue((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        if (newIndex === 0) return items;

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const nextSpeaker = () => {
    setSpeakerQueue(speakerQueue.slice(1));
  };

  return (
    <Card className="bg-eu-card/50 backdrop-blur-md border border-eu-primary/30 rounded-2xl p-6 mt-4 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-eu flex items-center justify-center shadow-eu">
          <UserPlus className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-eu-primary to-blue-400 bg-clip-text text-transparent">
          GENERAL SPEAKERS LIST
        </h3>
      </div>

      {speakerQueue.length > 0 && (
        <div className="mb-6 p-6 bg-gradient-eu rounded-2xl shadow-eu relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
          <div className="relative">
            <Badge className="mb-3 bg-eu-accent text-eu-accent-foreground font-bold px-4 py-1 rounded-lg shadow-eu-gold">
              CURRENT SPEAKER
            </Badge>
            <div className="flex items-center justify-between text-white mb-4">
              <p className="font-bold text-2xl">{speakerQueue[0].name}</p>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                <Clock className="w-5 h-5" />
                <span className="font-bold text-lg">{speakerQueue[0].time}s</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={nextSpeaker} 
                className="flex-1 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30 rounded-xl font-semibold"
              >
                Next Speaker
              </Button>
              {onSetTimer && (
                <Button
                  onClick={() => onSetTimer(speakerQueue[0].time, true)}
                  className="flex-1 bg-eu-accent hover:opacity-90 text-eu-accent-foreground rounded-xl font-semibold shadow-eu-gold"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Timer
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 p-4 bg-eu-muted/30 rounded-xl border border-eu-primary/20">
        <Label className="text-sm font-semibold mb-2 block text-eu-foreground">Default Speaker Time</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            value={defaultSpeakerTime}
            onChange={(e) => setDefaultSpeakerTime(parseInt(e.target.value) || 60)}
            className="flex-1 bg-eu-muted/50 border-eu-primary/30 text-eu-foreground rounded-xl"
          />
          <span className="text-sm text-eu-muted-foreground font-medium">seconds</span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <Select value={selectedDelegate} onValueChange={setSelectedDelegate}>
          <SelectTrigger className="bg-eu-muted/50 border-eu-primary/30 text-eu-foreground rounded-xl">
            <SelectValue placeholder="Select delegate..." />
          </SelectTrigger>
          <SelectContent>
            {delegates
              .filter((d) => !speakerQueue.some(s => s.name === d))
              .map((delegate) => (
                <SelectItem key={delegate} value={delegate}>
                  {delegate}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Button 
          onClick={addSpeaker} 
          size="icon" 
          className="bg-gradient-eu-gold hover:opacity-90 text-eu-accent-foreground rounded-xl shadow-eu-gold w-12 h-12"
        >
          <UserPlus className="w-5 h-5" />
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          <SortableContext
            items={speakerQueue.slice(1).map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {speakerQueue.slice(1).map((speaker, index) => (
              <SortableItem
                key={speaker.id}
                speaker={speaker}
                index={index}
                onRemove={removeSpeaker}
                onTimeChange={updateSpeakerTime}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>

      {speakerQueue.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-eu-muted/50 flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-eu-primary/50" />
          </div>
          <p className="text-eu-muted-foreground text-sm">
            No speakers in queue. Add delegates to begin.
          </p>
        </div>
      )}
    </Card>
  );
};
