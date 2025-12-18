import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/client/locations/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/client/locations/create"!</div>
}
