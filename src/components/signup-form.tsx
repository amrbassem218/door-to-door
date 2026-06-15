"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { handleGoogleAuth, handlePasswordSignup } from "@/utils/auth"
import { notFoundInput } from "@/utilities"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"

import { toast } from "sonner"
import z from "zod"

const schema = z
  .object({
    firstName: z
      .string(notFoundInput)
      .min(2, "First name must be at least 2 characters long"),
    lastName: z
      .string(notFoundInput)
      .min(2, "Last name must be at least 2 characters long"),
    email: z.email("Enter a valid email address"),
    password: z
      .string(notFoundInput)
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string(notFoundInput)
      .min(8, "Password must be at least 8 characters long"),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      })
    }
  })
type FormData = z.infer<typeof schema>

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })
  const onSubmit = async (data: FormData) => {
    const { email, password, firstName, lastName } = data
    const { data: userInfo, error } = await handlePasswordSignup(
      email,
      password,
      firstName,
      lastName
    )
    if (error) {
      toast.error("Error signing up: " + error.message)
    } else {
      toast.success("Signup successful!", {
        description: "Please check your email to verify your account.",
      })
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Button variant="outline" type="button" className="w-full" onClick={() => handleGoogleAuth()}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Continue with Google
              </Button>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field className="grid grid-cols-2 gap-4">
                <Controller
                  control={form.control}
                  name="firstName"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldError errors={[{ message: fieldState.error?.message }]} />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="lastName"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldError errors={[{ message: fieldState.error?.message }]} />
                    </Field>
                  )}
                />
              </Field>
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldError errors={[{ message: fieldState.error?.message }]} />
                  </Field>
                )}
              />
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input
                          id="password"
                          type="password"
                          {...field}
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldError errors={[{ message: fieldState.error?.message }]} />
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="confirmPassword"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="confirmPassword">
                          Confirm Password
                        </FieldLabel>
                        <Input
                          id="confirmPassword"
                          type="password"
                          {...field}
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldError errors={[{ message: fieldState.error?.message }]} />
                      </Field>
                    )}
                  />
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit">Create Account</Button>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Sign in
                  </button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By continuing, you confirm that you are an adult and have read and
        accepted our Free Membership Agreement and Privacy Policy. Your
        information may be used for marketing purposes, but you can opt out
        at any time.
      </FieldDescription>
    </div>
  )
}
