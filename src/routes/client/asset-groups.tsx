import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/client/asset-groups')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/client/asset-groups"!</div>
}
