import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings_/password')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/settings/password"!</div>
}
