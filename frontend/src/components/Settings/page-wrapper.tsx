"use client";
import { isLoggedIn } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
  const isUser = isLoggedIn();
  const router = useRouter();
  useEffect(() => {
    // Redirect if user is not logged in
    if (!isUser) {
      router.push("/signin");
    }
  }, [isUser, router]);
  return (
    <div className="flex flex-col md:p-10 px-3 space-y-2 bg-orange-200/25 flex-grow pb-4 dark:bg-secondary/75">
      {children}
    </div>
  );
}
