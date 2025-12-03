"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AuthCallbackPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      // Supabase sometimes returns errors in the URL hash (after #)
      const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;
      const hashParams = new URLSearchParams(hash);

      const error = hashParams.get("error");
      const errorDescription = hashParams.get("error_description");

      if (error) {
        setStatus("error");
        setMessage(
          errorDescription ||
            (error === "access_denied"
              ? "Email link is invalid or has expired. Please request a new confirmation email."
              : "Authentication failed. Please try again.")
        );
        return;
      }

      // No error in the hash – treat as successful confirmation.
      // For email/password sign-up with confirmation, Supabase usually expects
      // the user to log in again after confirming their email.
      setStatus("success");
      setMessage("Email confirmed! You can now log in.");
      setTimeout(() => {
        router.replace("/");
      }, 1500);
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex w-full flex-1 items-center justify-center my-10">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-semibold">Signing you in…</h1>
        {status === "loading" && (
          <p className="text-muted-foreground">
            Please wait while we complete your authentication.
          </p>
        )}
        {status === "success" && (
          <p className="text-green-600 font-medium">{message ?? "Success!"}</p>
        )}
        {status === "error" && (
          <>
            <p className="text-destructive font-medium">
              {message ??
                "There was a problem with your confirmation link. It may have expired."}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Try requesting a new confirmation email or signing in again.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallbackPage;
