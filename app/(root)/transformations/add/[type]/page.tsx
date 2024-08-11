"use client";
import Header from "@/components/shared/Header";
import React from "react";
import { transformationTypes } from "@/constants";
import TransformationForm from "@/components/shared/TransformationForm";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { useUser } from "@clerk/nextjs";


const AddTransformationTypePage = async ({
  params: { type },
}: SearchParamProps) => {
  const { user } = useUser();//auth()
  const userId = user?.id;
  const transformation = transformationTypes[type];

  if(!userId) redirect('/sign-in')

  const dbuser = await getUserById(userId);
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
