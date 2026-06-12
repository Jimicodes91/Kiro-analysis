import { getUserSession } from "@/services/api.service";

export function useRolePermission() {
  const user = getUserSession();
  const role = user?.role;

  const isAdmin = role === "ADMIN";
  const isSuperAdmin = role === "SUPER_ADMIN";
  const isConsultant = role === "CONSULTANT";
  const isClient = role === "CLIENT";

  return {
    role,
    isAdmin,
    isSuperAdmin,
    isConsultant,
    isClient,
    canManageUsers: isAdmin || isSuperAdmin,
    canManageProjects: isAdmin || isConsultant,
    canViewAdmin: isAdmin || isSuperAdmin,
    canEditProject: isAdmin || isConsultant,
    canViewFinance: isAdmin || isConsultant,
  };
}
