import Heading from "@/components/ui/heading";
import { Icons } from "@/components/ui/icons";
import AccountNav from "@/layouts/dashboard-layout/account-nav";
import { getIsAdmin } from "@/services/api.service";
import { Lock } from "lucide-react";
import { Outlet } from "react-router-dom";

const links = [
  {
    title: "Profile",
    icon: Icons.user,
    path: "/profile-setting",
    exact: true,
  },
  {
    title: "Security",
    icon: () => <Lock />,
    path: "/profile-setting/security",
  },
];

function ProfilePageWrapper() {
  const isAdmin = getIsAdmin();
  const adminLinks = [
    ...links,
    {
      title: "Organization",
      icon: () => <Icons.company />,
      path: "/profile-setting/organization",
    },
  ];
  return (
    <div>
      <div className="p-6 animate-in fade-in-0 duration-700 ease-in-out space-y-6">
        <Heading size="h4">Profile settings</Heading>

        <div className="grid gap-4 grid-cols-[200px_1fr]">
          <div className="bg-[#F7F7F7B2] w-full h-fit py-2 rounded-lg border-[#0000001A] border">
            <AccountNav
              isCollapsed={false}
              links={isAdmin ? adminLinks : links}
              layoutId={"profile-layout"}
            />
            {/* <Separator />
            <div className="py-1 flex items-center">
              <Button leftIcon={<Trash />} className="text-[#FB002B]" variant="link">
                Delete account
              </Button>
            </div> */}
          </div>
          <div className="p-5 rounded-lg border min-h-[500px]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePageWrapper;
