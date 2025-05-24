import { UserType } from "@/lib/constants";
import NotFound from "@/pages/Notfound";
import { getUserSession } from "@/services/api.service";
import { Outlet } from "react-router-dom";

type ProtectedRouteProps = {
  allowedRoles: UserType[];
};

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const user = getUserSession();

  if (!user || !allowedRoles.includes(user.role)) {
    return <NotFound />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
