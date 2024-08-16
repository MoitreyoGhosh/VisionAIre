import { SignIn } from "@clerk/nextjs";
import React from "react";

const SignInPage = () => {
  return (
    <SignIn
      forceRedirectUrl={"/"}
      fallbackRedirectUrl={"/"}
      signUpUrl="/sign-up"
    />
  );
};

export default SignInPage;
