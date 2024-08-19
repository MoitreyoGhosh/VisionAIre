"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Collection } from "@/components/shared/Collection";
import Header from "@/components/shared/Header";
import { getUserImages } from "@/lib/actions/image.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { useEffect, useState } from "react";

const Profile = ({ searchParams }: SearchParamProps) => {
  const { user } = useUser();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [images, setImages] = useState<any>(null);
  const page = Number(searchParams?.page) || 1;

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        const fetchedUser = await getUserById(user.id);
        setCurrentUser(fetchedUser);

        const fetchedImages = await getUserImages({ page, userId: fetchedUser._id });
        setImages(fetchedImages);
      } else {
        router.push("/sign-in");
      }
    };

    fetchData();
  }, [user, router, page]);

  if (!currentUser || !images) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header title="Profile" />

      <section className="profile">
        <div className="profile-balance">
          <p className="p-14-medium md:p-16-medium">CREDITS AVAILABLE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/coins.svg"
              alt="coins"
              width={50}
              height={50}
              className="size-9 md:size-12"
            />
            <h2 className="h2-bold text-dark-600">{currentUser.creditBalance}</h2>
          </div>
        </div>

        <div className="profile-image-manipulation">
          <p className="p-14-medium md:p-16-medium">IMAGE MANIPULATION DONE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/photo.svg"
              alt="coins"
              width={50}
              height={50}
              className="size-9 md:size-12"
            />
            <h2 className="h2-bold text-dark-600">{images?.data.length}</h2>
          </div>
        </div>
      </section>

      <section className="mt-8 md:mt-14">
        <Collection
          images={images?.data}
          totalPages={images?.totalPages}
          page={page}
        />
      </section>
    </>
  );
};

export default Profile;

