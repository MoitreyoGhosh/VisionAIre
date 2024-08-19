"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/shared/Header";
import TransformationForm from "@/components/shared/TransformationForm";
import { transformationTypes } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import { getImageById } from "@/lib/actions/image.actions";

const Page = ({ params: { id } }: SearchParamProps) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null); // Using 'any' type here
  const [image, setImage] = useState<any>(null); // Using 'any' type here

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
      return;
    }

    const fetchData = async () => {
      if (user) {
        const fetchedUser = await getUserById(user.id);
        const fetchedImage = await getImageById(id);

        setUserData(fetchedUser);
        setImage(fetchedImage);
      }
    };

    if (isSignedIn) {
      fetchData();
    }
  }, [isLoaded, isSignedIn, user, id, router]);

  if (!isLoaded || !isSignedIn || !userData || !image) {
    return <p>Loading...</p>; // Or a loading spinner
  }

  const transformation =
    transformationTypes[image.transformationType as TransformationTypeKey];
  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />

      <section className="mt-10">
        <TransformationForm
          action="Update"
          userId={userData._id}
          type={image.transformationType as TransformationTypeKey}
          creditBalance={userData.creditBalance}
          config={image.config}
          data={image}
        />
      </section>
    </>
  );
};

export default Page;
