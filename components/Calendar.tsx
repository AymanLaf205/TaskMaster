"use client"

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useTodoStore } from '@/lib/store';

interface TodoCalendarProps {
  onDateSelect: (date: Date | undefined) => void;
  selectedDate?: Date;
}

export function TodoCalendar({ onDateSelect, selectedDate }: TodoCalendarProps) {
  const { language } = useTodoStore();
  const [date, setDate] = useState<Date | undefined>(selectedDate);

  // Update displayed date when selectedDate changes
  useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, 'PPP', { locale: language === 'ar' ? ar : enUS })
          ) : (
            format(new Date(), 'PPP', { locale: language === 'ar' ? ar : enUS })
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate);
            onDateSelect(newDate);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
