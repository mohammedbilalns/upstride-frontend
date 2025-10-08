import { zodResolver } from "@hookform/resolvers/zod";
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
import { useForgotPassword } from "../-hooks/useForgotPassword";
import type { ForgotPasswordFormValues } from "../-validations/forgotPasswordSchema";
import { forgotPasswordSchema } from "../-validations/forgotPasswordSchema";

export function ForgotPasswordForm({
	onSuccess,
}: {
	onSuccess: (email: string) => void;
}) {
	const forgotPasswordMutation = useForgotPassword({ onSuccess });

	const form = useForm<ForgotPasswordFormValues>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const handleSubmit = async (values: ForgotPasswordFormValues) => {
		forgotPasswordMutation.mutate(values);
	};

	return (
		<div className="space-y-6">
			<div className="text-center space-y-2">
				<h2 className="text-2xl font-semibold">Forgot Password</h2>
				<p className="text-muted-foreground">
					Enter your registered email address and we'll send you a verification
					code.
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="justify-center">Email Address</FormLabel>
								<FormControl>
									<Input
										placeholder="you@example.com"
										type="email"
										{...field}
										disabled={forgotPasswordMutation.isPending}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						className="w-full cursor-pointer"
						disabled={forgotPasswordMutation.isPending}
					>
						{forgotPasswordMutation.isPending
							? "Sending..."
							: "Send Verification Code"}
					</Button>
				</form>
			</Form>
		</div>
	);
}
