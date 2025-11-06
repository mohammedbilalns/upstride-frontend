import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useChangePassword } from "../hooks/profile.hooks";
import { type PasswordFormData , passwordSchema } from "../schemas/profile.schema";
interface ChangePasswordFormProps {
	onSuccess?: () => void;
}
export function ChangePasswordForm({ onSuccess }: ChangePasswordFormProps) {
	const updatePasswordMutation = useChangePassword();
	const [showPasswords, setShowPasswords] = useState({
		old: false,
		new: false,
		confirm: false,
	});

	const form = useForm<PasswordFormData>({
		resolver: zodResolver(passwordSchema),
		defaultValues: {
			oldPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	const onSubmit = (data: PasswordFormData) => {
		updatePasswordMutation.mutate(
			{
				oldPassword: data.oldPassword,
				newPassword: data.newPassword,
			},
			{
				onSuccess: () => {
					form.reset();
					onSuccess?.();
				},
			},
		);
	};

	const togglePasswordVisibility = (field: "old" | "new" | "confirm") => {
		setShowPasswords((prev) => ({
			...prev,
			[field]: !prev[field],
		}));
	};

	return (
		<div className="mt-4 p-4 border rounded-lg bg-muted/30">
			<h4 className="font-medium mb-4">Change Password</h4>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="oldPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Current Password</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											{...field}
											type={showPasswords.old ? "text" : "password"}
											placeholder="Enter current password"
											disabled={updatePasswordMutation.isPending}
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
											onClick={() => togglePasswordVisibility("old")}
										>
											{showPasswords.old ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</Button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="newPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>New Password</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											{...field}
											type={showPasswords.new ? "text" : "password"}
											placeholder="Enter new password"
											disabled={updatePasswordMutation.isPending}
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
											onClick={() => togglePasswordVisibility("new")}
										>
											{showPasswords.new ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</Button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm New Password</FormLabel>
								<FormControl>
									<div className="relative">
										<Input
											{...field}
											type={showPasswords.confirm ? "text" : "password"}
											placeholder="Confirm new password"
											disabled={updatePasswordMutation.isPending}
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="cursor-pointer absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
											onClick={() => togglePasswordVisibility("confirm")}
										>
											{showPasswords.confirm ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</Button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex space-x-2 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								form.reset();
								onSuccess?.();
							}}
							className="cursor-pointer"
							disabled={updatePasswordMutation.isPending}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="cursor-pointer"
							disabled={updatePasswordMutation.isPending}
						>
							{updatePasswordMutation.isPending ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Updating...
								</>
							) : (
								"Update Password"
							)}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
