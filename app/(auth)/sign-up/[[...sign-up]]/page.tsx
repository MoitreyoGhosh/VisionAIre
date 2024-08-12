import { SignUp } from "@clerk/nextjs";
import React from "react";

const SignUpPage = () => {
  return <SignUp forceRedirectUrl={'/'} fallbackRedirectUrl={'/'} signInUrl="/sign-in" />;
};

export default SignUpPage;
