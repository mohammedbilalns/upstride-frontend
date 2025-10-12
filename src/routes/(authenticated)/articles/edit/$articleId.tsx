import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/(authenticated)/articles/edit/$articleId",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(authenticated)/articles/edit/$articleId"!</div>;
}
