import NotFound from "@/pages/Notfound";
import { getUserSession } from "@/services/api.service";
import { Navigate } from "react-router-dom";
import { default as ClientProjectView } from "./view/client-view";

const ProjectsRouteWrapper = () => {
  const user = getUserSession(); // Assuming you get { user: { role: 'ADMIN' | 'CLIENT' } }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    // case "ADMIN":
    //   return <NonClientProjectView />;
    case "CLIENT":
    case "ADMIN":
    case "CONSULTANT":
      return <ClientProjectView />;
    default:
      return <NotFound />;
  }
};

export default ProjectsRouteWrapper;
