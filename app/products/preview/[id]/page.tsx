import { Metadata } from "next";
import { notFound } from "next/navigation";

import { URLS } from "@/utils/urls";
import { ProductResponse } from "@/models/Product";
import ProductDetails from "@/features/productDetails";
import { getValidImageUrl } from "@/utils/common";

// Helper to fetch product data
async function getProduct(slug: string): Promise<ProductResponse | null> {
  try {
    const res = await fetch(URLS.getProductBySlug(slug), {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Metadata generation
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product not found",
      description: "This product does not exist.",
    };
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [getValidImageUrl(product.images?.[0])],
    },
  };
}

// Page Component
export default async function ProductPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetails data={product} productSlug={slug} />;
}
