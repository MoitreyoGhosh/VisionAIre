"use client";

import Header from "@/components/shared/Header";
import React, { useEffect, useState } from "react";
import { transformationTypes } from "@/constants";
import TransformationForm from "@/components/shared/TransformationForm";
import { getUserById } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const AddTransformationTypePage = ({ params: { type } }: SearchParamProps) => {
  const { user } = useUser();
  const router = useRouter();
  const [dbuser, setDbuser] = useState<any>(null);
  const transformation = transformationTypes[type];

  useEffect(() => {
    const fetchUser = async () => {
      const userId = user?.id;
  
      if (!userId) {
        console.error("No user ID found, redirecting to sign-in");
        router.push("/sign-in");
        return;
      }
  
      console.log("Fetching user with ID:", userId);
  
      try {
        const userFromDb = await getUserById(userId);
        if (!userFromDb) {
          console.error("User not found in database for ID:", userId);
          router.push("/sign-in");
        } else {
          console.log("User found:", userFromDb);
          setDbuser(userFromDb);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/sign-in");
      }
    };
  
    fetchUser();
  }, [user, router]);

  // Show loading state or fallback until the user data is loaded
  if (!dbuser) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />

      <TransformationForm
        action="Add"
        userId={dbuser._id}
        type={transformation.type as TransformationTypeKey}
        creditBalance={dbuser.creditBalance}
      />
    </>
  );
};

export default AddTransformationTypePage;
