'use client'
import { handleGoogleAuth } from "@/utilities";
import * as React from "react";
import { FcGoogle } from "react-icons/fc";

interface GoogleSignButtonProps {}

const GoogleSignButton: React.FunctionComponent<GoogleSignButtonProps> = (
  props
) => {
  return (
    <button>
      <FcGoogle size={40} onClick={() => handleGoogleAuth()} />
    </button>
  );
};

export default GoogleSignButton;
