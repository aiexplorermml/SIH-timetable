import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export type MultiSelectOption = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  disabled,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const toggleValue = (val: string) => {
    const exists = value.includes(val);
    const next = exists ? value.filter((v) => v !== val) : [...value, val];
    onChange(next);
  };

  const selectedCount = value.length;

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between"
          >
            {selectedCount > 0 ? `${selectedCount} selected` : placeholder}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[--radix-popover-trigger-width] p-0 z-50 bg-popover">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => {
                  const checked = value.includes(opt.value);
                  return (
                    <CommandItem
                      key={opt.value}
                      onSelect={() => toggleValue(opt.value)}
                      className="flex items-center gap-2"
                    >
                      <div className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm border border-input",
                        checked ? "bg-primary text-primary-foreground" : "bg-background"
                      )}>
                        {checked ? <Check className="h-3 w-3" /> : null}
                      </div>
                      <span className="truncate">{opt.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((val) => {
            const opt = options.find((o) => o.value === val);
            const label = opt?.label ?? val;
            return (
              <Badge key={val} variant="secondary" className="flex items-center gap-1">
                <span className="max-w-[200px] truncate">{label}</span>
                <button
                  type="button"
                  aria-label={`Remove ${label}`}
                  className="inline-flex h-4 w-4 items-center justify-center rounded hover:opacity-80"
                  onClick={() => toggleValue(val)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
