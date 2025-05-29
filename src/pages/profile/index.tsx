import Heading from "@/components/ui/heading";
import EditProfileDetails from "./templates/profile-details";

function ProfilePage() {
  return (
    <div>
      <div className="p-6 animate-in fade-in-0 duration-700 ease-in-out space-y-6">
        <Heading size="h4">Profile settings</Heading>

        <div>
          <div></div>
          <div className="p-5 rounded-lg border min-h-[500px]">
            <EditProfileDetails />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
