import { Suspense } from "react";
import { ResetPasswordForm } from "./_components/reset-password-form";

import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import Loader from "@/components/shared/loader";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Suspense fallback={<Loader />}>
        <div className="flex flex-col">
          <Link href="/" className="mt-12 mb-6 inline-flex items-center">
            <ArrowLeftIcon suppressHydrationWarning className="mr-2 size-4" />
            Back to Home
          </Link>
          <ResetPasswordForm />
        </div>
      </Suspense>
    </div>
  );
}
