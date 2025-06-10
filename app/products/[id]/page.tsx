"use client";
import ProductDetails from "@/features/productDetails";
import { useFetch } from "@/hooks/useFetch";
import { URLS } from "@/utils/urls";
import { ProductResponse } from "@/models/Product";
import { usePathname } from "next/navigation";

export default function Product() {
  const pathname = usePathname();
  const productSlug = pathname.split("/").at(-1)?.trim() ?? "";

  const { data, isLoading, isError } = useFetch<ProductResponse>({
    url: URLS.getProductBySlug(productSlug),
  });
  return (
    <ProductDetails
      data={data}
      isLoading={isLoading}
      isError={isError}
      productSlug={productSlug}
    />
  );
}
