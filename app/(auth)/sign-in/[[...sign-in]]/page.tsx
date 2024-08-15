import { SignIn, useUser } from "@clerk/nextjs";
import React from "react";

const SignInPage = () => {
  const { isSignedIn } = useUser();

  if (isSignedIn) return null;

  return (
    <SignIn
      forceRedirectUrl={"/"}
      fallbackRedirectUrl={"/"}
      signUpUrl="/sign-up"
    />
  );
};

export default SignInPage;
