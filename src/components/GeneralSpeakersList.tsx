import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, X, UserPlus, GripVertical, Clock } from "lucide-react";
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
      className="flex items-center justify-between p-3 bg-muted rounded border border-border hover:border-primary transition-colors"
    >
      <div className="flex items-center gap-2 flex-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
        <Badge variant="outline">{index + 2}</Badge>
        <span className="font-medium flex-1">{speaker.name}</span>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <Input
            type="number"
            min="0"
            value={speaker.time}
            onChange={(e) => onTimeChange(speaker.id, parseInt(e.target.value) || 0)}
            className="w-20 h-8 text-center"
            onClick={(e) => e.stopPropagation()}
          />
          <span className="text-sm text-muted-foreground">sec</span>
        </div>
      </div>
      <Button
        onClick={() => onRemove(speaker.id)}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 ml-2"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export const GeneralSpeakersList: React.FC<GeneralSpeakersListProps> = ({ delegates, onSetTimer }) => {
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

        // Don't allow dragging before the current speaker
        if (newIndex === 0) return items;

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const nextSpeaker = () => {
    setSpeakerQueue(speakerQueue.slice(1));
  };

  return (
    <Card className="bg-card border-2 border-primary p-6 mt-4">
      <h3 className="text-xl font-bold text-primary mb-4">GENERAL SPEAKERS LIST</h3>

      {speakerQueue.length > 0 && (
        <div className="mb-4 p-4 bg-gradient-soviet rounded border-2 border-secondary">
          <Badge className="mb-2 bg-secondary text-secondary-foreground">CURRENT SPEAKER</Badge>
          <div className="flex items-center justify-between text-primary-foreground mb-2">
            <p className="font-bold text-lg">{speakerQueue[0].name}</p>
            <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1 rounded">
              <Clock className="w-4 h-4" />
              <span className="font-bold">{speakerQueue[0].time}s</span>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Button 
              onClick={nextSpeaker} 
              variant="secondary" 
              className="flex-1"
            >
              Next Speaker
            </Button>
            {onSetTimer && (
              <Button
                onClick={() => onSetTimer(speakerQueue[0].time, true)}
                variant="outline"
                className="flex-1 border-secondary text-primary-foreground hover:bg-secondary/20"
              >
                <Clock className="w-4 h-4 mr-2" />
                Start Timer
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="mb-4 p-3 bg-muted rounded border border-border">
        <Label className="text-sm font-bold mb-2 block">Default Speaker Time</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            value={defaultSpeakerTime}
            onChange={(e) => setDefaultSpeakerTime(parseInt(e.target.value) || 60)}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground">seconds</span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <Select value={selectedDelegate} onValueChange={setSelectedDelegate}>
          <SelectTrigger className="bg-input border-primary">
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
        <Button onClick={addSpeaker} size="icon" variant="secondary">
          <UserPlus className="w-4 h-4" />
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-2 max-h-64 overflow-y-auto">
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
        <p className="text-muted-foreground text-center py-8">
          No speakers in queue. Add comrades to begin.
        </p>
      )}
    </Card>
  );
};
