"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const emailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(100, "Email must be less than 100 characters")
    .email("Please enter a valid email address"),
});

type EmailFormData = z.infer<typeof emailSchema>;

const LAUNCH_DATE = new Date("2026-05-30T00:00:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const difference = LAUNCH_DATE.getTime() - Date.now();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export default function ComingSoon() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const onSubmit = (data: EmailFormData) => {
    toast.success("You're on the list! 🎉", {
      description: "We'll notify you when we launch.",
    });
    form.reset();
  };

  const timeUnits = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-[#FAFAF9] via-[#F5F5F4] to-[#E7E5E4]">
      <div className="flex flex-col items-center gap-8 px-6 text-center max-w-md">
        <div className="">
          <h1
            className="cursor-pointer font-bold text-8xl"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            EGEEX
          </h1>
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-primary">
            Coming Soon!
          </h1>
          <p className="text-lg text-[#57534E]">
            We&apos;re getting everything ready for you.
            <br />
            <span className="font-medium text-[#1C1C1C]">
              Launching May 30th, 2026
            </span>
          </p>
        </div>

        <div className="grid w-full grid-cols-4 gap-3">
          {timeUnits.map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center rounded-xl bg-white p-3 shadow-md ring-1 ring-[#E7E5E4]"
            >
              <span className="font-serif text-2xl font-bold tabular-nums text-[#1C1C1C]">
                {String(value).padStart(2, "0")}
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-[#78716C]">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-3 w-full">
          <p className="text-sm text-[#78716C]">
            Want to be notified when we launch?
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="flex h-10 w-full rounded-lg border bg-white px-4 text-sm shadow-sm placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#1C1C1C]/20 sm:w-[280px]"
                          {...field}
                        />
                        <Button
                          type="submit"
                          className="shrink-0 bg-[#1C1C1C] text-white hover:bg-[#3D3D3D]"
                        >
                          Notify Me
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

