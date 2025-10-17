import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_settingsLayout/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-2 bg-amber-700 border-2">Hello "/settings/profile"!</div>
  );
}
