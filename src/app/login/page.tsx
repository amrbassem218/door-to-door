'use client';
interface ILoginProps {}
import * as React from "react";
import LoginCard from "./loginCard";
const Login: React.FunctionComponent<ILoginProps> = (props) => {
  return (
    <div className="flex w-full flex-1 items-center justify-center my-10">
      <LoginCard/>
    </div>
  );
};

export default Login;
