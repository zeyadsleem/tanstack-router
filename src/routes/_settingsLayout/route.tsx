import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_settingsLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-2 border-2">
      _settingsLayout
      <div className="p-2 flex gap-2 mb-4 bg-yellow-600">
        <Link to="/payment" className="[&.active]:font-bold">
          Payment
        </Link>
        <Link to="/profile" className="[&.active]:font-bold">
          Profile
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
