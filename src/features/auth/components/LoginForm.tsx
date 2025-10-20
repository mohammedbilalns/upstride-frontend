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
import { useLogin } from "../hooks";
import type { loginFormValues } from "../schemas";
import { loginSchema } from "../schemas";
import GoogleOAuthButton from "./GoogleOauthButton";

type LoginFormProps = {
	onRegisterSuccess?: (email: string) => void;
	setActiveTab: (tab: "login" | "register") => void;
	setForgotpassword: (forgotpassword: boolean) => void;
};

export function LoginForm({
	onRegisterSuccess,
	setActiveTab,
	setForgotpassword,
}: LoginFormProps) {
	const loginMutation = useLogin();
	const form = useForm<loginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleLogin = (values: loginFormValues) => {
		loginMutation.mutate(values);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									placeholder="Enter your email"
									{...field}
									autoComplete="email"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder="Enter your password"
									{...field}
									autoComplete="current-password"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex justify-end -mt-2">
					<button
						type="button"
						onClick={() => setForgotpassword(true)}
						className="text-sm text-primary hover:underline cursor-pointer"
					>
						Forgot password?
					</button>
				</div>

				<Button
					type="submit"
					className="w-full cursor-pointer"
					disabled={loginMutation.isPending}
				>
					{loginMutation.isPending ? "Signing in... " : "Sign In"}
				</Button>
			</form>

			<div className="mt-4">
				<GoogleOAuthButton
					onRegisterSuccess={onRegisterSuccess}
				></GoogleOAuthButton>
			</div>

			<p className="mt-4 text-center text-sm text-muted-foreground ">
				Don’t have an account?{" "}
				<button
					type="button"
					onClick={() => setActiveTab("register")}
					className="text-primary font-medium hover:underline cursor-pointer"
				>
					Sign up
				</button>
			</p>
		</Form>
	);
}
