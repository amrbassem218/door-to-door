'use client';
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { notFoundInput } from "@/utilities";
import { handlePasswordLogin } from "@/utils/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { FaApple, FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { toast } from "sonner";
import z from "zod";

interface ILoginProps {}
const schema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string(notFoundInput).min(8, "Password must be at least 8 characters long"),
});
type zodSchema = z.infer<typeof schema>;
const Login: React.FunctionComponent<ILoginProps> = (props) => {
  const form = useForm<zodSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async(data: zodSchema) => {
    const { email, password } = data;

    const {data: userInfo, error} = await handlePasswordLogin(email, password);
    if(error){
      toast.error("Error logging in: " + error.message);
      console.log("Error logging in:", error.message);
    } else {
      console.log("Login successful:", userInfo);
    }
  };
  return (
    <div className="flex w-full flex-1 items-center justify-center my-10">
      <Card className="max-w-150">
        <CardHeader className="text-center">
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Continue with your email and password
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-5 flex flex-col">
          <div>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3 flex flex-col "
            >
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Email</FieldLabel>
                      <Input
                        type="email"
                        placeholder="Enter Email"
                        className="border border-border"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldError
                        errors={[{ message: fieldState.error?.message }]}
                      />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Password</FieldLabel>
                      <Input
                        type="password"
                        placeholder="Enter Password"
                        className="border border-border"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldError
                        errors={[{ message: fieldState.error?.message }]}
                      />
                    </Field>
                  )}
                />
              </FieldGroup>
              <Button type="submit">Submit</Button>
              <div>
                <p className="text-sm text-center text-muted-foreground">Don't have an account? <a href="/signup" className="text-blue-500 hover:text-blue-600">Sign up</a></p>
              </div>
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
                <GoogleSignButton />
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
