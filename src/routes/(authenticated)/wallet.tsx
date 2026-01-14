import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/wallet')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(authenticated)/wallet"!</div>
}
