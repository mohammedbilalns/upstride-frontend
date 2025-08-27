import { useMutation } from "@tanstack/react-query";
import { userRegister } from "../services/auth.service";
import type { RegisterFormValues } from "../validations";
import { toast } from "sonner";
import type { ApiError } from "@/types";

export const useRegister = (callbacks?: {
  onRegisterSuccess?: (email: string) => void;
}) => {
  return useMutation({
    mutationFn: (data: RegisterFormValues) => userRegister(data),
    onSuccess: (response, variables) => {
      toast.success(response.message);
      callbacks?.onRegisterSuccess?.(variables.email);
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message;
      toast.error(errorMessage);
    },
  });
};
