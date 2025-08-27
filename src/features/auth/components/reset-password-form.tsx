import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../validations/resetPasswordSchema";
import type { ResetPasswordFormValues } from "../validations/resetPasswordSchema";
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
import { useUpdatePassword } from "../hooks/useUpdatePassword";

type ResetPasswordFormProps = { email: string; onSuccess: () => void };

export default function ResetPasswordForm({
  email,
  onSuccess,
}: ResetPasswordFormProps) {
  const updatePasswordMutation = useUpdatePassword({ onSuccess });
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleReset = (values: ResetPasswordFormValues) => {
    updatePasswordMutation.mutate({ email, newPassword: values.password });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleReset)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  {...field}
                  autoComplete="new-password"
                />
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
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  {...field}
                  autoComplete="new-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={updatePasswordMutation.isPending}
        >
          {updatePasswordMutation.isPending ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </Form>
  );
}
