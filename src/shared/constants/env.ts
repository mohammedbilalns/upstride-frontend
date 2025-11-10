// Centralized environment variable 

export const env = Object.freeze({
	API_URL: import.meta.env.VITE_API_URL,
	GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
	CLIENT_URL: import.meta.env.VITE_CLIENT_URL,
  SERVER_URL: import.meta.env.VITE_SERVER_URL,
});
