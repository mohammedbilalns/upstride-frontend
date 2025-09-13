import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchBarProps {
  onSearch: (value: string) => void;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  initialValue?: string;
}

export default function SearchBar({
  onSearch,
  setPage,
  initialValue = "",
}: SearchBarProps) {
  const [input, setInput] = useState(initialValue);
  const debounced = useDebounce(input, 500);

  useEffect(() => {
    onSearch(debounced);
    setPage(1);
  }, [debounced, onSearch, setPage]);

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

