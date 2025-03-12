"use client"

import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from 'date-fns';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const [hour, minute] = (value || format(new Date(), 'HH:mm')).split(':');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-10 px-3 text-left font-normal"
        >
          <Clock className="mr-2 h-4 w-4 shrink-0" />
          <span className="text-sm">{value}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="grid grid-cols-2 gap-2 p-3">
          <div className="space-y-2">
            <div className="text-sm font-medium">Hour</div>
            <div className="h-[200px] overflow-y-auto">
              {hours.map((h) => (
                <Button
                  key={h}
                  variant={h === hour ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onChange(`${h}:${minute}`)}
                >
                  {h}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Minute</div>
            <div className="h-[200px] overflow-y-auto">
              {minutes.map((m) => (
                <Button
                  key={m}
                  variant={m === minute ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onChange(`${hour}:${m}`)}
                >
                  {m}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
