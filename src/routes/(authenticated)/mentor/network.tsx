import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/mentor/network')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(authenticated)/mentor/network"!</div>
}
