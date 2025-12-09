"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";

interface EditableCellProps {
  value: string | number | null | undefined;
  onSave: (value: string | number) => void;
  type?: "text" | "number" | "currency" | "percent";
  className?: string;
}

export function EditableCell({
  value,
  onSave,
  type = "text",
  className,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentValue(value ?? "");
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (currentValue !== (value ?? "")) {
      onSave(
        type === "number" || type === "currency" || type === "percent"
          ? Number(currentValue)
          : currentValue
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setCurrentValue(value ?? "");
    }
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn("h-8 w-full min-w-[100px]", className)}
        type={
          type === "number" || type === "currency" || type === "percent"
            ? "number"
            : "text"
        }
      />
    );
  }

  let displayValue = value;
  if (value !== null && value !== undefined) {
    if (type === "currency") {
      displayValue = new Intl.NumberFormat("nb-NO", {
        style: "currency",
        currency: "NOK",
        maximumFractionDigits: 0,
      }).format(Number(value));
    } else if (type === "percent") {
      displayValue = `${value}%`;
    }
  } else {
    displayValue = "-";
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={cn(
        "group flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-muted",
        className
      )}
    >
      <span className="truncate">{displayValue}</span>
      <Pencil className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-50" />
    </div>
  );
}
