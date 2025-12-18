import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/client/assets/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/client/assets/create"!</div>
}
