import path from "node:path";
import tsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		tsConfigPaths(),
		tailwindcss(),
		tanstackStart(),
		react(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
