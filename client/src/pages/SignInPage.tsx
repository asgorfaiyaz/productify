import { SignIn } from "@clerk/clerk-react";

function SignInPage() {
  return (
    <div className="flex lg:mt-25 justify-center items-center">
      <SignIn />
    </div>
  );
}

export default SignInPage;
