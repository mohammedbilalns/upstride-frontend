import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchBarProps {
  onSearch: (value: string) => void;
  setPage: (page: number) => void;
  initialValue?: string;
}

export default function SearchBar({
  onSearch,
  initialValue = "",
}: SearchBarProps) {
  const [input, setInput] = useState(initialValue);
  const debounced = useDebounce(input, 500);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  return (
    <div className="flex items-center mb-4">
      <Input
        placeholder="Search by name or email..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full sm:w-64"
      />
    </div>
  );
}

