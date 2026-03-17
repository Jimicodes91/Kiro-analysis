import { PAGES } from "@/lib/constants";
import { getUserSession } from "@/services/api.service";

// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";

interface ProtectedProps {
  element: React.ReactNode;
  roles: string[];
  layout?:
    | React.ComponentType<{ children?: React.ReactNode }>
    | Array<React.ComponentType<{ children?: React.ReactNode }>>;
}

export default function ProtectedRoute({ element, roles, layout }: ProtectedProps) {
  const user = getUserSession();

  if (!user) return <Navigate to={PAGES.LOGIN_PAGE} replace />;

  if (!roles.includes(user.role)) {
    return <Navigate to="/404" replace />;
  }

  // Handle single or multiple layouts
  let wrapped = element;
  if (layout) {
    if (Array.isArray(layout)) {
      layout.forEach((Layout) => {
        wrapped = <Layout>{wrapped}</Layout>;
      });
    } else {
      const Layout = layout as React.ComponentType<{ children?: React.ReactNode }>;
      wrapped = <Layout>{wrapped}</Layout>;
    }
  }

  return <>{wrapped}</>;
}
