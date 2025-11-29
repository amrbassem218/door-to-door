import GoogleSignButton from "@/components/login/googleButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { handleGoogleAuth } from "@/utilities";
import * as React from "react";
import { FaApple, FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

interface ILoginProps {}

const Login: React.FunctionComponent<ILoginProps> = (props) => {
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <Card className="max-w-150">
        <CardHeader className="text-center">
          <CardTitle >Sign In/ Register</CardTitle>
          <CardDescription >
            Continue with your email and password
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-5 flex flex-col">
          <div>
            <form action="" className="space-y-3 flex flex-col ">
              <Input type="email" id="email" placeholder="Email"></Input>
              <Input type="password" placeholder="Password"></Input>
              <Button type="submit">Submit</Button>
            </form>
          </div>
          <div>
            {/* Seperator */}
            <div className="flex items-center w-full my-4">
              <Separator className="h-px bg-gray-300 flex-1" />
              <p className="px-4 text-sm text-gray-500 whitespace-nowrap">
                or continue with
              </p>
              <Separator className="h-px bg-gray-300 flex-1" />
            </div>

            <div className="">
              <div className="flex gap-3 justify-around">
                <GoogleSignButton/>
                <button>
                  <FaFacebook size={40} className="text-[#1877F2]" />
                </button>
                <button>
                  <FaApple size={40} />
                </button>
                <button>
                  <FaSquareXTwitter size={40} />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {/* TOS */}
          <div className="mt-4">
            <p className="text-xs text-muted text-center">
              By continuing, you confirm that you are an adult and have read and
              accepted our Free Membership Agreement and Privacy Policy. Your
              information may be used for marketing purposes, but you can opt
              out at any time.
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
