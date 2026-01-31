import { useClerk } from "@clerk/clerk-react";
import { Button } from "./ui/button";

export const SignOutButton = () => {
  const { signOut } = useClerk();

  return (
    <Button onClick={() => signOut({ redirectUrl: "/" })}>Sign out</Button>
  );
};
