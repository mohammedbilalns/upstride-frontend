import { useForm } from "react-hook-form";
import { loginSchema } from "../validations";
import type { loginFormValues } from "../validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLogin } from "../hooks/useLogin";

type LoginFormProps = {
  setActiveTab: (tab: "login" | "register") => void;
  onForgotPasswordClick?: () => void;
};

export default function LoginForm({
  setActiveTab,
  onForgotPasswordClick,
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const loginMutation = useLogin();
  const form = useForm<loginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: loginFormValues) => {
    setIsLoading(true);
    try {
      await loginMutation.mutateAsync(values);
    } catch (error) {
      // Error is already handled in the hook
      console.log("Login error:", error);
    } finally {
      setIsLoading(false);
    }
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
            onClick={onForgotPasswordClick}
            className="text-sm text-primary hover:underline cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "Signing in... " : "Sign In"}
        </Button>
      </form>

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
