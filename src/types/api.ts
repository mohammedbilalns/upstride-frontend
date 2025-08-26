export interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
      success?: boolean;
    };
    status?: number;
  };
}
