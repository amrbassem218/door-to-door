"use client";
import * as React from "react";
import { SignupForm } from "@/components/signup-form";

const Signup: React.FunctionComponent = () => {
  return (
    <div className="flex w-full flex-1 items-center justify-center my-10">
      <SignupForm />
    </div>
  );
};

export default Signup;
