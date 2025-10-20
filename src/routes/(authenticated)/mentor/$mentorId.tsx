import { createFileRoute } from "@tanstack/react-router";
import { queryClient } from "@/main";

export const Route = createFileRoute("/(authenticated)/mentor/$mentorId")({
	component: RouteComponent,
	loader: async ({ params }) => {
		const { mentorId } = params;
		return queryClient.fetchQuery({
			queryKey: ["mentor", mentorId],
			queryFn: () => fetchMentor(mentorId),
		});
	},
});

function RouteComponent() {
	return <div>Hello "/(authenticated)/mentor/$mentorId"!</div>;
}
