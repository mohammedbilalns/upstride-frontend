import { OrbitalLoader } from "../ui/orbital-loader";

/**
 * Full-screen loading screen.
 * Displays the OrbitalLoader centered in the viewport.
 */
export default function Loading() {
	return (
		<div className="min-h-screen w-full justify-center flex">
			<OrbitalLoader />
		</div>
	);
}
