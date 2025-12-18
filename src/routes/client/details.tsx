import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/client/details')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/client/details"!</div>
}
