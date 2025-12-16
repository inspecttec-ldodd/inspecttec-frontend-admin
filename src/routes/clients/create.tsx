import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/clients/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/clients/create"!</div>
}
