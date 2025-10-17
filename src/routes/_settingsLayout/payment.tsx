import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_settingsLayout/payment")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-2 bg-green-700 border-2">Hello "/settings/payment"!</div>
  );
}
