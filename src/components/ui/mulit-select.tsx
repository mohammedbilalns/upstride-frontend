import * as React from "react";
import {
  Command,
  CommandList,
  CommandInput,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  value: Option[];
  onChange: (opts: Option[]) => void;
  placeholder?: string;
  creatable?: boolean;
  onCreate?: (newValue: string) => Option;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
  creatable,
  onCreate,
}: MultiSelectProps) {
  const [input, setInput] = React.useState("");

  // Case-insensitive normalization for comparisons only
  const normalize = (val: string) => val.trim().toLowerCase();

  const selectedValues = value.map((v) => normalize(v.value));

  const available = options.filter(
    (o) => !selectedValues.includes(normalize(o.value)),
  );

  const filtered = input
    ? available.filter((o) =>
        o.label.toLowerCase().includes(input.toLowerCase().trim()),
      )
    : available;

  const addItem = (o: Option) => {
    const normalized = normalize(o.value);
    if (!value.find((v) => normalize(v.value) === normalized)) {
      // keep original casing
      onChange([...value, o]);
    }
  };

  const removeItem = (val: string) =>
    onChange(value.filter((v) => normalize(v.value) !== normalize(val)));

  const handleCreate = () => {
    if (input.trim().length === 0) return;
    const newOpt = onCreate
      ? onCreate(input.trim())
      : { label: input.trim(), value: input.trim() };

    const normalized = normalize(newOpt.value);
    if (!value.find((v) => normalize(v.value) === normalized)) {
      addItem(newOpt);
    }
    setInput("");
  };

  return (
    <div className="space-y-2">
      {/* Selected chips above */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((v) => (
            <Badge key={v.value}>
              {v.label}
              <button
                type="button"
                className="ml-1"
                onClick={() => removeItem(v.value)}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input + dropdown */}
      <div className="border border-input rounded px-2 py-1">
        <Command className="w-full">
          <CommandInput
            value={input}
            onValueChange={setInput}
            placeholder={placeholder}
            className="border-none bg-transparent focus:ring-0"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCreate();
              }
            }}
          />
          <CommandList>
            {filtered.length > 0 ? (
              filtered.map((o) => (
                <CommandItem
                  key={o.value}
                  onSelect={() => {
                    addItem(o);
                    setInput("");
                  }}
                >
                  {o.label}
                </CommandItem>
              ))
            ) : creatable && input ? (
              <CommandItem
                key="__create__"
                onSelect={handleCreate}
                className="text-muted-foreground"
              >
                Create “{input}”
              </CommandItem>
            ) : (
              !creatable && <CommandEmpty>No results.</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </div>
    </div>
  );
}
