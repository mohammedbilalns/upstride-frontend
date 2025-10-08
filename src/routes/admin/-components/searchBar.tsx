import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchBarProps {
	onSearch: (value: string) => void;
	setPage: (page: number) => void;
	initialValue?: string;
	placeholder: string;
}

export default function SearchBar({
	onSearch,
	initialValue = "",
	placeholder,
}: SearchBarProps) {
	const [input, setInput] = useState(initialValue);
	const debounced = useDebounce(input, 500);

	useEffect(() => {
		onSearch(debounced);
	}, [debounced, onSearch]);

	return (
		<div className="flex items-center mb-4">
			<Input
				placeholder={placeholder}
				value={input}
				onChange={(e) => setInput(e.target.value)}
				className="w-full sm:w-64"
			/>
		</div>
	);
}
