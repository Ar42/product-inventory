// app/not-found.tsx
import Link from "next/link";
import { Metadata } from "next";
import Error from "@/components/Error";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  return (
    <section className="">
      <Error
        message={
          <>
            <h2 className="text-5xl font-semibold text-red-600 text-center my-8">
              Page not available
            </h2>
            <Link
              href="/products"
              className="text-2xl text-center block text-primary hover:underline"
            >
              Navigate to products
            </Link>
          </>
        }
        containerClassname="text-center"
      />
    </section>
  );
}
