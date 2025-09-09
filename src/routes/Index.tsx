import ProtectedRoute from "@/components/ui/protected-route";
import { getUserSession } from "@/services/api.service";
import { useRoutes } from "react-router-dom";
import { AuthRoutes } from "./AppRoutes";
import { appRoutes } from "./app";

export default function AuthRoutesList() {
  const user = getUserSession();

  const roleRoutes = appRoutes.filter(
    (route) => user?.role !== undefined && route.roles.includes(user.role)
  );

  const routes = roleRoutes.map((r) => ({
    path: r.path,
    element: <ProtectedRoute element={r.element} roles={r.roles} layout={r.layout} />,
  }));

  return useRoutes([...AuthRoutes, ...routes]);
}
