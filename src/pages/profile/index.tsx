import Heading from "@/components/ui/heading";
import { Icons } from "@/components/ui/icons";
import AccountNav from "@/layouts/dashboard-layout/account-nav";
import { getIsAdmin } from "@/services/api.service";
import { Lock } from "lucide-react";

const links = [
  {
    title: "Profile",
    icon: Icons.user,
    path: "/profile-settings",
    exact: true,
  },
  {
    title: "Security",
    icon: () => <Lock />,
    path: "/profile-settings/security",
  },
];

function ProfilePageLayout({ children }: { children?: React.ReactNode }) {
  const isAdmin = getIsAdmin();
  const adminLinks = [
    ...links,
    {
      title: "Organization",
      icon: () => <Icons.company />,
      path: "/profile-settings/organization",
    },
  ];
  return (
    <div>
      <div className="p-3 sm:p-4 md:p-6 animate-in fade-in-0 duration-700 ease-in-out space-y-6 bg-white min-h-[calc(100vh-70px)]">
        <Heading size="h3">Profile Settings</Heading>

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
          <div className="p-5 rounded-lg border min-h-[500px] min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePageLayout;
