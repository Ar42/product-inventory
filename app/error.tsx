"use client";

import Link from "next/link";
import Error from "@/components/Error";
import Button from "@/components/Button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  console.error(error);
  return (
    <Error
      message={
        <>
          <h2 className="text-5xl font-semibold text-red-600 text-center my-8">
            Something went wrong
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={reset}
              className="px-4 py-2 rounded-sm"
              variant="primary"
            >
              Try again
            </Button>
            <Link
              href="/products"
              className="text-2xl text-center text-primary hover:underline"
            >
              Navigate to products
            </Link>
          </div>
        </>
      }
      containerClassname="text-center"
    />
  );
}
