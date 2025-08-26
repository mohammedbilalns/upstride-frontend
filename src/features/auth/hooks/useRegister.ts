import { useMutation } from "@tanstack/react-query";
import { userRegister } from "../services/auth.service";
import type { RegisterFormValues } from "../validations";
import { toast } from "sonner";
import type { ApiError } from "@/types";

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterFormValues) => userRegister(data),
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message || "Register failed";
      toast.error(errorMessage);
    },
  });
};
