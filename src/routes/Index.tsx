import ProtectedRoute from "@/components/ui/protected-route";
import { getUserSession } from "@/services/api.service";
import { useRoutes } from "react-router-dom";
import { AuthRoutes } from "./AppRoutes";
import { appRoutes } from "./app";

export default function AuthRoutesList() {
  const user = getUserSession();

  // Debug: log route matching info
  console.log("[ROUTE DEBUG] user:", user?.role, "path:", window.location.pathname);

  const roleRoutes = appRoutes.filter(
    (route) => user?.role !== undefined && route.roles.includes(user.role)
  );

  console.log("[ROUTE DEBUG] matched routes:", roleRoutes.map(r => r.path));

  const routes = roleRoutes.map((r) => ({
    path: r.path,
    element: <ProtectedRoute element={r.element} roles={r.roles} layout={r.layout} />,
  }));

  const allRoutes = [...AuthRoutes, ...routes];
  console.log("[ROUTE DEBUG] total routes:", allRoutes.length);

  return useRoutes(allRoutes);
}
