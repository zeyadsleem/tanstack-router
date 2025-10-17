import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="bg-blue-950 p-2">
      <h1 className="text-2xl font-bold">Root Route</h1>
      <div className="p-2 flex gap-2 mb-4 bg-teal-600">
        <Link to={"/"} className="[&.active]:font-bold">
          Home
        </Link>
        <Link to={"/about"} className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <Outlet />
      <TanStackRouterDevtools position="top-right" />
    </div>
  );
}
