import { UserProfile, ClerkLoading } from "@clerk/clerk-react";
import LoadingSpinner from "../components/LoadingSpinner";
import { MoreHorizontal } from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";

function ProfilePage() {
  return (
    <>
      <ClerkLoading>
        <LoadingSpinner />
      </ClerkLoading>

      <UserProfile
        appearance={{
          variables: {
            colorMuted: "#141A1F",
          },
          elements: {
            rootBox: {
              width: "100%",
            },
            cardBox: {
              width: "100%",
            },
            scrollBox: {
              backgroundColor: "transparent",
            },
          },
        }}
      >
        <UserProfile.Page
          label="More"
          labelIcon={<MoreHorizontal className="text-gray-400" size={16} />}
          url="more"
        >
          <div>
            <SignOutButton />
          </div>
        </UserProfile.Page>
      </UserProfile>
    </>
  );
}

export default ProfilePage;
