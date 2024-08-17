"use client";

import { Collection } from "@/components/shared/Collection";
import { navLinks } from "@/constants";
import { getAllImages } from "@/lib/actions/image.actions";
import { createUser, getUserById } from "@/lib/actions/user.actions";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const Home = ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const searchQuery = (searchParams?.query as string) || "";

  // Store the entire response object instead of just the images
  const [imageResponse, setImageResponse] = useState<{
    data: any[];
    totalPage: number;
    savedImages: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await getAllImages({ page, searchQuery });
        setImageResponse(response as any);
      } catch (error) {
        console.error("Failed to fetch images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [page, searchQuery]);

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
      }
    };

    handleUser();
  }, [user]);

  return (
    <>
      <section className="home">
        <h1 className="home-heading">
          Unleash Your Creative Vision with VisionAIre
        </h1>
        <ul className="flex-center w-full gap-20">
          {navLinks.slice(1, 5).map((link) => (
            <Link
              key={link.route}
              href={link.route}
              className="flex-center flex-col gap-2"
            >
              <li className="flex-center w-fit rounded-full bg-white p-4">
                <Image src={link.icon} alt="image" width={24} height={24} />
              </li>
              <p className="p-14-medium text-center text-white">{link.label}</p>
            </Link>
          ))}
        </ul>
      </section>

      <section className="sm:mt-12">
        {loading ? (
          <p>Loading...</p>
        ) : (
          imageResponse && (
            <Collection
              hasSearch={true}
              images={imageResponse.data}
              totalPages={imageResponse.totalPage}
              page={page}
            />
          )
        )}
      </section>
    </>
  );
};

export default Home;
