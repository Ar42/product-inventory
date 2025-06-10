"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import clsx from "clsx";
import { Download } from "lucide-react";

import { ProductResponse } from "@/models/Product";

import Error from "@/components/Error";
import CategoryChip from "@/components/shared/CategoryChip";
import Breadcrumb from "@/components/Breadcrumb";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";

import {
  beautifyText,
  formatPrice,
  formatRelativeTime,
  getValidImageUrl,
} from "@/utils/common";
import { downloadImage } from "@/utils/download-helpers";

interface Props {
  data: ProductResponse | null;
  isLoading?: boolean;
  isError?: boolean;
  productSlug?: string;
}

const ProductDetails = (props: Props) => {
  const { data, isLoading, isError, productSlug } = props;

  const pathname = usePathname();
  const isPreview = pathname.includes("/preview");

  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const selectCurrentImagePreviewUrl = (url: string) => {
    setCurrentImageUrl(url);
  };

  useEffect(() => {
    if (data?.images?.[0]) {
      setCurrentImageUrl((prev) => {
        return prev || data.images[0];
      });
    }
  }, [data]);

  const handleDownloadImage = async (url: string, filename: string) => {
    await downloadImage({
      url,
      filename,
    });
  };

  if (isLoading) {
    return (
      <Spinner className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
    );
  }
  if (isError) {
    return (
      <Error
        message={
          <>
            <h2 className="text-5xl font-semibold text-red-600 text-center my-8">
              Product not found
            </h2>

            <Link
              href="/products"
              className="text-2xl text-center text-primary block hover:underline"
            >
              Navigate to products
            </Link>
          </>
        }
        containerClassname="text-center"
      />
    );
  }
  if (!data) return;

  return (
    <section className="p-10">
      <Breadcrumb
        items={[
          { label: "Products", href: "/products" },
          { label: beautifyText(productSlug ?? "") },
        ]}
        containerClassName="mb-10"
      />
      <div className="grid grid-cols-12 justify-between lg:gap-10">
        <div className="col-span-12 lg:col-span-5 relative">
          {currentImageUrl && (
            <>
              <Image
                src={getValidImageUrl(currentImageUrl)}
                alt={data.title}
                width={500}
                height={300}
                className="mb-14 rounded-lg shadow-md h-72 lg:h-96 object-cover w-full mx-auto"
              />
              <Button
                className="absolute top-2 right-2"
                onClick={() => {
                  handleDownloadImage(
                    getValidImageUrl(currentImageUrl),
                    data.title
                  );
                }}
              >
                <Download className="text-white" />
              </Button>
            </>
          )}

          <div className="flex gap-2 justify-center items-center">
            {data?.images?.map((imageUrl) => (
              <Image
                key={imageUrl}
                src={getValidImageUrl(imageUrl)}
                alt={data.title}
                width={500}
                height={300}
                className={clsx(
                  "mb-4 rounded-lg shadow-md h-10 w-10 object-cover cursor-pointer border-2 p-1",
                  {
                    "border-primary": currentImageUrl === imageUrl,
                    "border-gray-200": currentImageUrl !== imageUrl,
                  }
                )}
                onClick={() => {
                  selectCurrentImagePreviewUrl(imageUrl);
                }}
              />
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">{data.title}</h1>
          {data?.category.name && (
            <CategoryChip category={data?.category} containerClassname="mb-2" />
          )}

          <p className="text-lg text-black font-medium mt-6 mb-4">
            Price:{" "}
            <span className="font-semibold text-primary">
              {formatPrice(data.price)}
            </span>
          </p>
          <div>
            <p className="text-lg font-medium border-b border-b-gray-300 pb-1 mb-2">
              Product summary:
            </p>
            <p className="text-base text-black mb-10">{data?.description}</p>
          </div>
          <p className="text-base text-black">
            Published {formatRelativeTime(data.creationAt)}
          </p>
        </div>
      </div>
      {!!productSlug && !isPreview && (
        <Link
          href={`/products/preview/${productSlug}`}
          className="text-sm font-bold mx-auto block w-max bg-primary hover:opacity-85 transition-all duration-300 text-white px-4 py-2 mt-10"
        >
          Preview
        </Link>
      )}
    </section>
  );
};

export default ProductDetails;
