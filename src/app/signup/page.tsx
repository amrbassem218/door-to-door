"use client";
import * as React from "react";
import { SignupForm } from "@/components/signup-form";

const Signup: React.FunctionComponent = () => {
  return (
    <div className="flex w-full flex-1 items-center justify-center my-10 px-4">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
