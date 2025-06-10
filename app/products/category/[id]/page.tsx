"use client";
import ProductList from "@/features/productList";
import { usePathname, useSearchParams } from "next/navigation";

export default function Category() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  return (
    <ProductList
      categorySlug={pathname.split("/").at(-1)}
      categoryId={searchParams.get("categoryId")}
    />
  );
}
