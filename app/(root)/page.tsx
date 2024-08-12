"use client";

import { createUser, getUserById } from "@/lib/actions/user.actions";
import { useUser } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";

const Home = () => {
  const [loading, setLoading] = useState(true);

  const { user } = useUser();

  useEffect(() => {
    const handleUser = async () => {
      if (!user) return;

      try {
        const existingUser = await getUserById(user.id);
        if (!existingUser) {
          const newUser: CreateUserParams = {
            clerkId: user.id,
            email: user.emailAddresses[0].emailAddress,
            username: user.username || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            photo: user.imageUrl || "",
          };
          await createUser(newUser);
          console.log("User added to database");
        } else {
          console.log(existingUser);
        }
      } catch (error) {
        console.error("Error checking or adding user:", error);
      } finally {
        setLoading(false);
      }
    };

    handleUser();
  }, [user]);

  return (
    <div>
      <p>Home</p>
    </div>
  );
};

export default Home;
