"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2, Edit2 } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface InlineEditProps {
  value: string | number;
  onSave: (value: string | number) => Promise<void>;
  type?: "text" | "number" | "currency" | "percent" | "email" | "tel";
  className?: string;
  label?: string;
  placeholder?: string;
  editClassName?: string;
}

export function InlineEdit({
  value: initialValue,
  onSave,
  type = "text",
  className,
  label,
  placeholder,
  editClassName,
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (value === initialValue) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await onSave(value);
      setIsEditing(false);
    } catch (error) {
      // Error is handled by parent or toast in hook
      // Reset value to initial if failed? Or keep modification?
      // Usually keep modification to allow retry, but here we just reset editing state on success
      // If error, we stay in editing mode?
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div
        className={cn(
          "flex w-full items-center gap-2",
          className,
          editClassName
        )}
      >
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            const val =
              type === "number" || type === "currency" || type === "percent"
                ? parseFloat(e.target.value) || 0
                : e.target.value;
            // Handle empty string for number?
            if (
              (type === "number" ||
                type === "currency" ||
                type === "percent") &&
              e.target.value === ""
            ) {
              setValue("");
            } else {
              setValue(val);
            }
          }}
          type={
            type === "number" || type === "currency" || type === "percent"
              ? "number"
              : type
          }
          disabled={isLoading}
          onKeyDown={handleKeyDown}
          className="h-7 min-w-0 flex-1 text-sm"
        />
        <div className="flex shrink-0 items-center">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-green-600 hover:bg-green-100 hover:text-green-700"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-red-600 hover:bg-red-100 hover:text-red-700"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const displayValue = () => {
    if (value === null || value === undefined || value === "") return "-";
    if (type === "currency") return formatCurrency(Number(value));
    if (type === "percent") return `${value}%`;
    return value;
  };

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={cn(
        "group -ml-2 flex cursor-pointer items-center gap-2 rounded border border-transparent px-2 py-1 transition-colors hover:border-border hover:bg-muted/50",
        className
      )}
    >
      <span
        className={cn("truncate", !value && "italic text-muted-foreground")}
      >
        {displayValue() !== "-"
          ? displayValue()
          : placeholder ||
            (label ? `Sett ${label.toLowerCase()}` : "Klikk for å redigere")}
      </span>
      <Edit2 className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-50" />
    </div>
  );
}
