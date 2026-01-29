import { UserProfile, ClerkLoading } from "@clerk/clerk-react";
import LoadingSpinner from "../components/LoadingSpinner";

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
      />
    </>
  );
}

export default ProfilePage;
