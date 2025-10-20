import { useFormContext } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PersonalInfoProps {
	email: string;
	phone: string;
	isEditing: boolean;
}

export function PersonalInfo({ email, phone, isEditing }: PersonalInfoProps) {
	const form = useFormContext();

	return (
		<div>
			<h3 className="text-lg font-medium mb-4">Personal Information</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input {...field} disabled={!isEditing} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div>
					<FormLabel>Email</FormLabel>
					<Input
						className="mt-2"
						value={email || ""}
						type="email"
						disabled={true}
					/>
				</div>
				<div>
					<FormLabel>Phone</FormLabel>
					<Input className="mt-2" value={phone || ""} disabled={true} />
				</div>
			</div>
		</div>
	);
}
