import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/mentor/$mentorId")({
	component: RouteComponent,
	loader: async ({ params, context }) => {
		const { mentorId } = params;
		return context.queryClient.fetchQuery({
			queryKey: ["mentor", mentorId],
		});
	},
});

function RouteComponent() {
	return <div>Hello "/(authenticated)/mentor/$mentorId"!</div>;
}
