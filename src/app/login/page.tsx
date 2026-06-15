'use client';
interface ILoginProps {}
import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LoginCard from "./loginCard";

function LoginContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  return (
    <div className="flex w-full flex-1 items-center justify-center my-10">
      <LoginCard redirectTo={redirectTo}/>
    </div>
  );
}

const Login: React.FunctionComponent<ILoginProps> = (props) => {
  return (
    <Suspense fallback={<div className="flex w-full flex-1 items-center justify-center my-10"><p>Loading...</p></div>}>
      <LoginContent />
    </Suspense>
  );
};

export default Login;
