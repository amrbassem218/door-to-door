'use client';
import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/login-form";

function LoginContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  return (
    <div className="flex w-full flex-1 items-center justify-center my-10 px-4">
      <div className="w-full max-w-sm">
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}

const Login: React.FunctionComponent = () => {
  return (
    <Suspense fallback={<div className="flex w-full flex-1 items-center justify-center my-10"><p>Loading...</p></div>}>
      <LoginContent />
    </Suspense>
  );
};

export default Login;
