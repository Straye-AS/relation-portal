"use client";

import * as React from "react";
import { format, formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn, getDueDateColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SmartDatePickerProps {
  value?: Date | undefined;
  onSelect?: (date: Date | undefined) => void;
  disabled?: boolean;
  disabledDates?: (date: Date) => boolean;
  placeholder?: string;
  className?: string;
}

export function SmartDatePicker({
  value,
  onSelect,
  disabled = false,
  disabledDates,
  placeholder = "Velg dato",
  className,
}: SmartDatePickerProps) {
  // Logic to calculate relative time text and color
  const relativeTime = value
    ? formatDistanceToNow(value, { addSuffix: true, locale: nb })
    : "";

  const colorClass = value ? getDueDateColor(value.toISOString()) : "";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            disabled={disabled}
            className={cn(
              "w-[140px] justify-start text-left font-normal", // "shorted date picker"
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
            {value ? format(value, "dd.MM.yyyy") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onSelect}
            disabled={disabledDates}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {value && (
        <span className={cn("text-sm font-medium", colorClass)}>
          {relativeTime}
        </span>
      )}
    </div>
  );
}
